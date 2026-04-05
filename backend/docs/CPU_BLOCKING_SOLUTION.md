# CPU Blocking Solution - Architecture Documentation

## Problem Statement

**Original Issue:** When 100 users upload CVs simultaneously, the synchronous `parseCV` function blocks Node.js's single-threaded event loop, freezing all other requests.

## Solution Architecture

### 3-Layer Async Processing

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: API Server                       │
│  Express.js (Main Thread)                                    │
│  - Receives upload request                                   │
│  - Uploads file to Cloudinary (async I/O)                    │
│  - Publishes job to RabbitMQ                                 │
│  - Returns 202 Accepted immediately                          │
│  - Event loop NEVER blocked                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  LAYER 2: RabbitMQ Queue                     │
│  CloudAMQP                                                   │
│  - Stores jobs persistently                                  │
│  - Handles 100+ concurrent jobs                              │
│  - Delivers jobs to workers (prefetch=4)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 LAYER 3: Worker Process                      │
│  Separate Node.js Process                                    │
│  - Consumes 4 jobs at a time (channel.prefetch(4))           │
│  - Downloads CV from Cloudinary (async I/O)                  │
│  - Spawns Worker Thread for CPU-intensive parsing            │
│  - Main thread remains responsive                            │
│  - Updates database with parsed text                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              LAYER 4: Worker Threads (CPU Pool)              │
│  Node.js Worker Threads                                      │
│  - Runs parseCV in isolated thread                           │
│  - CPU-intensive PDF/DOCX parsing                            │
│  - Does NOT block main event loop                            │
│  - Max 4 threads active (controlled by prefetch)             │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Controller (cvController.ts)

```typescript
export const uploadCV = asyncHandler(async (req: AuthRequest, res: Response) => {
  // 1. Upload to Cloudinary (async I/O - non-blocking)
  const uploadResult = await fileStorage.uploadFile(buffer, originalname);
  
  // 2. Create DB record with status='PENDING'
  const cv = await prisma.userCV.create({...});
  
  // 3. Publish job to RabbitMQ (async - non-blocking)
  await publishCVJob({
    cvId: cv.id,
    fileKey: uploadResult.fileKey,
    mimeType: mimetype,
    userId,
  });
  
  // 4. Return 202 immediately - user doesn't wait
  ResponseHandler.success(res, {...}, 'CV upload queued for processing', 202);
});
```

**Result:** API responds in ~200-500ms regardless of CV size.

### 2. RabbitMQ Queue (cvQueue.ts)

```typescript
export const publishCVJob = async (payload: CVJobPayload): Promise<void> => {
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(payload)), {
    persistent: true, // Survives RabbitMQ restarts
  });
};
```

**Features:**
- Persistent messages (survives crashes)
- Automatic reconnection
- Handles CloudAMQP free tier limitations

### 3. Worker Process (cvWorker.ts)

```typescript
// Limit concurrent processing to 4 jobs
channel.prefetch(4);

channel.consume(QUEUE_NAME, async (msg) => {
  const payload = JSON.parse(msg.content.toString());
  
  try {
    // Download file (async I/O - non-blocking)
    const buffer = await fileStorage.downloadFile(payload.fileKey);
    
    // Spawn Worker Thread for CPU work (non-blocking)
    const parsedText = await new Promise((resolve, reject) => {
      const worker = new Worker('./parseWorkerThread.js', {
        workerData: { buffer, mimeType: payload.mimeType }
      });
      
      worker.on('message', (result) => {
        if (result.success) resolve(result.parsedText);
        else reject(new Error(result.error));
      });
    });
    
    // Update database (async I/O - non-blocking)
    await prisma.userCV.update({
      where: { id: payload.cvId },
      data: { parsedText, status: 'DONE' }
    });
    
    channel.ack(msg);
  } catch (error) {
    await prisma.userCV.update({
      where: { id: payload.cvId },
      data: { status: 'FAILED' }
    });
    channel.nack(msg, false, false);
  }
});
```

**Key Points:**
- `prefetch(4)`: Max 4 jobs processing concurrently
- Worker Thread: CPU work isolated from main thread
- Main thread: Handles I/O, database, RabbitMQ

### 4. Worker Thread (parseWorkerThread.ts)

```typescript
import { parentPort, workerData } from 'worker_threads';

(async () => {
  try {
    const { parseCV } = await import('../services/parserService.js');
    const { buffer, mimeType } = workerData;
    
    // CPU-intensive work happens HERE (isolated thread)
    const parsedText = await parseCV(buffer, mimeType);
    
    parentPort?.postMessage({ success: true, parsedText });
  } catch (error) {
    parentPort?.postMessage({ success: false, error: error.message });
  }
})();
```

**Result:** CPU-intensive parsing runs in separate thread, main thread stays responsive.

## Performance Comparison

### Before (Blocking)

```
100 uploads → All hit API server
              ↓
         parseCV runs on main thread
              ↓
         Event loop BLOCKED for 3-5s per CV
              ↓
         Other requests FREEZE
              ↓
         Total time: 300-500 seconds (sequential)
```

### After (Non-Blocking)

```
100 uploads → API returns 202 in ~200ms each
              ↓
         Jobs queued in RabbitMQ
              ↓
         Worker processes 4 at a time
              ↓
         Each in separate Worker Thread
              ↓
         Main thread NEVER blocked
              ↓
         Total time: ~75-125 seconds (4x parallel)
         API remains responsive throughout
```

## Scalability

### Horizontal Scaling

Run multiple worker processes:

```bash
# Terminal 1
npm run worker

# Terminal 2
npm run worker

# Terminal 3
npm run worker
```

**Result:** 3 workers × 4 threads = 12 CVs processing simultaneously

### Production Deployment

```bash
# PM2 cluster mode
pm2 start dist/workers/cvWorker.js -i 4 --name cv-worker

# Docker Compose
services:
  worker:
    image: postify-worker
    deploy:
      replicas: 4
```

## Monitoring

### Check Queue Depth

CloudAMQP Dashboard → Queues → `cv.parse`

### Check Processing Status

```sql
SELECT status, COUNT(*) 
FROM user_cvs 
GROUP BY status;

-- PENDING: In queue
-- DONE: Successfully parsed
-- FAILED: Parsing failed
```

### Worker Health

```bash
# Check worker logs
pm2 logs cv-worker

# Check RabbitMQ connection
curl http://localhost:5000/health
```

## Failure Handling

### Worker Crash

- RabbitMQ retains unacknowledged messages
- New worker picks up jobs automatically
- No data loss

### RabbitMQ Disconnect

- Automatic reconnection (exponential backoff)
- Jobs remain in queue
- Processing resumes after reconnect

### Parsing Failure

- Job marked as `nack` (not acknowledged)
- Database updated with `status='FAILED'`
- Job removed from queue (no infinite retry)

## Testing

### Load Test

```bash
# Upload 100 CVs concurrently
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/cv/upload \
    -H "Authorization: Bearer $TOKEN" \
    -F "cv=@test.pdf" &
done
```

**Expected:**
- All requests return 202 in <1 second
- Worker processes 4 at a time
- API remains responsive
- No timeouts or errors

## Conclusion

✅ **Problem Solved:**
- API server never blocks
- CPU-intensive work isolated in Worker Threads
- Horizontal scalability via multiple workers
- Graceful failure handling
- Production-ready architecture

**Key Metrics:**
- API response time: ~200-500ms (constant)
- Throughput: 4 CVs per worker simultaneously
- Scalability: Linear with worker count
- Reliability: Persistent queue + auto-reconnect

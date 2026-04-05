import amqp from 'amqplib';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';
import { prisma } from '../utils/prisma.js';
import { logger } from '../infrastructure/logging/logger.js';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUEUE_NAME = 'cv.parse';
const RECONNECT_DELAY = 5000;

interface CVJobPayload {
  cvId: string;
  fileKey: string;
  mimeType: string;
  userId: string;
  buffer?: string; // Base64 encoded buffer
}

const processJob = async (payload: CVJobPayload): Promise<string> => {
  const { fileStorage } = await import('../services/fileStorageService.js');
  
  let buffer: Buffer;
  let finalFileKey: string;
  
  // If buffer is provided, upload to Cloudinary first
  if (payload.buffer) {
    logger.info('Uploading CV to Cloudinary', { cvId: payload.cvId });
    buffer = Buffer.from(payload.buffer, 'base64');
    const uploadResult = await fileStorage.uploadFile(buffer, payload.fileKey);
    finalFileKey = uploadResult.fileKey;
    logger.info('Cloudinary upload complete', { cvId: payload.cvId, fileKey: finalFileKey });
    
    // Update CV with real Cloudinary fileKey (handle if record was deleted)
    try {
      await prisma.userCV.update({
        where: { id: payload.cvId },
        data: { fileKey: finalFileKey },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        logger.warn('CV record not found, likely deleted by user', { cvId: payload.cvId });
        throw new Error('CV record was deleted');
      }
      throw error;
    }
  } else {
    // Download from Cloudinary (legacy path)
    logger.info('Downloading CV from Cloudinary', { cvId: payload.cvId });
    buffer = await fileStorage.downloadFile(payload.fileKey);
    finalFileKey = payload.fileKey;
  }
  
  logger.info('Starting Worker Thread for parsing', { cvId: payload.cvId });
  
  // Offload CPU-intensive parsing to Worker Thread
  return new Promise((resolve, reject) => {
    const workerFile = process.env.NODE_ENV === 'production' 
      ? 'parseWorkerThread.js' 
      : 'parseWorkerThread.ts';
    const workerPath = path.join(__dirname, workerFile);
    
    logger.debug('Worker path', { workerPath });
    
    const worker = new Worker(workerPath, {
      workerData: {
        buffer,
        mimeType: payload.mimeType,
      },
      execArgv: process.env.NODE_ENV === 'production' ? [] : ['--import', 'tsx'],
    });

    worker.on('message', (result: { success: boolean; parsedText?: string; error?: string }) => {
      logger.info('Worker message received', { success: result.success, hasText: !!result.parsedText });
      if (result.success && result.parsedText) {
        resolve(result.parsedText);
      } else {
        reject(new Error(result.error || 'Worker failed'));
      }
    });

    worker.on('error', (err: Error) => {
      logger.error('Worker error event', { error: err.message });
      reject(err);
    });
    
    worker.on('exit', (code) => {
      logger.info('Worker exit', { code });
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

const startWorker = async (): Promise<void> => {
  const connect = async () => {
    try {
      const connection = await amqp.connect(env.RABBITMQ_URL, {
        heartbeat: 60,
      });

      connection.on('error', (err) => {
        logger.error('Worker connection error', { error: err.message });
      });

      connection.on('close', () => {
        logger.warn('Worker connection closed, reconnecting...');
        setTimeout(connect, RECONNECT_DELAY);
      });

      const channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      channel.prefetch(3); // Render free tier: 3 jobs at a time (optimal)

      logger.info('CV Worker started', { queue: QUEUE_NAME });

      channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        const payload: CVJobPayload = JSON.parse(msg.content.toString());
        logger.info('Processing CV job', { cvId: payload.cvId });

        try {
          const parsedText = await processJob(payload);

          await prisma.userCV.update({
            where: { id: payload.cvId },
            data: {
              parsedText,
              status: 'DONE',
            },
          });

          channel.ack(msg);
          logger.info('CV parsed successfully', { cvId: payload.cvId });
        } catch (error) {
          logger.error('CV parsing failed', {
            cvId: payload.cvId,
            error: (error as Error).message,
          });

          try {
            await prisma.userCV.update({
              where: { id: payload.cvId },
              data: { status: 'FAILED' },
            });
          } catch (updateError: any) {
            if (updateError.code === 'P2025') {
              logger.warn('CV record not found when marking as failed', { cvId: payload.cvId });
            }
          }

          channel.nack(msg, false, false);
        }
      });

      const gracefulShutdown = async () => {
        logger.info('Worker shutting down...');
        await channel.close();
        await connection.close();
        process.exit(0);
      };

      process.on('SIGTERM', gracefulShutdown);
      process.on('SIGINT', gracefulShutdown);
    } catch (error) {
      logger.error('Worker connection failed', { error: (error as Error).message });
      setTimeout(connect, RECONNECT_DELAY);
    }
  };

  await connect();
};

startWorker();

# Backend API — Postify

![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue)

**Express.js 5 TypeScript REST API for AI-powered job application automation with Gmail integration.**

**Base URL:** `http://localhost:5000/api` (development) | `https://api.postify.app/api` (production)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [CV Upload Pipeline](#cv-upload-pipeline)
- [AI Providers](#ai-providers)
- [Security](#security)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Deployment](#deployment)

---

## Features

- **Google OAuth 2.0** — stateless JWT auth (HTTP-only cookie + Bearer token)
- **Async CV Pipeline** — RabbitMQ queue + Node.js Worker Threads for non-blocking PDF/DOCX parsing
- **Multi-Provider AI** — OpenAI, OpenRouter, HuggingFace, Ollama via unified OpenAI-compatible SDK
- **Gmail Integration** — sends email from user's own Gmail account via OAuth 2.0 + automatic token refresh
- **Cloudinary Storage** — authenticated CV file storage with signed download URLs
- **Repository Pattern + DI** — custom lightweight factory-based DI container
- **3-Tier Rate Limiting** — general / auth / upload limiters
- **Role-Based Access** — USER / ADMIN roles, admin assigned via email whitelist at OAuth time
- **Input Validation** — Zod schemas on all endpoints + DOMPurify XSS sanitization
- **Graceful Shutdown** — SIGTERM/SIGINT handlers close HTTP server, RabbitMQ connection, then exit

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Runtime | Node.js | ≥ 20.0.0 |
| Language | TypeScript | 5.9.3 |
| Framework | Express.js | 5.2.1 |
| Database | PostgreSQL | ≥ 14.0 |
| ORM | Prisma | 6.19.2 |
| Auth | Passport.js + passport-google-oauth20 | 0.7.0 |
| JWT | jsonwebtoken | 9.0.3 |
| Validation | Zod | 3.24.1 |
| Security | Helmet, express-rate-limit, DOMPurify, validator | — |
| File Upload | Multer (memory storage) | 2.0.2 |
| File Storage | Cloudinary | 2.9.0 |
| CV Parsing | pdf-parse + mammoth | — |
| AI | openai SDK (multi-provider) | 6.24.0 |
| Email | Nodemailer (MIME) + googleapis (Gmail API) | — |
| Queue | amqplib (RabbitMQ) | 0.10.5 |
| Concurrency | p-queue (Cloudinary uploads) | 9.1.1 |
| Language Detection | franc | 6.2.0 |
| Dev | tsx, ESLint, Prettier | — |

---

## Prerequisites

- **Node.js** ≥ 20.0.0
- **PostgreSQL** ≥ 14.0
- **RabbitMQ** instance (e.g. [CloudAMQP](https://www.cloudamqp.com/) free tier)
- **Google Cloud Console** project with OAuth 2.0 credentials and Gmail API enabled
- **Cloudinary** account
- One AI provider: OpenAI / OpenRouter / HuggingFace / Ollama

---

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment variables

Create `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/postify

# JWT (min 32 chars — generate: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Google OAuth (Google Cloud Console > Credentials)
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend
CLIENT_URL=http://localhost:3000

# AI Provider: openai | ollama | openrouter | huggingface
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

# Ollama (local)
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama3

# OpenRouter
# OPENROUTER_API_KEY=sk-or-...
# OPENROUTER_MODEL=anthropic/claude-3-haiku

# HuggingFace
# HF_TOKEN=hf_...
# HF_MODEL=deepseek-ai/DeepSeek-R1:novita

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret

# Admin (comma-separated emails — assigned ADMIN role at OAuth time)
ADMIN_EMAILS=admin@example.com

# Logging: error | warn | info | debug
LOG_LEVEL=info
```

### 3. Database setup

```bash
npm run prisma:generate   # generate Prisma client
npm run prisma:migrate    # run migrations
npm run prisma:studio     # (optional) open Prisma Studio
```

### 4. Run development server

```bash
# Terminal 1 — API server
npm run dev

# Terminal 2 — CV worker (only needed in development; runs in-process in production)
npm run worker
```

Server starts on **http://localhost:5000**

### 5. Build for production

```bash
npm run build             # tsc → dist/
npm run prisma:generate
npx prisma migrate deploy
npm start                 # node dist/index.js
```

In production, `cvWorker.ts` is imported in-process automatically (no separate dyno needed).

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # 4 models: User, UserCV, Application, OAuthToken
│   └── migrations/
├── src/
│   ├── config/
│   │   ├── env.ts                 # Zod-validated env schema (fails fast on startup)
│   │   ├── passport.ts            # GoogleStrategy: find-or-create user, upsert OAuth tokens
│   │   ├── cloudinary.ts          # Cloudinary SDK init
│   │   └── constants.ts           # FILE_UPLOAD, JWT, RATE_LIMIT, PROVIDERS, SMTP
│   ├── controllers/
│   │   ├── aiController.ts        # franc lang detect → AI generate → save DRAFT application
│   │   ├── cvController.ts        # upload (202 async) → RabbitMQ, CRUD, active/archive
│   │   ├── emailController.ts     # DOMPurify sanitize → EmailService → mark SENT
│   │   └── adminController.ts     # user management, CSV export, CV download
│   ├── di/
│   │   ├── container.ts           # factory-based DI (register / resolve / clear)
│   │   └── bindings.ts            # wire all repos + services at startup
│   ├── infrastructure/
│   │   ├── database/healthCheck.ts
│   │   └── logging/logger.ts      # JSON structured logger
│   ├── middleware/
│   │   ├── auth.ts                # protect: verify JWT → attach req.user
│   │   ├── admin.ts               # requireAdmin: role === ADMIN guard
│   │   ├── errorHandler.ts        # global AppError handler
│   │   ├── rateLimiter.ts         # general / auth / upload limiters
│   │   └── validate.ts            # Zod middleware factory
│   ├── queue/
│   │   └── cvQueue.ts             # RabbitMQ producer: connectQueue, publishCVJob
│   ├── repositories/
│   │   ├── userRepository.ts
│   │   ├── cvRepository.ts
│   │   ├── applicationRepository.ts
│   │   └── oauthTokenRepository.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── cvRoutes.ts
│   │   ├── aiRoutes.ts
│   │   ├── emailRoutes.ts
│   │   └── adminRoutes.ts
│   ├── services/
│   │   ├── aiService.ts           # OpenAI-compat SDK, 4 providers, JSON extraction
│   │   ├── emailService.ts        # TokenManager → download CV → Nodemailer MIME → Gmail API
│   │   ├── fileStorageService.ts  # Cloudinary upload/download/delete, PQueue(3), retry
│   │   ├── parserService.ts       # pdf-parse + mammoth (called from worker thread)
│   │   ├── promptBuilder.ts       # structured prompt: cover letter + subject + recruiterEmail
│   │   └── tokenManager.ts        # OAuth2 token refresh + persist to DB
│   ├── workers/
│   │   ├── cvWorker.ts            # RabbitMQ consumer → Cloudinary upload → Worker Thread
│   │   └── parseWorkerThread.ts   # CPU-bound PDF/DOCX parsing in isolated Worker Thread
│   ├── types/
│   │   ├── dtos.ts
│   │   ├── express.d.ts
│   │   └── jwt.types.ts
│   ├── utils/
│   │   ├── asyncHandler.ts
│   │   ├── errors.ts              # AppError hierarchy
│   │   ├── jwt.ts
│   │   ├── pagination.ts
│   │   ├── prisma.ts
│   │   ├── response.ts
│   │   └── validators.ts
│   ├── validators/
│   │   ├── aiValidation.ts
│   │   └── emailValidation.ts
│   ├── app.ts                     # Express setup: middleware stack + routes
│   └── index.ts                   # entry point: RabbitMQ → in-process worker → listen
├── .env
├── eslint.config.mjs
├── .prettierrc
├── package.json
└── tsconfig.json
```

---

## API Reference

### Endpoints overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Health check |
| GET | `/cron` | No | Keep-alive ping |
| GET | `/api/auth/google` | No | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | No | OAuth callback → JWT cookie |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/auth/logout` | No | Clear JWT cookie |
| POST | `/api/cv/upload` | JWT | Upload CV — returns 202, processes async |
| GET | `/api/cv` | JWT | List non-archived CVs |
| PUT | `/api/cv/:id/active` | JWT | Set CV as active |
| PUT | `/api/cv/:id/archive` | JWT | Toggle archive status |
| DELETE | `/api/cv/:id` | JWT | Delete CV |
| POST | `/api/ai/generate` | JWT | Generate cover letter → DRAFT application |
| POST | `/api/email/send` | JWT | Send application via Gmail API |
| GET | `/api/email/history` | JWT | Paginated application history |
| GET | `/api/admin/users` | ADMIN | Paginated user list |
| GET | `/api/admin/users/export` | ADMIN | Export users as CSV |
| GET | `/api/admin/users/:id` | ADMIN | User details + CVs + applications |
| DELETE | `/api/admin/users/:id` | ADMIN | Delete user (non-admin only) |
| GET | `/api/admin/cv/:cvId/download` | ADMIN | Download any user's CV |

---

### Health

#### `GET /health`

```json
{ "status": "ok" }
```

#### `GET /cron`

Keep-alive endpoint for Render free tier (prevents sleep).

```json
{ "status": "ok", "timestamp": "2026-07-10T10:00:00.000Z" }
```

---

### Authentication

#### `GET /api/auth/google`

Rate limited: 5 req / 15 min. Redirects to Google OAuth consent screen.

Scopes requested: `profile`, `email`, `gmail.send` (offline access + consent prompt to get refresh token).

#### `GET /api/auth/google/callback`

Handles OAuth callback. Finds or creates user. Upserts OAuth tokens. Signs JWT (7d). Sets HTTP-only cookie and redirects:

```
→ CLIENT_URL/auth/callback?token=<jwt>
```

The token is appended to the URL to bypass Safari's 3rd-party cookie blocking.

**Cookie set:**
```
token=<jwt>; HttpOnly; Secure (prod); SameSite=None (prod) / Lax (dev); MaxAge=7d
```

#### `GET /api/auth/me`

Returns the authenticated user with their active CV.

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatarUrl": "https://...",
      "role": "USER",
      "cvs": [{ "id": "uuid", "isActive": true, "..." : "..." }]
    }
  }
}
```

#### `POST /api/auth/logout`

Clears the JWT cookie.

```json
{ "success": true, "message": "Logged out successfully" }
```

---

### CV Management

#### `POST /api/cv/upload`

Upload a CV. Processing is **asynchronous** — returns `202 Accepted` immediately.

**Content-Type:** `multipart/form-data`  
**Field:** `cv` (PDF or DOCX, max 5 MB)  
**Rate limit:** 10 req / hour

**Response `202`:**
```json
{
  "success": true,
  "message": "CV upload queued for processing",
  "data": {
    "cv": {
      "id": "uuid",
      "fileName": "John_CV.pdf",
      "fileKey": "temp-1234567890-John_CV.pdf",
      "status": "PENDING",
      "isActive": true
    }
  }
}
```

The worker then uploads to Cloudinary, updates `fileKey`, parses the text, and sets `status` to `DONE` or `FAILED`. Poll `GET /api/cv` to check status.

#### `GET /api/cv`

Returns all non-archived CVs for the user, ordered by `uploadedAt` desc.

```json
{
  "success": true,
  "data": {
    "cvs": [
      {
        "id": "uuid",
        "fileName": "John_CV.pdf",
        "fileSize": 245678,
        "mimeType": "application/pdf",
        "status": "DONE",
        "isActive": true,
        "isArchived": false,
        "uploadedAt": "2026-07-10T10:00:00.000Z"
      }
    ]
  }
}
```

#### `PUT /api/cv/:id/active`

Sets the CV as active (deactivates all others in a transaction).

- `400` if CV is archived

#### `PUT /api/cv/:id/archive`

Toggles `isArchived`. Cannot archive the active CV.

#### `DELETE /api/cv/:id`

Permanently deletes CV record and Cloudinary file.

- `400` if CV is active
- `400` if CV has linked applications (archive instead)

---

### AI Generation

#### `POST /api/ai/generate`

Generates a cover letter from the job description using the active CV.

**Body:**
```json
{ "jobDescription": "We are looking for a senior full-stack developer..." }
```

**Validation:** `jobDescription` — min 50 chars, max 5000 chars.

**Flow:**
1. Fetches active CV (must have `status=DONE` and `parsedText`)
2. Detects language via `franc` (English / French / German / Spanish)
3. Calls AI provider via `PromptBuilder` prompt
4. Saves result as `DRAFT` application
5. Returns `applicationId` + generated content

**Response `200`:**
```json
{
  "success": true,
  "message": "Generated successfully",
  "data": {
    "applicationId": "uuid",
    "content": {
      "coverLetter": "Dear Hiring Manager,\n\nI am writing to...",
      "subject": "Application for Senior Full-Stack Developer",
      "recruiterEmail": "hr@company.com"
    }
  }
}
```

`recruiterEmail` is `null` if not found in the job description.

**Errors:**
- `404` — no active CV / CV not yet parsed (`PENDING`)
- `500` — AI provider error (connection refused, model not found, malformed JSON)

---

### Email

#### `POST /api/email/send`

Sends the application email via the user's Gmail account with CV attached.

**Body:**
```json
{
  "applicationId": "uuid",
  "to": "hr@company.com",
  "subject": "Application for Senior Full-Stack Developer",
  "body": "Dear Hiring Manager,\n\nI am writing to..."
}
```

**Flow:**
1. Validates email address
2. DOMPurify sanitizes `subject` (no tags) and `body` (`br`, `p`, `strong`, `em` only)
3. Fetches application (must belong to user)
4. `TokenManager.getValidAccessToken()` — refreshes OAuth token if needed, persists new token
5. Downloads CV buffer from Cloudinary (signed URL, 60s expiry)
6. Nodemailer builds raw MIME (HTML body + CV attachment)
7. Gmail API `users.messages.send()` delivers from user's own Gmail
8. Updates application `status=SENT`, `sentAt=now`

**Response `200`:**
```json
{ "success": true, "message": "Application sent successfully!" }
```

**Errors:**
- `400` — invalid email
- `404` — application not found
- `401` — Gmail token expired and refresh failed (user must re-login)
- `500` — email send failed

#### `GET /api/email/history`

Paginated application history.

**Query params:** `page` (default: 1), `limit` (default: 20)

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "recruiterEmail": "hr@company.com",
        "subject": "Application for...",
        "status": "SENT",
        "generatedAt": "2026-07-10T10:00:00.000Z",
        "sentAt": "2026-07-10T10:05:00.000Z",
        "cv": { "fileName": "John_CV.pdf" }
      }
    ],
    "pagination": {
      "page": 1, "limit": 20, "total": 45,
      "totalPages": 3, "hasNext": true, "hasPrev": false
    }
  }
}
```

---

### Admin

All admin endpoints require `role=ADMIN`. Admin role is assigned at OAuth time based on `ADMIN_EMAILS` env var.

#### `GET /api/admin/users`

Paginated user list with CV and application counts.

#### `GET /api/admin/users/export`

Returns a CSV file:
```
Content-Type: text/csv
Content-Disposition: attachment; filename=users-<timestamp>.csv

Email,Name,Role,Joined,CVs,Applications
user@example.com,John Doe,USER,7/10/2026,2,15
```

#### `GET /api/admin/users/:id`

Full user details including CVs (last 10) and paginated applications.

#### `DELETE /api/admin/users/:id`

- `400` if deleting own account
- `400` if target is ADMIN

#### `GET /api/admin/cv/:cvId/download`

Streams the CV file buffer with correct `Content-Type` and `Content-Disposition` headers.

---

## Authentication

### JWT flow

```
1. GET /api/auth/google
   → Passport GoogleStrategy (offline, consent prompt)

2. GET /api/auth/google/callback
   → find-or-create User in DB
   → upsert OAuthToken (accessToken + refreshToken)
   → signToken(user.id) → JWT (7d)
   → set HTTP-only cookie
   → redirect CLIENT_URL/auth/callback?token=<jwt>

3. All protected requests
   → protect middleware: reads cookie OR Authorization: Bearer <token>
   → verifyToken() → prisma.user.findUnique (includes active CV)
   → attaches req.user
```

### Token details

```json
{ "userId": "uuid", "iat": 1234567890, "exp": 1235172690 }
```

Expiry: **7 days**. Cookie: `HttpOnly`, `Secure` (prod), `SameSite=None` (prod) / `Lax` (dev).

---

## CV Upload Pipeline

```
POST /api/cv/upload
  │
  ├─ Multer (memory, 5MB, PDF/DOCX only)
  ├─ DB transaction: deactivate all CVs → create UserCV (status=PENDING, fileKey=temp-*)
  ├─ publishCVJob() → RabbitMQ queue: cv.parse (persistent, durable)
  └─ Return 202

RabbitMQ consumer (cvWorker.ts, prefetch=3):
  │
  ├─ Decode base64 buffer
  ├─ FileStorageService.uploadFile() → Cloudinary (authenticated raw, postify/cvs/)
  │    └─ PQueue concurrency=3, retry×3 with exponential backoff on rate limit
  ├─ Update UserCV.fileKey = Cloudinary public_id
  ├─ Spawn Worker Thread (parseWorkerThread.ts)
  │    ├─ PDF → pdf-parse
  │    └─ DOCX → mammoth
  ├─ Update UserCV: parsedText=<text>, status=DONE
  └─ On error: status=FAILED, nack (no requeue)
```

In **production**, `cvWorker.ts` runs in-process (same Node.js process as the API) via dynamic `import()` in `index.ts` — no separate worker dyno required.

---

## AI Providers

All providers use the `openai` npm SDK with a different `baseURL` and `apiKey`. Switch via `AI_PROVIDER` env var.

| Provider | `AI_PROVIDER` | Default model |
|---|---|---|
| OpenAI | `openai` | `gpt-4o` |
| OpenRouter | `openrouter` | `anthropic/claude-3-haiku` |
| HuggingFace | `huggingface` | `deepseek-ai/DeepSeek-R1:novita` |
| Ollama (local) | `ollama` | `llama3` |

`response_format: { type: 'json_object' }` is set only for OpenAI. Other providers rely on substring JSON extraction (`indexOf('{')` → `lastIndexOf('}')`).

---

## Security

| Measure | Implementation |
|---|---|
| Security headers | Helmet (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) |
| CORS | Whitelist: `CLIENT_URL`, `localhost:3000`, `localhost:5173` |
| Auth | JWT HTTP-only cookie (7d) + Bearer token fallback |
| OAuth tokens | Stored in `oauth_tokens` table, auto-refreshed on use |
| Rate limiting | 100/15min (general), 5/15min (auth), 10/hr (upload) |
| Input validation | Zod schemas on all endpoints |
| XSS | DOMPurify on email subject + body before send |
| SQL injection | Prisma parameterized queries only |
| File upload | MIME type + extension check, 5 MB limit, memory storage (no disk write) |
| CV files | Cloudinary `authenticated` type — no public URLs, signed download (60s) |
| Admin access | `requireAdmin` middleware + email whitelist at OAuth time |
| Env validation | Zod schema on startup — fails fast if any required var is missing |

---

## Error Handling

### Error hierarchy

```
AppError (base — statusCode, isOperational)
  ├── NotFoundError       404
  ├── ValidationError     400
  ├── UnauthorizedError   401
  ├── AIGenerationError   500
  ├── EmailSendError      500
  └── TokenRefreshError   401
```

### Response format

```json
{ "success": false, "error": "Error message" }
```

Development adds `"stack": "..."`.

### Status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 202 | Accepted (CV upload queued) |
| 400 | Validation / business rule error |
| 401 | Missing/invalid token or expired OAuth |
| 403 | Admin access required |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | AI / email / server error |

---

## Logging

JSON-structured logger with four levels: `error`, `warn`, `info`, `debug`.

Set via `LOG_LEVEL` env var. Debug is suppressed in production.

```json
{
  "timestamp": "2026-07-10T10:00:00.000Z",
  "level": "info",
  "message": "CV parsed successfully",
  "meta": { "cvId": "uuid" }
}
```

---

## Deployment

### Render (recommended — matches current setup)

1. Connect GitHub repo, select **Web Service**
2. Build command: `npm ci && npm run prisma:generate && npm run build`
3. Start command: `npm start`
4. Add all env vars from `.env` in the Render dashboard
5. Add a PostgreSQL database (or use Supabase)
6. Add a CloudAMQP RabbitMQ instance

The `/cron` endpoint should be pinged every 14 minutes by an external cron service (e.g. cron-job.org) to prevent Render free tier sleep.

### npm scripts

```bash
npm run dev              # tsx watch src/index.ts
npm run worker           # tsx watch src/workers/cvWorker.ts (dev only)
npm run build            # tsc
npm start                # node dist/index.js
npm run lint             # eslint src
npm run lint:fix
npm run format           # prettier --write
npm run format:check
npm run check            # lint + format:check
npm run prisma:generate
npm run prisma:migrate   # prisma migrate dev
npm run prisma:studio
```

---

## License

MIT © 2026 Postify

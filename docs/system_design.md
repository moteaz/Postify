# System Design — Postify MVP
## AI-Powered Job Application Assistant

> **Document Version**: 2.0
> **Date**: 2026-07-10
> **Status**: Reflects actual MVP implementation
> **Role**: Senior System Architect

---

## 1. High-Level Architecture

The system follows a **3-Tier Architecture**:

1. **Presentation Tier** — Next.js (App Router) frontend, deployed on Vercel
2. **Application Tier** — Express.js 5 REST API (Node.js 20, TypeScript), deployed on Render
3. **Data Tier** — PostgreSQL via Prisma ORM + Cloudinary for CV file storage

Four external service integrations are first-class concerns:
- **Google OAuth 2.0 + Gmail API** — authentication and email delivery from the user's own Gmail account
- **AI Provider** — pluggable: OpenAI GPT-4o / OpenRouter / HuggingFace / Ollama
- **Cloudinary** — authenticated CV file storage (CDN)
- **RabbitMQ** — async message queue for CV upload/parse pipeline

---

## 2. Actual Tech Stack (MVP)

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript 5.9 |
| Styling | TailwindCSS 4 + shadcn/ui |
| State | Zustand (client) + TanStack Query (server) |
| HTTP | Axios |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js 5 |
| Language | TypeScript 5.9 |
| Auth | Passport.js + Google OAuth 2.0 (passport-google-oauth20) |
| Session | Stateless JWT (HTTP-only cookie + Bearer token) |
| Validation | Zod (env schema + request schemas) |
| File Upload | Multer (memory storage, 5 MB limit, PDF/DOCX only) |
| CV Parsing | pdf-parse (Worker Thread) + mammoth (DOCX) |
| Email | Nodemailer (MIME builder) + Gmail API (googleapis) |
| Queue | RabbitMQ via amqplib (`cv.parse` queue) |
| Worker | Node.js Worker Threads (CPU-bound PDF/DOCX parsing) |
| Security | Helmet (CSP, HSTS, X-Frame-Options), CORS whitelist, DOMPurify (XSS), rate limiting |
| DI | Custom lightweight DI container (factory-based, no decorators) |
| Storage | Cloudinary (authenticated `raw` type, `postify/cvs/` folder) |
| Logging | Custom JSON logger (winston-style levels) |

### Database
| Layer | Technology |
|---|---|
| Primary DB | PostgreSQL 14+ |
| ORM | Prisma 6 (type-safe queries, migrations) |
| Hosting | Supabase / Railway / AWS RDS |

### AI Integration
| Provider | Config Key | Default Model |
|---|---|---|
| OpenAI | `AI_PROVIDER=openai` | `gpt-4o` |
| OpenRouter | `AI_PROVIDER=openrouter` | `anthropic/claude-3-haiku` |
| HuggingFace | `AI_PROVIDER=huggingface` | `deepseek-ai/DeepSeek-R1:novita` |
| Ollama (local) | `AI_PROVIDER=ollama` | `llama3` |

All providers are consumed through the **OpenAI-compatible SDK** (`openai` npm package), switching only `baseURL` and `apiKey`. Response format is forced to `json_object` for OpenAI; other providers rely on JSON extraction via substring parsing.

---

## 3. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                                │
│              Next.js Frontend — Vercel CDN                           │
│                                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Auth     │  │ Dashboard    │  │ Generate     │  │ History    │  │
│  │ (Google) │  │ (CV Upload)  │  │ (AI + Send)  │  │ (Apps)     │  │
│  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
└───────┼───────────────┼─────────────────┼────────────────┼──────────┘
        │   HTTPS + JWT Cookie / Bearer   │                │
        ▼                                 ▼                ▼
┌──────────────────────────────────────────────────────────────────────┐
│              APPLICATION TIER — Express.js 5 REST API                │
│                     Node.js 20 — Render                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Middleware Stack                                            │   │
│  │  Helmet → CORS → JSON Parser → CookieParser                 │   │
│  │  → Passport.initialize() → generalLimiter (100/15min)       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │/api/auth  │ │/api/cv   │ │/api/ai   │ │/api/email│ │/api/   │  │
│  │           │ │          │ │          │ │          │ │admin   │  │
│  │authLimiter│ │uploadLim.│ │protect   │ │protect   │ │protect │  │
│  │Passport   │ │protect   │ │Zod valid.│ │Zod valid.│ │+admin  │  │
│  │JWT cookie │ │Multer    │ │          │ │DOMPurify │ │guard   │  │
│  └─────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘  │
│        │            │            │             │           │       │
│  ┌─────▼────────────▼────────────▼─────────────▼───────────▼─────┐ │
│  │                    Controllers Layer                           │ │
│  │  authController  cvController  aiController  emailController  │ │
│  │                  adminController                               │ │
│  └─────────────────────────┬──────────────────────────────────────┘ │
│                             │                                        │
│  ┌──────────────────────────▼──────────────────────────────────────┐ │
│  │                    Services Layer                               │ │
│  │  AIService  EmailService  FileStorageService  TokenManager      │ │
│  │  ParserService  PromptBuilder                                   │ │
│  └──────────────────────────┬──────────────────────────────────────┘ │
│                             │                                        │
│  ┌──────────────────────────▼──────────────────────────────────────┐ │
│  │                  Repository Layer (DI Container)                │ │
│  │  UserRepository  CVRepository  ApplicationRepository           │ │
│  │  OAuthTokenRepository                                           │ │
│  └──────────────────────────┬──────────────────────────────────────┘ │
└─────────────────────────────┼────────────────────────────────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        ▼                     ▼                      ▼
┌───────────────┐   ┌──────────────────┐   ┌────────────────────┐
│  DATA TIER    │   │  ASYNC PIPELINE  │   │  EXTERNAL SERVICES │
│               │   │                  │   │                    │
│  PostgreSQL   │   │  RabbitMQ        │   │  Google OAuth 2.0  │
│  (Prisma ORM) │   │  Queue: cv.parse │   │  Gmail API         │
│               │   │       ↓          │   │  Cloudinary CDN    │
│  Tables:      │   │  cvWorker.ts     │   │  OpenAI / OR / HF  │
│  users        │   │  (amqplib)       │   │                    │
│  user_cvs     │   │       ↓          │   └────────────────────┘
│  applications │   │  parseWorker     │
│  oauth_tokens │   │  (Worker Thread) │
└───────────────┘   └──────────────────┘
```

---

## 4. Database Schema

```
users
  id (uuid PK)
  email (unique)
  name, avatarUrl
  provider: GOOGLE (enum)
  providerAccountId
  role: USER | ADMIN
  createdAt, updatedAt

user_cvs
  id (uuid PK)
  userId → users.id (CASCADE)
  fileName, fileKey (Cloudinary public_id), fileSize, mimeType
  parsedText (Text, nullable — populated async by worker)
  status: PENDING | DONE | FAILED
  isActive (bool), isArchived (bool), archivedAt
  uploadedAt, updatedAt
  indexes: (userId, isArchived), (userId, isActive)

applications
  id (uuid PK)
  userId → users.id (CASCADE)
  cvId → user_cvs.id
  jobDescription (Text)
  recruiterEmail, subject, coverLetter (Text)
  status: DRAFT | SENT | FAILED
  errorMessage (Text), retryCount
  generatedAt, sentAt, updatedAt
  indexes: (userId, status), (userId, generatedAt)

oauth_tokens
  id (uuid PK)
  userId → users.id (CASCADE)
  provider (default: "gmail")
  accessToken, refreshToken (Text)
  tokenExpiry, scope
  unique: (userId, provider)
```

---

## 5. Data Flows

### 5.1 Authentication Flow

```
1. Browser → GET /api/auth/google
   authLimiter (5/15min) → Passport GoogleStrategy
   Scopes: profile, email, gmail.send (offline access)

2. Google → GET /api/auth/google/callback
   Passport verifies → finds or creates User in DB
   Upserts OAuthToken (accessToken + refreshToken)
   Signs JWT (7d expiry)
   Sets HTTP-only cookie + redirects to /auth/callback?token=<jwt>
   (token in URL to bypass Safari 3rd-party cookie blocking)

3. All subsequent requests: JWT verified in protect middleware
   Supports: Authorization: Bearer <token> OR cookie
```

### 5.2 CV Upload & Parse Flow (Async Pipeline)

```
1. POST /api/cv/upload (Multer memory storage, 5MB, PDF/DOCX)
   → DB transaction:
     - Set all user CVs isActive=false
     - Create UserCV record (status=PENDING, fileKey=temp-*)
   → publishCVJob() → RabbitMQ queue: cv.parse
   → Return 202 immediately

2. cvWorker.ts (amqplib consumer, prefetch=3):
   → Receives job payload (cvId, mimeType, base64 buffer)
   → Uploads buffer to Cloudinary (authenticated raw, postify/cvs/)
     - Retry logic: 3 attempts, exponential backoff on rate limit
     - PQueue concurrency: 3
   → Updates UserCV.fileKey with real Cloudinary public_id
   → Spawns Worker Thread (parseWorkerThread.ts)
     - PDF: pdf-parse library
     - DOCX: mammoth library
   → Updates UserCV: parsedText=<text>, status=DONE
   → On failure: status=FAILED, nack message (no requeue)
```

### 5.3 AI Generation Flow

```
1. POST /api/ai/generate { jobDescription }
   protect middleware → Zod validation (50–5000 chars)

2. aiController:
   → CVRepository.findActiveByUserId() — must have parsedText
   → franc() language detection (eng/fra/deu/spa → English/French/German/Spanish)
   → generateApplicationContent(jobDescription, cvText, userName, language)

3. aiService:
   → PromptBuilder.buildCoverLetterPrompt() — structured prompt:
     * Job Description + CV text + candidate name + language
     * Instructs: cover letter (max 150 words) + subject + recruiterEmail
     * Response: strict JSON { coverLetter, subject, recruiterEmail }
   → OpenAI-compatible SDK call (model varies by provider)
   → JSON extraction: substring(indexOf('{'), lastIndexOf('}'))
   → Returns GenerationResult

4. ApplicationRepository.create() — status=DRAFT
   → Response: { applicationId, content: { coverLetter, subject, recruiterEmail } }
```

### 5.4 Email Send Flow

```
1. POST /api/email/send { applicationId, to, subject, body }
   protect middleware → Zod validation → isValidEmail(to)
   DOMPurify sanitization (subject: no tags, body: br/p/strong/em only)

2. emailController:
   → ApplicationRepository.findById(applicationId, userId)
   → EmailService.sendApplicationEmail(userId, to, subject, body, cvId)

3. EmailService:
   → TokenManager.getValidAccessToken(userId):
     * Fetches OAuthToken from DB
     * Calls google.auth.OAuth2.refreshAccessToken()
     * Persists new accessToken to DB
   → FileStorageService.downloadFile(cv.fileKey):
     * Generates Cloudinary signed private_download_url (60s expiry)
     * Fetches buffer via HTTP
   → Nodemailer (streamTransport + buffer=true) builds raw MIME:
     * From: user's Gmail, To: recruiter, Subject, HTML body, CV attachment
   → Base64url encode MIME → Gmail API users.messages.send()

4. ApplicationRepository.updateStatus() → status=SENT, sentAt=now
```

---

## 6. Architecture Patterns

### Dependency Injection Container
A lightweight factory-based DI container (`Container.register / Container.resolve`) wires all repositories and services at startup via `initializeContainer()`. No decorators or reflection — pure factory functions.

```
Container
  prisma → PrismaClient singleton
  userRepository → UserRepository(prisma)
  cvRepository → CVRepository(prisma)
  applicationRepository → ApplicationRepository(prisma)
  oauthTokenRepository → OAuthTokenRepository(prisma)
  tokenManager → TokenManager(oauthTokenRepository)
  emailService → EmailService(tokenManager, cvRepository, userRepository)
```

### Repository Pattern
All DB access is abstracted behind typed repository classes. Controllers and services never call Prisma directly (exception: adminController uses prisma directly for complex admin queries).

### Error Hierarchy
```
AppError (base, statusCode, isOperational)
  ├── NotFoundError (404)
  ├── ValidationError (400)
  ├── UnauthorizedError (401)
  ├── AIGenerationError (500)
  ├── EmailSendError (500)
  └── TokenRefreshError (401)
```
Global `errorHandler` middleware catches all errors, logs them, and returns structured JSON.

### Rate Limiting (3 tiers)
| Limiter | Window | Max | Applied to |
|---|---|---|---|
| `generalLimiter` | 15 min | 100 req | All `/api/*` routes |
| `authLimiter` | 15 min | 5 req | `/api/auth/google` |
| `uploadLimiter` | 60 min | 10 req | `/api/cv/upload` |

---

## 7. Security Measures

| Measure | Implementation |
|---|---|
| Auth | JWT (HTTP-only cookie, 7d expiry) + Bearer token fallback |
| OAuth | Google OAuth 2.0, stateless (session: false) |
| Token storage | Encrypted at rest in `oauth_tokens` table |
| Token refresh | Automatic via `TokenManager` on every email send |
| CORS | Whitelist: CLIENT_URL + localhost:3000/5173 |
| Security headers | Helmet (CSP, HSTS, X-Frame-Options, X-Content-Type) |
| Input validation | Zod schemas on all endpoints |
| XSS | DOMPurify on email subject/body before send |
| SQL injection | Prisma parameterized queries only |
| File upload | Type check (MIME + extension), 5 MB limit, memory storage (no disk) |
| Admin guard | `requireAdmin` middleware checks `user.role === ADMIN` |
| Admin assignment | Email whitelist via `ADMIN_EMAILS` env var at OAuth time |
| Rate limiting | 3-tier express-rate-limit |
| CV files | Cloudinary `authenticated` type — no public URLs |

---

## 8. API Endpoints Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Health check |
| GET | `/cron` | No | Keep-alive ping (Render free tier) |
| GET | `/api/auth/google` | No | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | No | OAuth callback → JWT cookie |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/auth/logout` | No | Clear JWT cookie |
| POST | `/api/cv/upload` | JWT | Upload CV (multipart, 202 async) |
| GET | `/api/cv` | JWT | List user's CVs (non-archived) |
| PUT | `/api/cv/:id/active` | JWT | Set CV as active |
| PUT | `/api/cv/:id/archive` | JWT | Toggle archive status |
| DELETE | `/api/cv/:id` | JWT | Delete CV (not active, no applications) |
| POST | `/api/ai/generate` | JWT | Generate cover letter → DRAFT application |
| POST | `/api/email/send` | JWT | Send application email via Gmail API |
| GET | `/api/email/history` | JWT | Paginated application history |
| GET | `/api/admin/users` | ADMIN | Paginated user list |
| GET | `/api/admin/users/:id` | ADMIN | User details + CVs + applications |
| DELETE | `/api/admin/users/:id` | ADMIN | Delete user (non-admin only) |
| GET | `/api/admin/users/export` | ADMIN | Export users as CSV |
| GET | `/api/admin/cv/:cvId/download` | ADMIN | Download any user's CV |

---

## 9. Infrastructure & Deployment

### Services Map
| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Next.js App Router |
| Backend API | Render (free tier) | Express.js, `/cron` endpoint for keep-alive |
| Database | Supabase / Railway | PostgreSQL 14+ |
| File Storage | Cloudinary | Authenticated raw files, `postify/cvs/` folder |
| Message Queue | CloudAMQP (RabbitMQ) | `cv.parse` queue, durable, classic type |
| AI | OpenAI / OpenRouter / HF | Configurable via `AI_PROVIDER` env |

### Render Free Tier Optimizations
- `cvWorker.ts` runs **in-process** (same Node.js process as API) in production via dynamic `import()` — avoids needing a separate worker dyno
- RabbitMQ `prefetch=3` — limits concurrent parse jobs to match free tier CPU
- Cloudinary upload `PQueue concurrency=3` — prevents rate limit exhaustion
- `/cron` endpoint — pinged externally to prevent Render free tier sleep

### Environment Variables (Backend)
```env
NODE_ENV, PORT
DATABASE_URL
JWT_SECRET                    # min 32 chars
RABBITMQ_URL                  # amqp(s):// URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
CLIENT_URL
AI_PROVIDER                   # openai | ollama | openrouter | huggingface
OPENAI_API_KEY, OPENAI_MODEL
OPENROUTER_API_KEY, OPENROUTER_MODEL
HF_TOKEN, HF_MODEL
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
ADMIN_EMAILS                  # comma-separated
LOG_LEVEL
```

---

## 10. Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # 4 models: User, UserCV, Application, OAuthToken
│   └── migrations/
├── src/
│   ├── config/
│   │   ├── env.ts             # Zod-validated env schema
│   │   ├── passport.ts        # GoogleStrategy: find-or-create user + upsert tokens
│   │   ├── cloudinary.ts      # Cloudinary SDK init
│   │   └── constants.ts       # FILE_UPLOAD, JWT, RATE_LIMIT, PROVIDERS, SMTP
│   ├── controllers/           # Thin request handlers, delegate to services/repos
│   │   ├── aiController.ts    # franc lang detect → generateApplicationContent → save DRAFT
│   │   ├── cvController.ts    # upload (202) → queue, CRUD, active/archive toggle
│   │   ├── emailController.ts # DOMPurify → EmailService → updateStatus SENT
│   │   └── adminController.ts # User management, CSV export, CV download
│   ├── di/
│   │   ├── container.ts       # Factory-based DI (register/resolve/clear)
│   │   └── bindings.ts        # Wire all repos + services at startup
│   ├── infrastructure/
│   │   ├── database/healthCheck.ts
│   │   └── logging/logger.ts  # JSON structured logger
│   ├── middleware/
│   │   ├── auth.ts            # protect: JWT verify → attach req.user
│   │   ├── admin.ts           # requireAdmin: role check
│   │   ├── errorHandler.ts    # Global AppError handler
│   │   ├── rateLimiter.ts     # general / auth / upload limiters
│   │   └── validate.ts        # Zod middleware factory
│   ├── queue/
│   │   └── cvQueue.ts         # RabbitMQ producer: connectQueue, publishCVJob
│   ├── repositories/          # Prisma data access layer
│   │   ├── userRepository.ts
│   │   ├── cvRepository.ts
│   │   ├── applicationRepository.ts
│   │   └── oauthTokenRepository.ts
│   ├── routes/
│   │   ├── auth.ts, cvRoutes.ts, aiRoutes.ts, emailRoutes.ts, adminRoutes.ts
│   ├── services/
│   │   ├── aiService.ts       # OpenAI-compat SDK, multi-provider, JSON extraction
│   │   ├── emailService.ts    # TokenManager → download CV → Nodemailer MIME → Gmail API
│   │   ├── fileStorageService.ts # Cloudinary upload/download/delete, PQueue, retry
│   │   ├── parserService.ts   # pdf-parse + mammoth (used by worker)
│   │   ├── promptBuilder.ts   # Structured prompt: cover letter + subject + email
│   │   └── tokenManager.ts    # OAuth2 token refresh + persist
│   ├── workers/
│   │   ├── cvWorker.ts        # RabbitMQ consumer → Cloudinary upload → Worker Thread
│   │   └── parseWorkerThread.ts # CPU-bound PDF/DOCX parsing in Worker Thread
│   ├── types/, utils/, validators/
│   ├── app.ts                 # Express app setup, middleware stack, routes
│   └── index.ts               # Server start: RabbitMQ connect → in-process worker → listen
```
t overhead |
| Email Strategy | **Gmail API** (OAuth) | Emails sent from user's real Gmail; highest deliverability & trust |
| AI Provider | **OpenAI GPT-4o** (primary) | Best quality for professional writing; Gemini as fallback |
| Database | **PostgreSQL via Supabase** | Managed, scalable, includes Storage |
| CV Storage | **S3-compatible object storage** | Scalable, secure, cost-effective |
| Frontend Deployment | **Vercel** | Zero-config Next.js deployment |
| Backend Deployment | **Railway / Render** | Simple Node.js container hosting, auto-scaling |

---

*End of Phase 2 — System Design*

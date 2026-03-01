# Phase 2 — System Design
## Postify — AI-Powered Job Application Assistant

> **Document Version**: 1.0  
> **Date**: 2026-02-24  
> **Status**: Draft  
> **Role**: Senior System Architect

---

## 1. High-Level Architecture (HLD)

The system follows a **3-Tier Architecture** with a clear separation between:

1. **Presentation Tier** — Next.js 14 frontend (SSR + CSR hybrid), deployed on Vercel
2. **Application Tier** — Dedicated **Express.js** REST API server (Node.js 20), handling all business logic, AI orchestration, and email dispatch
3. **Data Tier** — PostgreSQL (relational data) + cloud object storage (CVs)

Additionally, **two external service integrations** are first-class concerns:
- **AI API** (OpenAI GPT-4 / Google Gemini) for content generation
- **Gmail API** for email delivery directly from the user's own Gmail account

The architecture is **cloud-native**: Next.js frontend on Vercel, Express.js backend on Railway / Render / AWS, and Supabase for database + storage.

---

## 2. Tech Stack Recommendation

### Frontend
| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR/SSG, file-based routing, excellent DX, Vercel-native |
| Language | **TypeScript** | Type safety, maintainability |
| Styling | **Tailwind CSS** | Rapid UI development, responsive design |
| UI Components | **shadcn/ui** | Accessible, customizable components built on Radix UI |
| State Management | **Zustand** | Lightweight, simple client state (no Redux overhead) |
| Forms | **React Hook Form + Zod** | Performant forms with schema validation |
| HTTP Client | **Axios / fetch** | API calls to backend routes |

### Backend
| Layer | Technology | Rationale |
|---|---|---|
| Runtime | **Node.js 20 LTS** | V8 engine, async I/O, large ecosystem |
| Framework | **Express.js** (dedicated REST API server) | Flexible, mature, clean separation from frontend |
| Language | **TypeScript** | Type safety, consistent with frontend |
| Auth | **Passport.js** + **Google OAuth 2.0** | Industry-standard OAuth middleware for Express |
| Middleware | **express-session** + **express-rate-limit** | Session management and rate limiting |
| File Upload | **Multer** | Multipart file handling for CV uploads |
| File Parsing | **pdf-parse / mammoth** | Parse CV content (PDF/DOCX) for AI prompt injection |
| Email | **Nodemailer** + **Gmail API** (googleapis) | Send emails from user's Gmail account |
| Validation | **Zod** | Runtime schema validation for all API inputs |

### Database
| Layer | Technology | Rationale |
|---|---|---|
| Primary DB | **PostgreSQL 16** | ACID, relational integrity, mature ecosystem |
| ORM | **Prisma** | Type-safe DB access, schema migrations, great DX |
| Dev Hosting | **Local PostgreSQL** | Run locally during development |
| Prod Hosting | **Supabase** or **AWS RDS** | Managed PostgreSQL for production |
| File Storage | **AWS S3** or **Supabase Storage** | Scalable object storage for CVs |

### AI Integration
| Layer | Technology | Rationale |
|---|---|---|
| Primary | **OpenAI GPT-4o** via official SDK | Best quality for professional writing tasks |
| Fallback | **Google Gemini Pro** | Cost-effective alternative, good at extraction tasks |
| Language Detection | **franc** (npm) | Lightweight library to detect JD language; prompt AI to respond in same language |

### Email Integration
| Layer | Technology | Rationale |
|---|---|---|
| Preferred | **Gmail API** (OAuth 2.0) | Email sent from user's own account; high deliverability |
| Alternative | **SendGrid / Resend** | Platform-managed sending; simpler but less personal |

### DevOps & Infrastructure
| Layer | Technology |
|---|---|
| Frontend Hosting | **Vercel** (Next.js) |
| Backend Hosting | **Railway** or **Render** (Express.js server) |
| CI/CD | **GitHub Actions** |
| Monitoring | **Sentry** (errors) + **Vercel Analytics** |
| Secrets | `.env` + platform environment variables |
| Storage | **AWS S3** or **Supabase Storage** |

---

## 3. System Architecture Diagram (Text Form)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           USER'S BROWSER                                 │
│              (Next.js 14 Frontend — Vercel CDN)                          │
│                                                                          │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Auth Page    │  │  Dashboard   │  │ Generate │  │   History     │  │
│  │  (Sign in     │  │  (Upload CV) │  │  Page    │  │   Page        │  │
│  │   with Google)│  │              │  │          │  │               │  │
│  └──────┬────────┘  └──────┬───────┘  └────┬─────┘  └──────┬────────┘  │
└─────────┼─────────────────┼───────────────┼───────────────┼────────────┘
          │   HTTPS / TLS   │               │               │
          ▼                 ▼               ▼               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│             APPLICATION TIER — Express.js REST API (TypeScript)          │
│                    [Railway / Render — Node.js 20]                       │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Auth Router  │  │  CV Router   │  │  AI Router   │  │Email Router │ │
│  │  (Passport + │  │  (Multer +   │  │ (OpenAI SDK  │  │(Nodemailer+ │ │
│  │  Google OAuth)│  │  pdf-parse) │  │  + Zod)      │  │ Gmail API)  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                  │                 │        │
│  ┌──────▼─────────────────▼──────────────────▼─────────────────▼──────┐ │
│  │                      Business Logic Layer                           │ │
│  │          (Zod Validation, Rate Limiting, Error Handling)            │ │
│  └──────────────────────────────┬───────────────────────────────────────┘│
└─────────────────────────────────┼────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼────────────────────────┐
          ▼                       ▼                        ▼
┌──────────────────┐   ┌────────────────────┐   ┌─────────────────────┐
│   DATA TIER       │   │   AI SERVICE        │   │   EMAIL SERVICE     │
│                  │   │                    │   │                     │
│  ┌────────────┐  │   │  ┌──────────────┐ │   │  ┌───────────────┐  │
│  │ PostgreSQL │  │   │  │ OpenAI GPT-4o│ │   │  │   Gmail API   │  │
│  │ (Supabase) │  │   │  │     API      │ │   │  │  (OAuth 2.0)  │  │
│  └────────────┘  │   │  └──────────────┘ │   │  └───────────────┘  │
│                  │   │  ┌──────────────┐ │   └─────────────────────┘
│  ┌────────────┐  │   │  │   Gemini     │ │
│  │  AWS S3 /  │  │   │  │  (Fallback)  │ │
│  │  Supabase  │  │   │  └──────────────┘ │
│  │  Storage   │  │   └────────────────────┘
│  │  (CVs)     │  │
│  └────────────┘  │
└──────────────────┘
```

---

## 4. Data Flow

### Primary Flow: Generate & Send Application

```
Step 1: USER pastes Job Description → Next.js frontend validates (non-empty with 50 min carac)

Step 2: Frontend sends POST https://api.yourdomain.com/api/generate
        Headers: { Authorization: Bearer <session_token> }
        Payload: { jobDescription: string }

Step 3: Express Route → CV Service
        - Fetches user's CV from S3 using user ID from JWT
        - Parses CV content (PDF → text via pdf-parse)

Step 4: Express Route → AI Service
        - Builds structured prompt:
            [System]: You are a professional career coach...
            [User]: Job Description: {JD}
                    My CV: {CV_content}
                    Generate: cover letter, email subject, recruiter email
        - Calls OpenAI GPT-4o API
        - Returns structured JSON: { coverLetter, subject, recruiterEmail }

Step 5: Express Route → Next.js Frontend
        - Returns generated content as JSON
        - Frontend displays in editable fields

Step 6: USER reviews, edits, clicks "Send Email"

Step 7: Frontend sends POST https://api.yourdomain.com/api/email/send
        Payload: { to, subject, body }

Step 8: Express Route → Email Service
        - Fetches CV file from S3 (as buffer)
        - Constructs email using Nodemailer:
            To: recruiter email
            Subject: generated subject
            Body: cover letter (HTML formatted)
            Attachment: CV file
        - Calls Gmail API with user's stored OAuth tokens
        - Gmail delivers email

Step 9: Express Route → Database (Prisma → PostgreSQL)
        - Logs application: { userId, recruiterEmail, subject, status, timestamp }

Step 10: Express Route → Next.js Frontend
         - Returns success/failure status
         - Frontend shows success toast or error message
```

---

## 5. Database Design (ERD — Text Form)

```
┌──────────────────────────────────┐
│              users               │
├──────────────────────────────────┤
│ id             UUID  PK          │
│ email          VARCHAR(255) UNIQUE│
│ name           VARCHAR(255)       │
│ avatarUrl      VARCHAR(500)       │  ← from Google profile
│ provider       ENUM('google')     │  ← Google OAuth only
│ providerAccountId VARCHAR(255)    │
│ createdAt      TIMESTAMP          │
│ updatedAt      TIMESTAMP          │
└───────────────┬──────────────────┘
                │ 1
                │
                │ has many
                │
                ▼ N
┌──────────────────────────────────┐
│           user_cvs               │
├──────────────────────────────────┤
│ id             UUID  PK          │
│ userId         UUID  FK → users  │
│ fileName       VARCHAR(255)       │
│ fileKey        VARCHAR(500)       │  ← S3 object key
│ fileSize       INTEGER            │
│ mimeType       VARCHAR(100)       │
│ isActive       BOOLEAN DEFAULT true│
│ uploadedAt     TIMESTAMP          │
└───────────────┬──────────────────┘
                │
                │ 1 (active CV per user)
                │
                │ referenced by
                │
                ▼
┌──────────────────────────────────┐
│          applications            │
├──────────────────────────────────┤
│ id             UUID  PK          │
│ userId         UUID  FK → users  │
│ cvId           UUID  FK → user_cvs│
│ jobDescription TEXT              │
│ recruiterEmail VARCHAR(255)       │
│ subject        VARCHAR(500)       │
│ coverLetter    TEXT              │
│ generatedAt    TIMESTAMP          │
│ sentAt         TIMESTAMP          │
│ status         ENUM('draft','sent','failed')│
│ errorMessage   TEXT              │  ← null on success
│ retryCount     INTEGER DEFAULT 0  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│         oauth_tokens             │
├──────────────────────────────────┤
│ id             UUID  PK          │
│ userId         UUID  FK → users UNIQUE│
│ provider       ENUM('gmail')     │
│ accessToken    TEXT  (encrypted) │
│ refreshToken   TEXT  (encrypted) │
│ tokenExpiry    TIMESTAMP         │
│ scope          VARCHAR(500)       │
│ createdAt      TIMESTAMP          │
│ updatedAt      TIMESTAMP          │
└──────────────────────────────────┘
```

**Relationships Summary:**
- `users` → `user_cvs`: One-to-Many (user can upload multiple CVs; one marked `isActive`)
- `users` → `applications`: One-to-Many
- `user_cvs` → `applications`: One-to-Many (an application references the CV used)
- `users` → `oauth_tokens`: One-to-One (per provider)

---

## 6. API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/auth/google` | Initiate Google OAuth 2.0 flow | ❌ |
| `GET` | `/api/auth/google/callback` | Google OAuth callback — create/update user session | ❌ |
| `POST` | `/api/auth/logout` | Invalidate session | ✅ |
| `GET` | `/api/auth/me` | Get current authenticated user profile | ✅ |

### CV Management
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/cv/upload` | Upload CV file (multipart/form-data) | ✅ |
| `GET` | `/api/cv` | Get current active CV metadata | ✅ |
| `DELETE` | `/api/cv/:id` | Delete a CV | ✅ |

### AI Generation
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/generate` | Generate cover letter, subject, recruiter email | ✅ |

**Request Body:**
```json
{
  "jobDescription": "string (required, max 10000 chars)"
}
```
**Response:**
```json
{
  "coverLetter": "string",
  "subject": "string",
  "recruiterEmail": "string | null",
  "generationId": "uuid"
}
```

### Email Sending
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/email/send` | Send application email | ✅ |
| `GET` | `/api/email/auth` | Initiate Gmail OAuth flow | ✅ |
| `GET` | `/api/email/callback` | Gmail OAuth callback | ✅ |

**Request Body:**
```json
{
  "to": "recruiter@company.com",
  "subject": "Application for Software Engineer",
  "body": "Dear Hiring Manager...",
  "applicationId": "uuid (optional, for logging)"
}
```

### Application History
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/applications` | List user's applications (paginated) | ✅ |
| `GET` | `/api/applications/:id` | Get application details | ✅ |
| `DELETE` | `/api/applications/:id` | Delete an application record | ✅ |

### Admin (Protected by Admin Role)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all users | ✅ Admin |
| `PUT` | `/api/admin/users/:id/suspend` | Suspend a user | ✅ Admin |
| `GET` | `/api/admin/stats` | API usage, email stats | ✅ Admin |

---

## 7. AI Integration Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   AI INTEGRATION WORKFLOW                    │
└─────────────────────────────────────────────────────────────┘

1. USER submits Job Description via UI
        │
        ▼
2. Express Route: POST /api/generate
        │
        ├── Fetch user's CV from S3 bucket
        │
        ├── Parse CV content:
        │       PDF  → pdf-parse  → plain text
        │       DOCX → mammoth    → plain text
        │
        ├── Truncate CV to 3000 tokens if needed
        │   (to fit within AI context window)
        │
        ├── Build Structured Prompt:
        │   ┌────────────────────────────────────────────────┐
        │   │ SYSTEM: You are an expert career coach and     │
        │   │ professional writer. Your task is to analyze   │
        │   │ a job description and a candidate's CV to     │
        │   │ produce:                                        │
        │   │ 1. A tailored, professional cover letter       │
        │   │    (max 350 words, formal tone)                │
        │   │ 2. A concise email subject line                │
        │   │ 3. The recruiter's email address (if present)  │
        │   │                                                │
        │   │ Respond ONLY in this JSON format:              │
        │   │ {                                              │
        │   │   "coverLetter": "...",                        │
        │   │   "subject": "...",                            │
        │   │   "recruiterEmail": "..." or null              │
        │   │ }                                              │
        │   └────────────────────────────────────────────────┘
        │   ┌────────────────────────────────────────────────┐
        │   │ USER: Job Description: {JD_TEXT}               │
        │   │       My CV/Resume: {CV_TEXT}                  │
        │   └────────────────────────────────────────────────┘
        │
        ├── Call OpenAI GPT-4o API:
        │       model: "gpt-4o"
        │       temperature: 0.7
        │       max_tokens: 1500
        │       response_format: { type: "json_object" }
        │
        ├── Parse JSON response
        │
        ├── Validate response fields (Zod schema)
        │
        ├── On error → Retry once → Fallback to Gemini Pro
        │
        └── Return structured result to frontend
```

**Prompt Engineering Principles:**
- Use **structured JSON output** mode to guarantee parseable response
- Include **few-shot examples** in system prompt for consistent formatting
- Inject **user name** from profile to personalize salutation
- Use **temperature 0.7** — balanced between creativity and professionalism
- Apply **token budget** management to prevent context overflow

---

## 8. Gmail API Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  GMAIL API INTEGRATION FLOW                  │
└─────────────────────────────────────────────────────────────┘

STEP A: OAUTH AUTHORIZATION (One-time per user)
──────────────────────────────────────────────
1. User clicks "Connect Gmail" (or triggered on first "Send Email")
        │
        ▼
2. Backend generates Google OAuth 2.0 Authorization URL:
   - scopes: ["gmail.send", "gmail.readonly"] (minimal scopes)
   - redirect_uri: https://yourdomain.com/api/email/callback
   - state: {userId, csrfToken}
        │
        ▼
3. User is redirected to Google Consent Screen
   → User grants permission
        │
        ▼
4. Google redirects to /api/email/callback with ?code=...
        │
        ▼
5. Backend exchanges code for tokens:
   - accessToken  (expires in 1 hour)
   - refreshToken (long-lived)
        │
        ▼
6. Backend encrypts tokens and stores in oauth_tokens table


STEP B: SENDING EMAIL
──────────────────────────────────────────────
1. User clicks "Send Email"
        │
        ▼
2. Backend retrieves oauth_tokens for user
        │
        ├── If accessToken expired → Use refreshToken to get new accessToken
        │       (via googleapis oauth2Client.refreshAccessToken())
        │       → Persist new tokens to DB
        │
        ├── Fetch CV file from S3 as Buffer
        │
        ├── Compose email using Nodemailer:
        │   ┌────────────────────────────────────────────┐
        │   │ const mailOptions = {                      │
        │   │   from: user.email,                        │
        │   │   to: recruiterEmail,                      │
        │   │   subject: subject,                        │
        │   │   text: coverLetter,           ← plaintext │
        │   │   html: formatAsHTML(coverLetter), ← HTML  │
        │   │   attachments: [{                          │
        │   │     filename: 'CV.pdf',                    │
        │   │     content: cvBuffer,                     │
        │   │     contentType: 'application/pdf'         │
        │   │   }]                                       │
        │   │ }                                          │
        │   └────────────────────────────────────────────┘
        │
        ├── Convert email to RFC 2822 Base64 format
        │
        ├── Send via Gmail API:
        │   gmail.users.messages.send({
        │     userId: 'me',
        │     requestBody: { raw: base64EncodedEmail }
        │   })
        │
        ├── On success → log application status = 'sent'
        │
        └── On failure → log error, increment retryCount
                      → return error to frontend
```

---

## 9. Security Considerations

### 9.1 Authentication & Session Security
- Use **Passport.js** with Google OAuth 2.0; JWT access tokens issued after successful Google login
- Enforce **HTTPS-only** cookies with `Secure`, `HttpOnly`, `SameSite=Strict` flags
- Implement **CSRF protection** on all state-mutating Express API endpoints
- **Rate limit** all API routes using `express-rate-limit` to prevent abuse

### 9.2 Data Encryption
| Data | At Rest | In Transit |
|---|---|---|
| Google OAuth tokens (login) | JWT signed with server secret | TLS 1.3 |
| Gmail OAuth tokens (email) | AES-256-GCM (server-side) | TLS 1.3 |
| CV files | S3 SSE-S3 or SSE-KMS | TLS 1.3 + Presigned URLs |
| Application data | PostgreSQL TDE (Supabase) | TLS 1.3 |

### 9.3 API Security
- All API routes behind **authentication middleware** (auth check via NextAuth session)
- **Input validation** on every endpoint using Zod schemas
- **Rate limiting** on AI generation: **max 20 generations/day per user** (MVP quota — enforced via Redis counter or DB counter)
- **File upload validation**: verify MIME type server-side, not just extension; scan for malware using ClamAV or S3 Macie

### 9.4 CV & Personal Data
- CVs stored in **private S3 buckets** — never publicly accessible
- Access via **pre-signed URLs** with short expiry (5 minutes)
- CV content sent to AI API only after user consent; documented in privacy policy
- **GDPR**: implement `/api/user/export` and `/api/user/delete` endpoints

### 9.5 Gmail OAuth Security
- Request **minimum required scopes** (`gmail.send` only)
- Store tokens **encrypted** in DB, never in localStorage or cookies
- Implement **token refresh** silently; revoke tokens on account deletion
- Log all email-sending actions for audit trail

### 9.6 Infrastructure Security
- Secrets stored in **Vercel Environment Variables** (server-side only)
- Enable **Vercel WAF** (Web Application Firewall) for DDoS protection
- Regular **dependency audits** (`npm audit`) in CI/CD pipeline
- **Sentry** for error monitoring (filter PII before logging)

---

## 10. Scalable Architecture for Future Growth

### Phase 1 — MVP (Months 1–3)
```
Postify — Monorepo structure:
  frontend/  →  Next.js 14       → localhost:3000 (dev) / Vercel (prod)
  backend/   →  Express.js + TS  → localhost:5000 (dev) / Railway (prod)

+ Local PostgreSQL (dev) → Supabase (prod)
+ Local file storage (dev) → AWS S3 / Supabase Storage (prod)
+ OpenAI GPT-4o API
+ Gmail API (Google OAuth)
+ franc (language detection)
```
*Clean monorepo, local-first development, deploy when ready.*

---

### Phase 2 — Growth (Months 4–12)
```
Introduce:
+ Job Queue: BullMQ + Redis (for async AI generation tasks)
+ CDN: Cloudflare for static assets
+ Caching: Redis for AI responses (same JD = cache hit)
+ Monitoring: Datadog / Grafana dashboards
+ A/B Testing: prompt variations for cover letter quality
```

---

### Phase 3 — Scale (Year 2+)
```
Microservices Extraction:
┌──────────────┐  ┌──────────────┐  ┌────────────────┐
│  Auth Service│  │  AI Service  │  │  Email Service │
│  (dedicated) │  │  (dedicated) │  │  (dedicated)   │
└──────────────┘  └──────────────┘  └────────────────┘
         │                │                  │
         └────────────────┼──────────────────┘
                          │
                   API Gateway (Kong / AWS API Gateway)
                          │
                   Message Queue (Kafka / RabbitMQ)
                          │
             Multiple Worker Pods (Kubernetes / ECS)

Database:
  PostgreSQL (main) + Read Replicas
  Redis Cluster (caching + queues)
  S3 (multi-region replication for CVs)
```

### Scalability Strategies Summary

| Strategy | Implementation | Benefit |
|---|---|---|
| **Horizontal Scaling** | Stateless API → scale out with Kubernetes pods | Handle traffic spikes |
| **Async Job Queue** | BullMQ — AI generation in background workers | Prevent request timeouts |
| **Caching** | Redis for AI results; CDN for static assets | Reduce latency & API costs |
| **Database Pooling** | PgBouncer / Supabase built-in pooler | Handle concurrent DB connections |
| **Multi-region** | Deploy to EU + US regions (Vercel Edge) | Reduce latency globally |
| **AI Cost Control** | Cache responses; use cheaper models for drafts | Control OpenAI spend |
| **Rate Limiting** | Per-user quotas via Redis counters | Prevent abuse & cost overrun |
| **Observability** | Distributed tracing (OpenTelemetry) | Diagnose issues at scale |

---

## Architecture Decision Record (ADR) Summary

| Decision | Choice | Rationale |
|---|---|---|
| Frontend Framework | **Next.js 14** | SSR, Vercel-native, great DX |
| Backend Framework | **Express.js + TypeScript** | Flexible REST API, clean separation from frontend |
| Authentication | **Passport.js + Google OAuth 2.0** | Google-only auth; no password management overhead |
| Email Strategy | **Gmail API** (OAuth) | Emails sent from user's real Gmail; highest deliverability & trust |
| AI Provider | **OpenAI GPT-4o** (primary) | Best quality for professional writing; Gemini as fallback |
| Database | **PostgreSQL via Supabase** | Managed, scalable, includes Storage |
| CV Storage | **S3-compatible object storage** | Scalable, secure, cost-effective |
| Frontend Deployment | **Vercel** | Zero-config Next.js deployment |
| Backend Deployment | **Railway / Render** | Simple Node.js container hosting, auto-scaling |

---

*End of Phase 2 — System Design*

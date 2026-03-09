# Postify - System Design Document

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js 16 Frontend (React 19)                          │  │
│  │  - Server-Side Rendering (SSR)                           │  │
│  │  - Static Site Generation (SSG)                          │  │
│  │  - Client-Side Rendering (CSR)                           │  │
│  │  - TanStack Query (State Management)                     │  │
│  │  - Zustand (Auth State)                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js 5 REST API                                   │  │
│  │  - Helmet (Security Headers)                             │  │
│  │  - CORS (Cross-Origin)                                   │  │
│  │  - Rate Limiting                                         │  │
│  │  - JWT Authentication                                    │  │
│  │  - Passport.js (OAuth)                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                        │
│  ┌──────────────┬──────────────┬──────────────┬─────────────┐  │
│  │  Services    │  Repositories│  Middleware  │  Validators │  │
│  │  - AI        │  - User      │  - Auth      │  - Zod      │  │
│  │  - Email     │  - CV        │  - Admin     │  - Custom   │  │
│  │  - Parser    │  - App       │  - Error     │             │  │
│  │  - Storage   │  - Token     │  - Rate Limit│             │  │
│  └──────────────┴──────────────┴──────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM                                              │  │
│  │  - Type-Safe Queries                                     │  │
│  │  - Migration Management                                  │  │
│  │  - Connection Pooling                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                     │  │
│  │  - Users, CVs, Applications, OAuth Tokens                │  │
│  │  - Indexes for Performance                               │  │
│  │  - ACID Transactions                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────────┐  │
│  │  Google  │  Gmail   │Cloudinary│   AI     │  Nodemailer  │  │
│  │  OAuth   │   API    │   CDN    │ Providers│    MIME      │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Pattern

**Pattern:** Layered Architecture with Dependency Injection

**Layers:**
1. **Presentation Layer:** Next.js frontend
2. **API Layer:** Express.js REST endpoints
3. **Business Logic Layer:** Services, repositories, middleware
4. **Data Access Layer:** Prisma ORM
5. **Persistence Layer:** PostgreSQL database

**Benefits:**
- Clear separation of concerns
- Testability through DI
- Maintainability
- Scalability

---

## 2. Component Design

### 2.1 Backend Components

#### 2.1.1 Application Entry Point

```typescript
// src/index.ts
- Server initialization
- Graceful shutdown (SIGTERM, SIGINT)
- Port binding
- Logging

// src/app.ts
- Express app configuration
- Middleware registration
- Route mounting
- Error handling
```

#### 2.1.2 Dependency Injection Container

```typescript
// src/di/container.ts
- Service registry (Map-based)
- Factory pattern
- Singleton instances

// src/di/bindings.ts
- Service registration
- Dependency resolution
- Initialization order
```

**Registered Services:**
- prisma (Database client)
- userRepository
- cvRepository
- applicationRepository
- oauthTokenRepository
- tokenManager
- emailService

#### 2.1.3 Controllers

```typescript
// src/controllers/
├── aiController.ts        // AI generation logic
├── cvController.ts        // CV CRUD operations
├── emailController.ts     // Email sending & history
└── adminController.ts     // Admin operations
```

**Responsibilities:**
- Request validation
- Business logic delegation
- Response formatting
- Error handling

#### 2.1.4 Services

```typescript
// src/services/
├── aiService.ts           // AI provider abstraction
├── emailService.ts        // Email sending with OAuth
├── parserService.ts       // PDF/DOCX parsing
├── fileStorageService.ts  // Cloudinary integration
├── tokenManager.ts        // OAuth token refresh
├── promptBuilder.ts       // AI prompt construction
└── healthCheckService.ts  // System health monitoring
```

**Design Patterns:**
- Strategy Pattern (AI providers)
- Factory Pattern (AI client creation)
- Repository Pattern (data access)

#### 2.1.5 Repositories

```typescript
// src/repositories/
├── userRepository.ts
├── cvRepository.ts
├── applicationRepository.ts
└── oauthTokenRepository.ts
```

**Methods:**
- CRUD operations
- Query builders
- Transaction support
- Pagination helpers

#### 2.1.6 Middleware

```typescript
// src/middleware/
├── auth.ts              // JWT validation
├── admin.ts             // Admin role check
├── errorHandler.ts      // Global error handling
├── rateLimiter.ts       // Rate limiting
└── validate.ts          // Zod schema validation
```

#### 2.1.7 Routes

```typescript
// src/routes/
├── auth.ts              // /api/auth/*
├── cvRoutes.ts          // /api/cv/*
├── aiRoutes.ts          // /api/ai/*
├── emailRoutes.ts       // /api/email/*
└── adminRoutes.ts       // /api/admin/*
```

### 2.2 Frontend Components

#### 2.2.1 Application Structure

```
src/
├── app/                    // Next.js App Router
│   ├── layout.tsx         // Root layout
│   ├── page.tsx           // Landing page
│   ├── error.tsx          // Error boundary
│   ├── loading.tsx        // Loading state
│   ├── not-found.tsx      // 404 page
│   ├── auth/              // Auth pages
│   ├── dashboard/         // Dashboard pages
│   └── admin/             // Admin pages
├── components/            // React components
│   ├── ui/               // shadcn/ui components
│   ├── landing/          // Landing page sections
│   ├── dashboard/        // Dashboard components
│   └── admin/            // Admin components
├── hooks/                // Custom React hooks
├── services/             // API client
├── store/                // Zustand stores
├── lib/                  // Utilities
├── types/                // TypeScript types
└── config/               // Configuration
```

#### 2.2.2 State Management

**Zustand (Auth State):**
```typescript
// src/store/useAuthStore.ts
- user: User | null
- setUser(user: User)
- logout()
- Persistent storage (localStorage)
```

**TanStack Query (Server State):**
```typescript
// Queries
- useQuery(['cvs'], fetchCVs)
- useQuery(['history'], fetchHistory)
- useQuery(['users'], fetchUsers)

// Mutations
- useMutation(uploadCV)
- useMutation(generateApplication)
- useMutation(sendApplication)
```

#### 2.2.3 Custom Hooks

```typescript
// src/hooks/
├── useAuth.ts                  // Authentication logic
├── useCV.ts                    // CV management
├── useApplicationGenerator.ts  // AI generation
├── useApplications.ts          // Application history
├── useAdmin.ts                 // Admin operations
├── useRateLimit.ts            // Client-side rate limiting
└── useAutoReset.ts            // Auto-reset state
```

#### 2.2.4 API Client

```typescript
// src/services/api.ts
- axios instance with interceptors
- Request/response transformation
- Error handling
- Token injection

// Service modules
├── authService
├── cvService
├── applicationService
└── adminService
```

---

## 3. Data Design

### 3.1 Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  provider auth_provider NOT NULL DEFAULT 'GOOGLE',
  provider_account_id VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- User CVs Table
CREATE TABLE user_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_key TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Applications Table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cv_id UUID NOT NULL REFERENCES user_cvs(id),
  job_description TEXT NOT NULL,
  recruiter_email VARCHAR(255),
  subject VARCHAR(500),
  cover_letter TEXT,
  status application_status DEFAULT 'DRAFT',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  generated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Tokens Table
CREATE TABLE oauth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) DEFAULT 'gmail',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP,
  scope TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Enums
CREATE TYPE auth_provider AS ENUM ('GOOGLE');
CREATE TYPE application_status AS ENUM ('DRAFT', 'SENT', 'FAILED');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
```

### 3.2 Indexes

```sql
-- User CVs Indexes
CREATE INDEX idx_user_cvs_user_archived ON user_cvs(user_id, is_archived);
CREATE INDEX idx_user_cvs_user_active ON user_cvs(user_id, is_active);
CREATE INDEX idx_user_cvs_active ON user_cvs(is_active);

-- Applications Indexes
CREATE INDEX idx_applications_user_status ON applications(user_id, status);
CREATE INDEX idx_applications_cv ON applications(cv_id);
CREATE INDEX idx_applications_user_generated ON applications(user_id, generated_at);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_user_status_generated ON applications(user_id, status, generated_at);
```

### 3.3 Data Flow Diagrams

#### 3.3.1 User Authentication Flow

```
User → Google OAuth → Backend → Database
  ↓                      ↓          ↓
Browser ← JWT Token ← Validate ← Store User
  ↓
Store in Cookie + LocalStorage
```

#### 3.3.2 CV Upload Flow

```
User → Select File → Frontend Validation
  ↓
Multer Middleware → Temp Storage
  ↓
Cloudinary Upload → Get URL + Key
  ↓
Database Transaction:
  - Deactivate old CVs
  - Create new CV record
  ↓
Delete Temp File → Return Success
```

#### 3.3.3 Application Generation Flow

```
User → Job Description → Frontend
  ↓
Backend → Validate → Get Active CV
  ↓
Parse CV (PDF/DOCX) → Extract Text
  ↓
Detect Language (franc)
  ↓
Build AI Prompt → Call AI Provider
  ↓
Parse JSON Response → Validate
  ↓
Save as DRAFT → Return to User
  ↓
User Reviews → Edits → Sends
  ↓
Gmail API → Send Email + CV
  ↓
Update Status to SENT
```

---

## 4. API Design

### 4.1 RESTful Endpoints

#### 4.1.1 Authentication Routes

```
GET  /api/auth/google
  → Redirect to Google OAuth

GET  /api/auth/google/callback
  → Handle OAuth callback
  → Set JWT cookie
  → Redirect to dashboard

GET  /api/auth/me
  → Get current user
  → Headers: Authorization: Bearer <token>

POST /api/auth/logout
  → Clear JWT cookie
  → Return success
```

#### 4.1.2 CV Routes

```
POST /api/cv/upload
  → Upload CV file
  → Body: multipart/form-data
  → Rate limit: 10/hour
  → Response: { cv, url }

GET  /api/cv
  → Get user's CVs
  → Query: ?archived=false
  → Response: { cvs: [] }

PUT  /api/cv/:id/active
  → Set CV as active
  → Response: { cv }

PUT  /api/cv/:id/archive
  → Toggle archive status
  → Response: { cv }

DELETE /api/cv/:id
  → Delete CV
  → Validation: not active, no applications
  → Response: success message
```

#### 4.1.3 AI Routes

```
POST /api/ai/generate
  → Generate cover letter
  → Body: { jobDescription: string }
  → Validation: 50-5000 chars
  → Response: { applicationId, content }
```

#### 4.1.4 Email Routes

```
POST /api/email/send
  → Send application
  → Body: { applicationId, to, subject, body }
  → Sanitization: DOMPurify
  → Response: success message

GET  /api/email/history
  → Get application history
  → Query: ?page=1&limit=20
  → Response: { data: [], pagination: {} }
```

#### 4.1.5 Admin Routes

```
GET  /api/admin/users
  → Get all users
  → Query: ?page=1&limit=20
  → Response: { data: [], pagination: {} }

GET  /api/admin/users/:id
  → Get user details
  → Query: ?page=1 (for applications)
  → Response: { user, cvs, applications }

DELETE /api/admin/users/:id
  → Delete user
  → Validation: not self, not admin
  → Response: success message

GET  /api/admin/users/export
  → Export users to CSV
  → Response: CSV file

GET  /api/admin/cv/:cvId/download
  → Download user CV
  → Response: File buffer
```

### 4.2 Request/Response Formats

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Validation errors
}
```

#### Pagination Response
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 5. Security Design

### 5.1 Authentication & Authorization

#### JWT Token Structure
```json
{
  "userId": "uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Storage:**
- HTTP-only cookie (primary)
- Authorization header (fallback)
- 7-day expiration
- Secure flag in production
- SameSite: strict

#### Role-Based Access Control

```typescript
// Middleware chain
protect → requireAdmin → controller

// protect: Validates JWT, loads user
// requireAdmin: Checks user.role === 'ADMIN'
```

### 5.2 Input Validation

**Zod Schemas:**
```typescript
// Job description validation
z.string()
  .min(50, "Too short")
  .max(5000, "Too long")

// Email validation
z.string().email("Invalid email")

// UUID validation
z.string().uuid("Invalid ID")
```

**File Upload Validation:**
- MIME type check
- File extension check
- File size limit (5MB)
- Virus scanning (future)

### 5.3 Output Sanitization

**DOMPurify:**
```typescript
// Email subject (strip all HTML)
purify.sanitize(subject, { ALLOWED_TAGS: [] })

// Email body (allow basic formatting)
purify.sanitize(body, { 
  ALLOWED_TAGS: ['br', 'p', 'strong', 'em'] 
})
```

### 5.4 Rate Limiting

```typescript
// General API: 100 req/15min
// Auth endpoints: 5 req/15min
// Upload endpoint: 10 req/hour
// Client-side: 5 req/min (AI generation)
```

### 5.5 Security Headers (Helmet)

```typescript
{
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"]
  },
  hsts: { maxAge: 63072000 },
  frameguard: { action: 'sameorigin' },
  noSniff: true,
  xssFilter: true
}
```

---

## 6. Integration Design

### 6.1 Google OAuth Integration

**Flow:**
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. User grants permissions (profile, email, Gmail)
4. Google redirects to callback URL with code
5. Backend exchanges code for tokens
6. Store user + tokens in database
7. Generate JWT and set cookie
8. Redirect to dashboard

**Scopes:**
- `profile` - User profile info
- `email` - Email address
- `https://mail.google.com/` - Full Gmail access

### 6.2 Gmail API Integration

**Authentication:**
- OAuth 2.0 with access tokens
- Handled dynamically per-user via `googleapis`

**Email Construction & Sending:**
```typescript
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Build raw MIME email using Nodemailer streamTransport
const transporter = nodemailer.createTransport({ streamTransport: true, buffer: true } as any);
const info = await transporter.sendMail(mailOptions);
const encodedMessage = (info as any).message.toString('base64url');

await gmail.users.messages.send({
  userId: 'me',
  requestBody: { raw: encodedMessage }
});
```

### 6.3 Cloudinary Integration

**Upload:**
```typescript
cloudinary.uploader.upload(filePath, {
  resource_type: 'image',
  folder: 'postify/cvs',
  format: 'pdf',
  type: 'authenticated'
})
```

**Download:**
```typescript
cloudinary.utils.private_download_url(fileKey, 'pdf', {
  resource_type: 'image',
  type: 'authenticated',
  expires_at: timestamp + 60
})
```

### 6.4 AI Provider Integration

**Strategy Pattern:**
```typescript
function getAIClient() {
  switch (AI_PROVIDER) {
    case 'openai': return new OpenAI({ apiKey })
    case 'ollama': return new OpenAI({ baseURL: ollamaURL })
    case 'openrouter': return new OpenAI({ baseURL: openrouterURL })
    case 'huggingface': return new OpenAI({ baseURL: hfURL })
  }
}
```

**Request Format:**
```typescript
{
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a professional...' },
    { role: 'user', content: prompt }
  ],
  response_format: { type: 'json_object' },
  temperature: 0.7
}
```

---

## 7. Deployment Design

### 7.1 Environment Configuration

**Required Variables:**
```env
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=<32+ chars>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://api.postify.app/api/auth/google/callback

# Frontend
CLIENT_URL=https://postify.app

# AI
AI_PROVIDER=openai
OPENAI_API_KEY=...

# Storage
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Admin
ADMIN_EMAILS=admin@postify.app
```

### 7.2 Build Process

**Backend:**
```bash
npm run build        # TypeScript → JavaScript
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm start            # Start production server
```

**Frontend:**
```bash
npm run build        # Next.js build (SSR + SSG)
npm start            # Start production server
```

### 7.3 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Load Balancer / CDN             │
│         (Cloudflare / AWS ALB)          │
└─────────────────────────────────────────┘
              ↓                ↓
┌──────────────────┐  ┌──────────────────┐
│  Frontend Server │  │  Backend Server  │
│  (Next.js)       │  │  (Express.js)    │
│  Port 3000       │  │  Port 5000       │
└──────────────────┘  └──────────────────┘
                              ↓
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │   (Managed DB)   │
                    └──────────────────┘
```

### 7.4 Scaling Strategy

**Horizontal Scaling:**
- Stateless API design (JWT tokens)
- Database connection pooling
- CDN for static assets (Cloudinary)
- Load balancer for multiple instances

**Vertical Scaling:**
- Increase server resources (CPU/RAM)
- Database performance tuning
- Query optimization

---

## 8. Monitoring & Logging

### 8.1 Logging Strategy

**Log Levels:**
- `error` - Critical errors
- `warn` - Warnings
- `info` - General info
- `debug` - Debug info (dev only)

**Log Format:**
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "error",
  "message": "Database connection failed",
  "meta": {
    "error": "...",
    "stack": "..."
  }
}
```

**Log Locations:**
- Console (stdout/stderr)
- File system (production)
- External service (future: CloudWatch, Datadog)

### 8.2 Health Checks

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "service": "Postify Backend",
  "ai_provider": "openai",
  "ai_status": "online",
  "database": "connected"
}
```

### 8.3 Error Tracking

**Error Handler:**
- Catch all unhandled errors
- Log with context
- Return user-friendly messages
- Hide stack traces in production

**Error Types:**
- `AppError` - Operational errors (expected)
- `Error` - Programming errors (unexpected)

---

## 9. Testing Strategy

### 9.1 Unit Testing (Future)
- Services (AI, Email, Parser)
- Repositories (CRUD operations)
- Utilities (Validators, Sanitizers)
- Coverage target: 70%+

### 9.2 Integration Testing (Future)
- API endpoints
- Database transactions
- External service mocks
- Authentication flows

### 9.3 E2E Testing (Future)
- User registration flow
- CV upload flow
- Application generation flow
- Email sending flow

### 9.4 Manual Testing (Current)
- Browser compatibility
- Responsive design
- Accessibility (WCAG AA)
- Performance testing

---

## 10. Performance Optimization

### 10.1 Database Optimization
- Strategic indexes on frequently queried columns
- Connection pooling (Prisma)
- Query optimization (select only needed fields)
- Pagination for large datasets

### 10.2 API Optimization
- Response compression (gzip)
- Caching headers
- Rate limiting to prevent abuse
- Async/await for non-blocking I/O

### 10.3 Frontend Optimization
- Next.js SSR/SSG for fast initial load
- Code splitting (automatic with Next.js)
- Image optimization (next/image)
- TanStack Query caching
- Lazy loading components

### 10.4 File Storage Optimization
- Cloudinary CDN for fast delivery
- File size limits (5MB)
- Authenticated URLs with expiration
- Automatic format conversion

---

## Document Control

**Version:** 1.0  
**Date:** 2025  
**Author:** System Architect  
**Status:** Final - MVP Design  
**Next Review:** Post-MVP Launch

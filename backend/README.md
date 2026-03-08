# Backend API — Postify

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)

**Express.js TypeScript REST API for AI-powered job application automation with Gmail integration.**

**Base URL:** `http://localhost:5000/api` (development) | `https://api.postify.app/api` (production)

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [📝 API Reference](#-api-reference)
- [🔐 Authentication](#-authentication)
- [🔒 Security](#-security)
- [📝 Logging](#-logging)
- [🧪 Testing](#-testing)
- [📊 Monitoring](#-monitoring)
- [❌ Error Handling](#-error-handling)
- [🚀 Deployment](#-deployment)
- [📜 License](#-license)

---

## ✨ Features

### REST API Capabilities
- **RESTful Architecture** - Clean, resource-based endpoints following REST principles
- **Type-Safe API** - Full TypeScript implementation with strict type checking
- **Dependency Injection** - Modular architecture with DI container for testability
- **Repository Pattern** - Abstracted data access layer for maintainability

### Authentication & Authorization
- **OAuth 2.0 Integration** - Google OAuth authentication flow
- **JWT Token Management** - Secure access tokens with HTTP-only cookies
- **Role-Based Access Control** - User and Admin roles with middleware guards
- **Automatic Token Refresh** - Gmail OAuth token refresh mechanism

### Security Features
- **Rate Limiting** - 100 req/15min (general), 5 req/15min (auth), 10 req/hour (uploads)
- **Input Validation** - Zod schemas on all endpoints with detailed error messages
- **XSS Protection** - DOMPurify sanitization for user-generated content
- **Security Headers** - Helmet.js with CSP, HSTS, X-Frame-Options
- **CORS Protection** - Whitelist-based origin validation
- **SQL Injection Prevention** - Prisma ORM with parameterized queries

### Performance & Reliability
- **Database Indexing** - Optimized queries with composite indexes
- **Connection Pooling** - Prisma connection pool management
- **Structured Logging** - JSON-formatted logs with Winston-style logger
- **Health Checks** - Database and AI provider status monitoring
- **Graceful Shutdown** - SIGTERM/SIGINT handlers for clean process termination

### Business Logic
- **AI Cover Letter Generation** - Multi-provider support (OpenAI, Ollama, OpenRouter, HuggingFace)
- **CV Parsing** - PDF and DOCX text extraction
- **Gmail Integration** - OAuth-authenticated email sending with attachments
- **File Storage** - Cloudinary CDN integration for CV management
- **Multi-Language Support** - Auto-detection of job description language

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | ≥20.0.0 | JavaScript runtime |
| **Language** | TypeScript | 5.9.3 | Type safety and developer experience |
| **Framework** | Express.js | 5.2.1 | Web application framework |
| **Database** | PostgreSQL | ≥14.0 | Relational database |
| **ORM** | Prisma | 6.19.2 | Database toolkit and migrations |
| **Authentication** | Passport.js | 0.7.0 | OAuth middleware |
| | jsonwebtoken | 9.0.3 | JWT token generation/verification |
| **Validation** | Zod | 3.24.1 | Schema validation |
| **Security** | Helmet | 8.1.0 | Security headers |
| | express-rate-limit | 7.5.0 | Rate limiting |
| | DOMPurify | 3.3.2 | XSS sanitization |
| | validator | 13.12.0 | String validation |
| **File Handling** | Multer | 2.0.2 | File upload middleware |
| | Cloudinary | 2.9.0 | Cloud file storage |
| | pdf-parse | 2.4.5 | PDF text extraction |
| | mammoth | 1.11.0 | DOCX text extraction |
| **AI Integration** | OpenAI SDK | 6.24.0 | AI provider client |
| **Email** | Nodemailer | 8.0.1 | SMTP client |
| | googleapis | 171.4.0 | Gmail API integration |
| **Development** | tsx | 4.21.0 | TypeScript execution |
| | ESLint | 9.39.4 | Code linting |
| | Prettier | 3.8.1 | Code formatting |

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** ≥ 20.0.0 ([Download](https://nodejs.org/))
- **npm** ≥ 10.0.0 (comes with Node.js)
- **PostgreSQL** ≥ 14.0 ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### External Services
You'll need accounts and API keys for:

1. **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com))
   - Create a new project
   - Enable Google+ API and Gmail API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

2. **Cloudinary** ([cloudinary.com](https://cloudinary.com/))
   - Sign up for free account
   - Get Cloud Name, API Key, and API Secret from dashboard

3. **AI Provider** (choose one):
   - **OpenAI** ([platform.openai.com](https://platform.openai.com/)) - Get API key
   - **Ollama** ([ollama.ai](https://ollama.ai/)) - Install locally (free)
   - **OpenRouter** ([openrouter.ai](https://openrouter.ai/)) - Get API key
   - **HuggingFace** ([huggingface.co](https://huggingface.co/)) - Get access token

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/postify.git
cd postify/backend
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=5000

# ============================================
# DATABASE
# ============================================
# PostgreSQL connection string
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:password@localhost:5432/postify

# ============================================
# JWT AUTHENTICATION
# ============================================
# Generate a secure secret (min 32 characters):
# openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# ============================================
# GOOGLE OAUTH 2.0
# ============================================
# From Google Cloud Console > Credentials
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ============================================
# FRONTEND URL
# ============================================
# Used for CORS and OAuth redirects
CLIENT_URL=http://localhost:3000

# ============================================
# AI PROVIDER CONFIGURATION
# ============================================
# Options: openai | ollama | openrouter | huggingface
AI_PROVIDER=openai

# OpenAI (if AI_PROVIDER=openai)
OPENAI_API_KEY=sk-proj-your-openai-api-key
OPENAI_MODEL=gpt-4o

# Ollama (if AI_PROVIDER=ollama) - Local AI
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# OpenRouter (if AI_PROVIDER=openrouter)
OPENROUTER_API_KEY=sk-or-your-openrouter-key
OPENROUTER_MODEL=anthropic/claude-3-haiku

# HuggingFace (if AI_PROVIDER=huggingface)
HF_TOKEN=hf_your-huggingface-token
HF_MODEL=deepseek-ai/DeepSeek-R1:novita

# ============================================
# EMAIL CONFIGURATION
# ============================================
# Gmail SMTP settings (default values shown)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

# ============================================
# CLOUDINARY FILE STORAGE
# ============================================
# From Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret

# ============================================
# ADMIN CONFIGURATION
# ============================================
# Comma-separated list of admin emails
ADMIN_EMAILS=admin@example.com,admin2@example.com

# ============================================
# LOGGING
# ============================================
# Options: error | warn | info | debug
LOG_LEVEL=info
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start on **http://localhost:5000**

### 6. Run with Docker

Create a `docker-compose.yml` in the backend directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postify
      POSTGRES_PASSWORD: postify
      POSTGRES_DB: postify
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postify:postify@postgres:5432/postify
    depends_on:
      - postgres
    env_file:
      - .env

volumes:
  postgres_data:
```

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Run with Docker:

```bash
docker-compose up -d
```

---
## 📁 Project Structure

```
backend/
├── prisma/
│   ├── migrations/              # Database migration files
│   │   ├── 20260301134127_init/
│   │   ├── 20260301151835_add_user_role/
│   │   └── migration_lock.toml
│   └── schema.prisma            # Database schema definition
│
├── src/
│   ├── config/                  # Configuration files
│   │   ├── env.ts              # Environment variable validation (Zod)
│   │   ├── passport.ts         # Passport OAuth strategy setup
│   │   ├── cloudinary.ts       # Cloudinary SDK configuration
│   │   └── constants.ts        # Application constants
│   │
│   ├── controllers/             # Request handlers (business logic entry)
│   │   ├── adminController.ts  # Admin user management
│   │   ├── aiController.ts     # AI cover letter generation
│   │   ├── cvController.ts     # CV upload/management
│   │   └── emailController.ts  # Email sending & history
│   │
│   ├── di/                      # Dependency Injection
│   │   ├── container.ts        # DI container implementation
│   │   └── bindings.ts         # Service registration
│   │
│   ├── infrastructure/          # Infrastructure layer
│   │   ├── database/
│   │   │   └── healthCheck.ts  # Database health monitoring
│   │   └── logging/
│   │       └── logger.ts       # Structured JSON logger
│   │
│   ├── middleware/              # Express middleware
│   │   ├── auth.ts             # JWT authentication guard
│   │   ├── admin.ts            # Admin role guard
│   │   ├── errorHandler.ts     # Global error handler
│   │   ├── rateLimiter.ts      # Rate limiting rules
│   │   └── validate.ts         # Zod schema validation
│   │
│   ├── repositories/            # Data access layer (Repository pattern)
│   │   ├── userRepository.ts
│   │   ├── cvRepository.ts
│   │   ├── applicationRepository.ts
│   │   └── oauthTokenRepository.ts
│   │
│   ├── routes/                  # API route definitions
│   │   ├── auth.ts             # Authentication routes
│   │   ├── cvRoutes.ts         # CV management routes
│   │   ├── aiRoutes.ts         # AI generation routes
│   │   ├── emailRoutes.ts      # Email sending routes
│   │   └── adminRoutes.ts      # Admin routes
│   │
│   ├── services/                # Business logic services
│   │   ├── aiService.ts        # AI provider integration
│   │   ├── emailService.ts     # Email sending logic
│   │   ├── parserService.ts    # CV parsing (PDF/DOCX)
│   │   ├── fileStorageService.ts # Cloudinary operations
│   │   ├── tokenManager.ts     # OAuth token refresh
│   │   ├── promptBuilder.ts    # AI prompt construction
│   │   └── healthCheckService.ts # Health check logic
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── dtos.ts             # Data Transfer Objects
│   │   ├── express.d.ts        # Express type extensions
│   │   └── jwt.types.ts        # JWT payload types
│   │
│   ├── utils/                   # Utility functions
│   │   ├── asyncHandler.ts     # Async error wrapper
│   │   ├── errors.ts           # Custom error classes
│   │   ├── jwt.ts              # JWT sign/verify helpers
│   │   ├── pagination.ts       # Pagination utilities
│   │   ├── prisma.ts           # Prisma client instance
│   │   ├── response.ts         # Standard response formatter
│   │   └── validators.ts       # Custom validators
│   │
│   ├── validators/              # Zod validation schemas
│   │   ├── aiValidation.ts
│   │   └── emailValidation.ts
│   │
│   ├── app.ts                   # Express app setup
│   └── index.ts                 # Server entry point
│
├── uploads/                     # Temporary file uploads (gitignored)
├── .env                         # Environment variables (gitignored)
├── .gitignore
├── .prettierrc                  # Prettier configuration
├── eslint.config.mjs            # ESLint configuration
├── package.json
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

### Folder Purposes

- **`config/`** - Application configuration, environment validation, third-party SDK setup
- **`controllers/`** - Handle HTTP requests, call services, return responses
- **`di/`** - Dependency injection container for loose coupling and testability
- **`infrastructure/`** - Cross-cutting concerns (logging, database health)
- **`middleware/`** - Express middleware for auth, validation, error handling
- **`repositories/`** - Database access layer, abstracts Prisma operations
- **`routes/`** - API endpoint definitions, route-level middleware
- **`services/`** - Core business logic, external API integrations
- **`types/`** - TypeScript interfaces and type definitions
- **`utils/`** - Reusable helper functions and utilities
- **`validators/`** - Zod schemas for request validation

---

## 📝 API Reference

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://api.postify.app/api`

### Authentication Header
Protected endpoints require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔑 Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/auth/google` | No | Initiate Google OAuth flow |
| GET | `/auth/google/callback` | No | OAuth callback (redirects to frontend) |
| GET | `/auth/me` | Yes | Get current authenticated user |
| POST | `/auth/logout` | No | Clear authentication cookie |

#### GET `/auth/google`
Redirects to Google OAuth consent screen.

**Query Parameters:** None

**Response:** Redirect to Google

---

#### GET `/auth/google/callback`
Handles OAuth callback, sets JWT cookie, redirects to frontend.

**Query Parameters:**
- `code` (string) - OAuth authorization code (auto-provided by Google)

**Response:** Redirect to `CLIENT_URL/auth/callback`

**Cookies Set:**
```
token=<jwt_token>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800000
```

---

#### GET `/auth/me`
Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatarUrl": "https://lh3.googleusercontent.com/...",
      "provider": "GOOGLE",
      "providerAccountId": "123456789",
      "role": "USER",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

---

#### POST `/auth/logout`
Clear authentication cookie.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 📄 CV Management Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/cv/upload` | Yes | Upload a new CV (PDF/DOCX) |
| GET | `/cv` | Yes | Get all user's CVs |
| PUT | `/cv/:id/active` | Yes | Set CV as active |
| PUT | `/cv/:id/archive` | Yes | Archive/unarchive CV |
| DELETE | `/cv/:id` | Yes | Delete CV permanently |

#### POST `/cv/upload`
Upload a new CV file. Automatically sets as active CV.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**
- `cv` (file) - PDF or DOCX file (max 5MB)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "CV uploaded successfully",
  "data": {
    "cv": {
      "id": "uuid",
      "userId": "uuid",
      "fileName": "John_Doe_CV.pdf",
      "fileKey": "postify/cvs/cv-1234567890-123456789",
      "fileSize": 245678,
      "mimeType": "application/pdf",
      "isActive": true,
      "isArchived": false,
      "uploadedAt": "2025-01-15T10:30:00.000Z",
      "url": "https://res.cloudinary.com/..."
    }
  }
}
```

**Errors:**
- `400` - No file uploaded / Invalid file type / File too large
- `401` - Unauthorized

---

#### GET `/cv`
Get all non-archived CVs for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "cvs": [
      {
        "id": "uuid",
        "fileName": "John_Doe_CV.pdf",
        "fileSize": 245678,
        "mimeType": "application/pdf",
        "isActive": true,
        "isArchived": false,
        "uploadedAt": "2025-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

#### PUT `/cv/:id/active`
Set a specific CV as the active one (used for applications).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Active CV updated",
  "data": {
    "cv": {
      "id": "uuid",
      "isActive": true
    }
  }
}
```

**Errors:**
- `404` - CV not found
- `400` - Cannot set archived CV as active

---

#### PUT `/cv/:id/archive`
Toggle archive status of a CV.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "CV archived successfully",
  "data": {
    "cv": {
      "id": "uuid",
      "isArchived": true
    }
  }
}
```

**Errors:**
- `404` - CV not found
- `400` - Cannot archive active CV

---

#### DELETE `/cv/:id`
Permanently delete a CV.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "CV deleted successfully"
}
```

**Errors:**
- `404` - CV not found
- `400` - Cannot delete active CV / Cannot delete CV with applications

---

### 🤖 AI Generation Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/ai/generate` | Yes | Generate cover letter from job description |

#### POST `/ai/generate`
Generate a personalized cover letter using AI based on job description and active CV.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "jobDescription": "We are looking for a Senior Full-Stack Developer with 5+ years of experience in React, Node.js, and TypeScript. The ideal candidate will have strong problem-solving skills and experience with cloud platforms like AWS..."
}
```

**Validation:**
- `jobDescription` (string, required) - Min 50 chars, max 5000 chars

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Generated successfully",
  "data": {
    "applicationId": "uuid",
    "content": {
      "coverLetter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Full-Stack Developer position...",
      "subject": "Application for Senior Full-Stack Developer Position",
      "recruiterEmail": "hr@company.com"
    }
  }
}
```

**Errors:**
- `400` - Validation error (job description too short/long)
- `404` - No active CV found
- `500` - AI generation failed

---

### 📧 Email Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/email/send` | Yes | Send application email via Gmail |
| GET | `/email/history` | Yes | Get application history with pagination |

#### POST `/email/send`
Send a job application email with CV attachment via Gmail.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "applicationId": "uuid",
  "to": "hr@company.com",
  "subject": "Application for Senior Full-Stack Developer Position",
  "body": "Dear Hiring Manager,\n\nI am writing to express my strong interest..."
}
```

**Validation:**
- `applicationId` (uuid, required)
- `to` (email, required)
- `subject` (string, required, max 200 chars)
- `body` (string, required, max 10000 chars)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Application sent successfully!"
}
```

**Errors:**
- `400` - Invalid email address / Validation error
- `404` - Application not found
- `500` - Email sending failed

---

#### GET `/email/history`
Get paginated application history for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "userId": "uuid",
        "cvId": "uuid",
        "jobDescription": "We are looking for...",
        "recruiterEmail": "hr@company.com",
        "subject": "Application for Senior Developer",
        "coverLetter": "Dear Hiring Manager...",
        "status": "SENT",
        "generatedAt": "2025-01-15T10:30:00.000Z",
        "sentAt": "2025-01-15T10:35:00.000Z",
        "cv": {
          "fileName": "John_Doe_CV.pdf"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 👑 Admin Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/admin/users` | Admin | Get all users with pagination |
| GET | `/admin/users/export` | Admin | Export users to CSV |
| GET | `/admin/users/:id` | Admin | Get user details with applications |
| DELETE | `/admin/users/:id` | Admin | Delete a user |
| GET | `/admin/cv/:cvId/download` | Admin | Download user's CV |

#### GET `/admin/users`
Get all users with pagination.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "avatarUrl": "https://...",
        "role": "USER",
        "createdAt": "2025-01-15T10:30:00.000Z",
        "_count": {
          "cvs": 2,
          "applications": 15
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Admin access required

---

#### GET `/admin/users/export`
Export all users to CSV file.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename=users-1234567890.csv

Email,Name,Role,Joined,CVs,Applications
user@example.com,John Doe,USER,1/15/2025,2,15
```

---

#### DELETE `/admin/users/:id`
Delete a user and all associated data.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errors:**
- `400` - Cannot delete your own account / Cannot delete admin users
- `404` - User not found

---

### 🏥 Health Check Endpoint

#### GET `/health`
Check API health status.

**Auth Required:** No

**Response:** `200 OK`
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

---
## 🔐 Authentication

### JWT Token Flow

Postify uses **JWT (JSON Web Tokens)** for stateless authentication with HTTP-only cookies.

#### Authentication Flow

1. **User initiates OAuth:**
   ```
   GET /api/auth/google
   → Redirects to Google OAuth consent screen
   ```

2. **Google redirects back with authorization code:**
   ```
   GET /api/auth/google/callback?code=...
   → Backend exchanges code for access/refresh tokens
   → Creates or updates user in database
   → Generates JWT token
   → Sets HTTP-only cookie
   → Redirects to frontend
   ```

3. **Frontend receives authenticated user:**
   ```
   GET /api/auth/me
   Authorization: Bearer <token>
   → Returns user profile
   ```

4. **Subsequent requests include token:**
   ```
   GET /api/cv
   Authorization: Bearer <token>
   Cookie: token=<jwt_token>
   ```

### Token Details

**JWT Payload:**
```json
{
  "userId": "uuid",
  "iat": 1705315800,
  "exp": 1705920600
}
```

**Token Expiry:** 7 days

**Cookie Configuration:**
- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` - HTTPS only (production)
- `sameSite: 'strict'` - CSRF protection
- `maxAge: 604800000` - 7 days in milliseconds

### Authorization Header Format

Include JWT token in requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Or rely on HTTP-only cookie (automatically sent by browser).

### OAuth Token Refresh

Gmail OAuth tokens are automatically refreshed when expired:

1. User sends email via `/api/email/send`
2. Backend checks token expiry
3. If expired, uses refresh token to get new access token
4. Updates token in database
5. Proceeds with email sending

**Token Storage:** OAuth tokens stored in `oauth_tokens` table with encryption.

---

## 🔒 Security

### Security Measures Implemented

#### 1. Helmet Security Headers

```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
})
```

**Headers Set:**
- `Strict-Transport-Security` - Force HTTPS
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS filter
- `Content-Security-Policy` - Restrict resource loading

#### 2. Rate Limiting

**General API Endpoints:**
- **Window:** 15 minutes
- **Max Requests:** 100
- **Response:** `429 Too Many Requests`

**Authentication Endpoints:**
- **Window:** 15 minutes
- **Max Requests:** 5
- **Applies to:** `/api/auth/google`

**File Upload Endpoints:**
- **Window:** 1 hour
- **Max Requests:** 10
- **Applies to:** `/api/cv/upload`

#### 3. Input Validation

All endpoints use **Zod schemas** for validation:

```typescript
// Example: AI generation validation
{
  jobDescription: z.string()
    .min(50, "Job description too short")
    .max(5000, "Job description too long")
}
```

**Validation Errors Return:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "body.jobDescription",
      "message": "Job description too short"
    }
  ]
}
```

#### 4. XSS Protection

**DOMPurify** sanitizes all user-generated content before email sending:

```typescript
const sanitizedSubject = purify.sanitize(subject, { ALLOWED_TAGS: [] });
const sanitizedBody = purify.sanitize(body, { 
  ALLOWED_TAGS: ['br', 'p', 'strong', 'em'] 
});
```

#### 5. CORS Configuration

**Whitelist-based origin validation:**

```typescript
cors({
  origin: (origin, callback) => {
    if (!origin || env.CLIENT_URL === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
})
```

**Allowed Origins:**
- `CLIENT_URL` from environment variable
- No origin (for same-origin requests)

#### 6. SQL Injection Prevention

**Prisma ORM** with parameterized queries:

```typescript
// Safe - Prisma handles parameterization
await prisma.user.findUnique({
  where: { email: userInput }
});
```

#### 7. File Upload Security

**Validation:**
- **Allowed Types:** `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Allowed Extensions:** `.pdf`, `.docx`
- **Max Size:** 5MB
- **Storage:** Cloudinary CDN (not local filesystem)

**Multer Configuration:**
```typescript
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
```

#### 8. Environment Variable Validation

**Zod schema** validates all environment variables on startup:

```typescript
const envSchema = z.object({
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().min(1),
  // ... all required variables
});
```

**Fails fast** if any required variable is missing or invalid.

### Security Best Practices

- ✅ Never log sensitive data (tokens, passwords)
- ✅ Use HTTPS in production
- ✅ Rotate JWT secrets regularly
- ✅ Keep dependencies updated (`npm audit`)
- ✅ Use environment variables for secrets
- ✅ Implement graceful shutdown for cleanup
- ✅ Validate all user input
- ✅ Use prepared statements (Prisma)

---

## 📝 Logging

### Log Levels

Postify uses a custom JSON logger with four levels:

| Level | Priority | Use Case |
|-------|----------|----------|
| `error` | 0 | Critical errors, exceptions |
| `warn` | 1 | Warnings, deprecated features |
| `info` | 2 | General information, startup messages |
| `debug` | 3 | Detailed debugging (development only) |

### Configuration

Set log level via environment variable:

```env
LOG_LEVEL=info
```

### Log Format

All logs are output in **JSON format** for easy parsing:

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Server started",
  "meta": {
    "port": 5000
  }
}
```

### Usage Examples

```typescript
import { logger } from './infrastructure/logging/logger.js';

// Info log
logger.info('User logged in', { userId: user.id });

// Error log
logger.error('Database connection failed', { 
  error: err.message,
  stack: err.stack 
});

// Warning log
logger.warn('Rate limit exceeded', { ip: req.ip });

// Debug log (only in development)
logger.debug('Processing request', { body: req.body });
```

### Log Output

**Development:**
- Logs to `stdout` (console)
- Includes all levels based on `LOG_LEVEL`

**Production:**
- Logs to `stdout` (captured by container orchestration)
- Recommended: Forward to centralized logging (CloudWatch, Datadog, etc.)

### Log Rotation

For production deployments, use external log rotation:

**PM2:**
```bash
pm2 start dist/index.js --log-date-format="YYYY-MM-DD HH:mm:ss" --max-memory-restart 500M
```

**Docker:**
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## 🧪 Testing

### Test Structure

```
backend/
├── src/
│   └── __tests__/
│       ├── unit/
│       │   ├── services/
│       │   ├── repositories/
│       │   └── utils/
│       ├── integration/
│       │   ├── auth.test.ts
│       │   ├── cv.test.ts
│       │   └── email.test.ts
│       └── e2e/
│           └── application-flow.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- userRepository.test.ts

# Run in watch mode
npm test -- --watch

# Run integration tests only
npm test -- integration/
```

### Test Coverage Goals

| Category | Target |
|----------|--------|
| Statements | ≥ 80% |
| Branches | ≥ 75% |
| Functions | ≥ 80% |
| Lines | ≥ 80% |

### Example Test

```typescript
import request from 'supertest';
import app from '../app';

describe('POST /api/auth/logout', () => {
  it('should clear authentication cookie', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: 'Logged out successfully'
    });
  });
});
```

### Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check

# Run both lint and format check
npm run check
```

### Security Testing

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force
```

---

## 📊 Monitoring

### Health Check Endpoint

**Endpoint:** `GET /health`

**Purpose:** Monitor API availability, database connection, and AI provider status.

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

**Status Values:**
- `ok` - All systems operational
- `degraded` - Database disconnected but API running

**Usage:**
```bash
# Check health
curl http://localhost:5000/health

# Use in Docker healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1
```

### Database Health

**Connection Pool Monitoring:**

```typescript
const stats = await dbHealthCheck.getConnectionPoolStats();
// Returns: { total_connections, active_connections, idle_connections }
```

**Prisma Logging:**

Development mode logs all queries:
```typescript
new PrismaClient({
  log: ['query', 'error', 'warn']
});
```

### AI Provider Health

**Ollama Status Check:**
```bash
curl http://localhost:11434/api/tags
```

**OpenAI Status:**
- Assumed online (no health endpoint)
- Errors logged on generation failure

### Application Metrics

**Key Metrics to Monitor:**

1. **Request Rate**
   - Total requests per minute
   - Requests by endpoint
   - Failed requests (4xx, 5xx)

2. **Response Time**
   - Average response time
   - P95, P99 latency
   - Slow endpoints (>1s)

3. **Error Rate**
   - 4xx errors (client errors)
   - 5xx errors (server errors)
   - AI generation failures
   - Email sending failures

4. **Database**
   - Connection pool usage
   - Query execution time
   - Failed queries

5. **Business Metrics**
   - User registrations
   - CV uploads
   - Applications generated
   - Emails sent

### Monitoring Tools (Recommended)

**Production Monitoring:**

1. **Sentry** - Error tracking
   ```bash
   npm install @sentry/node
   ```

2. **Prometheus + Grafana** - Metrics and dashboards
   ```bash
   npm install prom-client
   ```

3. **AWS CloudWatch** - For AWS deployments
   - Log aggregation
   - Custom metrics
   - Alarms

4. **Datadog** - Full-stack monitoring
   - APM (Application Performance Monitoring)
   - Log management
   - Infrastructure monitoring

### Graceful Shutdown

The API handles `SIGTERM` and `SIGINT` signals for graceful shutdown:

```typescript
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
```

**Shutdown Process:**
1. Stop accepting new connections
2. Complete in-flight requests
3. Close database connections
4. Exit process

---
## ❌ Error Handling

### Standard Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Development Mode** includes stack trace:
```json
{
  "success": false,
  "error": "Error message here",
  "stack": "Error: ...\n    at ..."
}
```

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| `200` | OK | Successful request |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Validation error, invalid input |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions (not admin) |
| `404` | Not Found | Resource doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

### Custom Error Classes

```typescript
// Base error class
class AppError extends Error {
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Specific error types
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class AIGenerationError extends AppError {
  constructor(message = 'AI generation failed') {
    super(message, 500);
  }
}

class EmailSendError extends AppError {
  constructor(message = 'Email sending failed') {
    super(message, 500);
  }
}

class TokenRefreshError extends AppError {
  constructor(message = 'Token refresh failed') {
    super(message, 401);
  }
}
```

### Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_FILE_TYPE` | 400 | Unsupported file format |
| `FILE_TOO_LARGE` | 400 | File exceeds size limit |
| `UNAUTHORIZED` | 401 | Authentication required |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `TOKEN_REFRESH_FAILED` | 401 | OAuth token refresh failed |
| `FORBIDDEN` | 403 | Admin access required |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `AI_GENERATION_FAILED` | 500 | AI provider error |
| `EMAIL_SEND_FAILED` | 500 | Email sending error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Validation Error Response

Zod validation errors include detailed field information:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "body.jobDescription",
      "message": "Job description is too short (minimum 50 characters)"
    },
    {
      "field": "body.email",
      "message": "Invalid email address"
    }
  ]
}
```

### Error Handling Examples

**404 Not Found:**
```json
{
  "success": false,
  "error": "CV not found"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Not authorized, no token"
}
```

**400 Validation Error:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "body.to",
      "message": "Invalid email address"
    }
  ]
}
```

**429 Rate Limit:**
```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

**500 AI Generation Error:**
```json
{
  "success": false,
  "error": "AI Provider Error: Connection refused to AI provider. Is Ollama running at http://localhost:11434?"
}
```

### Global Error Handler

All errors are caught by the global error handler middleware:

```typescript
app.use(errorHandler);
```

**Features:**
- Logs all errors with context (path, method, user)
- Returns consistent error format
- Hides sensitive information in production
- Includes stack trace in development

---

## 🚀 Deployment

### Build for Production

```bash
# Install dependencies
npm ci

# Generate Prisma Client
npm run prisma:generate

# Compile TypeScript to JavaScript
npm run build

# Output directory: dist/
```

### Production Environment Variables

Ensure all environment variables are set in your hosting platform:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/postify
JWT_SECRET=<64-char-random-string>
GOOGLE_CLIENT_ID=<production-client-id>
GOOGLE_CLIENT_SECRET=<production-secret>
GOOGLE_CALLBACK_URL=https://api.postify.app/api/auth/google/callback
CLIENT_URL=https://postify.app
AI_PROVIDER=openai
OPENAI_API_KEY=<production-key>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
ADMIN_EMAILS=admin@postify.app
LOG_LEVEL=info
```

### Database Migrations

**Run migrations in production:**

```bash
# Apply all pending migrations
npm run prisma:migrate

# Or use Prisma CLI directly
npx prisma migrate deploy
```

**Important:** Always backup database before running migrations.

### Deployment Platforms

#### 1. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

**Environment Variables:** Set in Railway dashboard

**Database:** Use Railway PostgreSQL plugin

#### 2. Render

1. Connect GitHub repository
2. Select "Web Service"
3. Build Command: `npm ci && npm run prisma:generate && npm run build`
4. Start Command: `npm start`
5. Add environment variables in dashboard
6. Add PostgreSQL database

#### 3. AWS EC2

```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/postify.git
cd postify/backend

# Install dependencies
npm ci

# Build
npm run build

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name postify-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 4. Docker Deployment

**Build Docker image:**

```bash
docker build -t postify-backend .
```

**Run container:**

```bash
docker run -d \
  --name postify-backend \
  -p 5000:5000 \
  --env-file .env \
  postify-backend
```

**Docker Compose (with PostgreSQL):**

```bash
docker-compose up -d
```

#### 5. Vercel (Serverless)

**Note:** Express.js requires adapter for serverless deployment.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

### PM2 Process Manager

**Start application:**

```bash
pm2 start dist/index.js --name postify-backend
```

**Monitor:**

```bash
pm2 monit
pm2 logs postify-backend
pm2 status
```

**Restart:**

```bash
pm2 restart postify-backend
```

**Auto-restart on file changes:**

```bash
pm2 start dist/index.js --name postify-backend --watch
```

**Ecosystem file (pm2.config.js):**

```javascript
module.exports = {
  apps: [{
    name: 'postify-backend',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M'
  }]
};
```

Start with ecosystem:
```bash
pm2 start pm2.config.js
```

### Nginx Reverse Proxy

**Configuration (`/etc/nginx/sites-available/postify`):**

```nginx
server {
    listen 80;
    server_name api.postify.app;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/postify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.postify.app

# Auto-renewal (runs twice daily)
sudo systemctl status certbot.timer
```

### Health Check Configuration

**Docker:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1
```

**Kubernetes:**
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10
```

### Monitoring in Production

1. **Set up Sentry for error tracking**
2. **Configure CloudWatch/Datadog for metrics**
3. **Set up uptime monitoring (UptimeRobot, Pingdom)**
4. **Configure log aggregation (CloudWatch Logs, Papertrail)**
5. **Set up alerts for critical errors**

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Postify

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**Postify Team**

- GitHub: [@moteaz](https://github.com/yourusername)
- Email: support@postify.app
- Website: [postify.app](https://postify.app)

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [OpenAI](https://openai.com/) - AI language models
- [Cloudinary](https://cloudinary.com/) - Media management platform
- [Zod](https://zod.dev/) - TypeScript-first schema validation

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/postify/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/postify/discussions)
- **Email:** support@postify.app
- **Documentation:** [docs.postify.app](https://docs.postify.app)

---

## 🔄 API Versioning

Current API version: **v1**

All endpoints are prefixed with `/api` (no version number yet).

Future versions will use: `/api/v2`, `/api/v3`, etc.

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [REST API Design Guide](https://restfulapi.net/)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the Moetaz

[Report Bug](https://github.com/moteaz/postify/issues) · [Request Feature](https://github.com/moteaz/postify/issues) · 

</div>

# 🚀 Postify

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)

**AI-powered job application automation platform that generates personalized cover letters and sends them directly via Gmail.**

![Postify Demo](./docs/demo.gif)

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing](#-testing)
- [📊 Monitoring](#-monitoring)
- [🔐 Security](#-security)
- [📁 Project Structure](#-project-structure)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [🌍 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 API Documentation](#-api-documentation)
- [📜 License](#-license)
- [👤 Author](#-author)

---

## ✨ Features

### 🎯 User Features

- **Google OAuth Authentication** - Secure sign-in with Google account
- **CV Management** - Upload, manage, and archive multiple CVs (PDF/DOCX)
- **AI Cover Letter Generation** - Personalized cover letters using GPT-4o/Ollama/OpenRouter/HuggingFace
- **Multi-Language Support** - Auto-detects job description language (English, French, German, Spanish)
- **Gmail Integration** - Send applications directly from your Gmail account
- **Application History** - Track all sent applications with pagination
- **Admin Dashboard** - User management, analytics, and CSV export (admin only)
- **Responsive Design** - Mobile-first UI with WCAG AA accessibility

### 🔧 Developer Features

- **TypeScript** - Full type safety across frontend and backend
- **Dependency Injection** - Clean architecture with DI container
- **Repository Pattern** - Abstracted data access layer
- **Rate Limiting** - Protection against abuse (100 req/15min)
- **Input Validation** - Zod schemas for request validation
- **XSS Protection** - DOMPurify sanitization
- **Structured Logging** - JSON-formatted logs with levels
- **Health Checks** - `/health` endpoint for monitoring
- **Database Migrations** - Prisma migration system
- **Code Quality** - ESLint + Prettier with strict rules

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  Next.js 16 + React 19 + TypeScript + TailwindCSS          │
│  Port: 3000                                                  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    API SERVER                                │
│  Express.js 5 + TypeScript + Passport.js                   │
│  Port: 5000                                                  │
│  ┌─────────────┬──────────────┬──────────────┐            │
│  │ Controllers │  Services    │ Repositories │            │
│  │ Middleware  │  Validators  │ DI Container │            │
│  └─────────────┴──────────────┴──────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  PostgreSQL 14+ (Prisma ORM)                                │
│  Tables: users, user_cvs, applications, oauth_tokens        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
│  Google OAuth | Gmail API | Cloudinary | OpenAI/Ollama     │
└─────────────────────────────────────────────────────────────┘
```

### 📂 Monorepo Structure

```
Postify/
├── backend/          # Express.js API
├── frontend/         # Next.js App
├── docs/            # Documentation
└── README.md        # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 | React framework with SSR/SSG |
| | React 19 | UI library |
| | TypeScript 5.9 | Type safety |
| | TailwindCSS 4 | Utility-first CSS |
| | shadcn/ui | Component library |
| | TanStack Query | Server state management |
| | Zustand | Client state management |
| | Axios | HTTP client |
| **Backend** | Express.js 5 | Web framework |
| | TypeScript 5.9 | Type safety |
| | Prisma 6.19 | ORM and migrations |
| | Passport.js | OAuth authentication |
| | Zod | Schema validation |
| | Helmet | Security headers |
| | Multer | File uploads |
| **Database** | PostgreSQL 14+ | Relational database |
| **Storage** | Cloudinary | CV file storage (CDN) |
| **AI** | OpenAI GPT-4o | Cover letter generation |
| | Ollama | Local AI alternative |
| | OpenRouter | Multi-model API |
| | HuggingFace | Open-source models |
| **Email** | Gmail API | Email sending |
| | Nodemailer | SMTP client |
| **DevOps** | Docker | Containerization |
| | GitHub Actions | CI/CD (future) |
| **Code Quality** | ESLint | Linting |
| | Prettier | Code formatting |
| | TypeScript | Static analysis |

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **npm** >= 10.0.0 (comes with Node.js)
- **PostgreSQL** >= 14.0 ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### External Accounts Required

- **Google Cloud Console** - For OAuth and Gmail API
  - Create project at [console.cloud.google.com](https://console.cloud.google.com)
  - Enable Google+ API and Gmail API
  - Create OAuth 2.0 credentials
- **Cloudinary** - For file storage ([Sign up](https://cloudinary.com/))
- **OpenAI** - For AI generation ([Sign up](https://platform.openai.com/)) OR
- **Ollama** - For local AI ([Install](https://ollama.ai/))

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/postify.git
cd postify
```

### 2. Environment Variables

#### Backend (`/backend/.env`)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/postify

# JWT Authentication (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
CLIENT_URL=http://localhost:3000

# AI Provider (openai | ollama | openrouter | huggingface)
AI_PROVIDER=openai

# OpenAI (if using OpenAI)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o

# Ollama (if using Ollama - local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# OpenRouter (if using OpenRouter)
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=anthropic/claude-3-haiku

# HuggingFace (if using HuggingFace)
HF_TOKEN=your-huggingface-token
HF_MODEL=deepseek-ai/DeepSeek-R1:novita

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

# Cloudinary (for CV storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Emails (comma-separated)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Logging
LOG_LEVEL=info
```

#### Frontend (`/frontend/.env.local`)

Create a `.env.local` file in the `frontend` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 4. Database Setup

#### Run Migrations

```bash
cd backend
npm run prisma:migrate
```

#### Generate Prisma Client

```bash
npm run prisma:generate
```

#### (Optional) Open Prisma Studio

```bash
npm run prisma:studio
```

### 5. Run in Development

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Backend will run on **http://localhost:5000**

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on **http://localhost:3000**

### 6. Run with Docker

```bash
# From project root
docker-compose up -d
```

**docker-compose.yml** (create in root):

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
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postify:postify@postgres:5432/postify
    depends_on:
      - postgres
    env_file:
      - ./backend/.env

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- userRepository.test.ts
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Backend
cd backend
npm run lint          # Check for errors
npm run lint:fix      # Auto-fix errors
npm run format        # Format code
npm run format:check  # Check formatting

# Frontend
cd frontend
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

### Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 📊 Monitoring

### Health Check Endpoint

```bash
curl http://localhost:5000/health
```

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

### Logging

Logs are output in JSON format:

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Server started",
  "meta": { "port": 5000 }
}
```

**Log Levels:**
- `error` - Critical errors
- `warn` - Warnings
- `info` - General information
- `debug` - Debug information (dev only)

### Future Monitoring (Planned)

- Sentry for error tracking
- CloudWatch for AWS deployments
- Prometheus + Grafana for metrics

---

## 🔐 Security

### Security Measures

- ✅ **HTTPS Enforcement** - Strict-Transport-Security header
- ✅ **JWT Authentication** - HTTP-only secure cookies
- ✅ **OAuth 2.0** - Google authentication only
- ✅ **Rate Limiting** - 100 req/15min (general), 5 req/15min (auth)
- ✅ **Input Validation** - Zod schemas on all endpoints
- ✅ **XSS Protection** - DOMPurify sanitization
- ✅ **SQL Injection Prevention** - Prisma ORM with parameterized queries
- ✅ **CSRF Protection** - SameSite cookies
- ✅ **Security Headers** - Helmet.js (CSP, X-Frame-Options, etc.)
- ✅ **File Upload Validation** - Type, size, and extension checks
- ✅ **Token Refresh** - Automatic OAuth token refresh

### Reporting Security Issues

Please report security vulnerabilities to: **security@postify.app**

Do not open public issues for security vulnerabilities.

---

## 📁 Project Structure

```
Postify/
├── backend/
│   ├── prisma/
│   │   ├── migrations/           # Database migrations
│   │   └── schema.prisma         # Database schema
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   ├── env.ts           # Environment validation
│   │   │   ├── passport.ts      # OAuth strategy
│   │   │   ├── cloudinary.ts    # Cloudinary config
│   │   │   └── constants.ts     # App constants
│   │   ├── controllers/          # Request handlers
│   │   │   ├── aiController.ts
│   │   │   ├── cvController.ts
│   │   │   ├── emailController.ts
│   │   │   └── adminController.ts
│   │   ├── di/                   # Dependency injection
│   │   │   ├── container.ts     # DI container
│   │   │   └── bindings.ts      # Service bindings
│   │   ├── infrastructure/       # Infrastructure layer
│   │   │   ├── database/        # DB health checks
│   │   │   └── logging/         # Logger implementation
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.ts          # JWT validation
│   │   │   ├── admin.ts         # Admin guard
│   │   │   ├── errorHandler.ts  # Global error handler
│   │   │   ├── rateLimiter.ts   # Rate limiting
│   │   │   └── validate.ts      # Zod validation
│   │   ├── repositories/         # Data access layer
│   │   │   ├── userRepository.ts
│   │   │   ├── cvRepository.ts
│   │   │   ├── applicationRepository.ts
│   │   │   └── oauthTokenRepository.ts
│   │   ├── routes/               # API routes
│   │   │   ├── auth.ts
│   │   │   ├── cvRoutes.ts
│   │   │   ├── aiRoutes.ts
│   │   │   ├── emailRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── services/             # Business logic
│   │   │   ├── aiService.ts     # AI generation
│   │   │   ├── emailService.ts  # Email sending
│   │   │   ├── parserService.ts # CV parsing
│   │   │   ├── fileStorageService.ts
│   │   │   ├── tokenManager.ts
│   │   │   ├── promptBuilder.ts
│   │   │   └── healthCheckService.ts
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Utilities
│   │   │   ├── asyncHandler.ts
│   │   │   ├── errors.ts
│   │   │   ├── jwt.ts
│   │   │   ├── pagination.ts
│   │   │   ├── prisma.ts
│   │   │   ├── response.ts
│   │   │   └── validators.ts
│   │   ├── validators/           # Zod schemas
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Entry point
│   ├── uploads/                  # Temp file uploads
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── .prettierrc
│   ├── eslint.config.mjs
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/                   # Static assets
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── (auth)/          # Auth pages
│   │   │   ├── (dashboard)/     # Dashboard pages
│   │   │   ├── admin/           # Admin pages
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── error.tsx        # Error boundary
│   │   │   ├── loading.tsx      # Loading state
│   │   │   ├── not-found.tsx    # 404 page
│   │   │   └── globals.css      # Global styles
│   │   ├── components/           # React components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── landing/         # Landing sections
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   └── admin/           # Admin components
│   │   ├── hooks/                # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useCV.ts
│   │   │   ├── useApplicationGenerator.ts
│   │   │   ├── useApplications.ts
│   │   │   └── useAdmin.ts
│   │   ├── lib/                  # Utilities
│   │   │   ├── utils.ts         # Helper functions
│   │   │   └── queryClient.ts   # TanStack Query
│   │   ├── services/             # API client
│   │   │   └── api.ts           # Axios instance
│   │   ├── store/                # Zustand stores
│   │   │   └── useAuthStore.ts
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Utilities
│   │   │   ├── errorHandler.ts
│   │   │   └── security/        # Security utils
│   │   └── config/               # Configuration
│   │       ├── env.ts
│   │       ├── messages.ts
│   │       └── seo.ts
│   ├── .env.local                # Environment variables
│   ├── .gitignore
│   ├── .prettierrc
│   ├── .eslintrc.json
│   ├── components.json           # shadcn/ui config
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docs/                         # Documentation
│   ├── SYSTEM_ANALYSIS.md
│   ├── SYSTEM_DESIGN.md
│   └── demo.gif
├── .gitignore
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow (Planned)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy to Vercel/AWS/etc"
```

### Pipeline Steps

1. **Lint** - ESLint + Prettier checks
2. **Test** - Unit and integration tests
3. **Build** - TypeScript compilation
4. **Security Scan** - npm audit
5. **Deploy** - Automatic deployment on main branch

---

## 🌍 Deployment

### Production Environment Variables

Ensure all environment variables are set in your hosting platform:

#### Backend (Vercel/Railway/Render)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://api.postify.app/api/auth/google/callback
CLIENT_URL=https://postify.app
AI_PROVIDER=openai
OPENAI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_EMAILS=admin@postify.app
```

#### Frontend (Vercel)

```env
NEXT_PUBLIC_API_URL=https://api.postify.app
NODE_ENV=production
```

### Build Commands

#### Backend

```bash
npm run build
npm run prisma:generate
npm run prisma:migrate
npm start
```

#### Frontend

```bash
npm run build
npm start
```

### Deployment Platforms

- **Frontend:** Vercel (recommended), Netlify, AWS Amplify
- **Backend:** Railway, Render, AWS EC2, DigitalOcean
- **Database:** Supabase, Railway, AWS RDS, Neon

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/yourusername/postify.git
cd postify
git remote add upstream https://github.com/originalowner/postify.git
```

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Tests

Example: `feature/add-linkedin-integration`

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

**Example:**

```
feat(ai): add support for Claude AI provider

- Integrate Anthropic Claude API
- Add configuration for Claude models
- Update AI service to support multiple providers

Closes #123
```

### Pull Request Guidelines

1. Create a feature branch from `develop`
2. Make your changes with clear commits
3. Write/update tests for your changes
4. Ensure all tests pass: `npm test`
5. Run linting: `npm run lint`
6. Update documentation if needed
7. Submit PR to `develop` branch
8. Wait for code review

### Code Style

- Follow existing code style
- Use TypeScript strict mode
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Write meaningful variable names

---

## 📝 API Documentation

### Base URL

- **Development:** `http://localhost:5000/api`
- **Production:** `https://api.postify.app/api`

### Authentication

All protected endpoints require a JWT token:

```
Authorization: Bearer <token>
```

Or via HTTP-only cookie (set automatically after login).

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Authentication** |
| GET | `/auth/google` | No | Initiate Google OAuth |
| GET | `/auth/google/callback` | No | OAuth callback |
| GET | `/auth/me` | Yes | Get current user |
| POST | `/auth/logout` | No | Logout user |
| **CV Management** |
| POST | `/cv/upload` | Yes | Upload CV (multipart/form-data) |
| GET | `/cv` | Yes | Get user's CVs |
| PUT | `/cv/:id/active` | Yes | Set CV as active |
| PUT | `/cv/:id/archive` | Yes | Archive/unarchive CV |
| DELETE | `/cv/:id` | Yes | Delete CV |
| **AI Generation** |
| POST | `/ai/generate` | Yes | Generate cover letter |
| **Email** |
| POST | `/email/send` | Yes | Send application |
| GET | `/email/history` | Yes | Get application history |
| **Admin** |
| GET | `/admin/users` | Admin | Get all users |
| GET | `/admin/users/:id` | Admin | Get user details |
| DELETE | `/admin/users/:id` | Admin | Delete user |
| GET | `/admin/users/export` | Admin | Export users to CSV |
| GET | `/admin/cv/:cvId/download` | Admin | Download user CV |
| **Health** |
| GET | `/health` | No | Health check |

### Example Request

```bash
# Generate cover letter
curl -X POST http://localhost:5000/api/ai/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "We are looking for a senior full-stack developer..."
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "Generated successfully",
  "data": {
    "applicationId": "uuid",
    "content": {
      "coverLetter": "Dear Hiring Manager...",
      "subject": "Application for Senior Full-Stack Developer",
      "recruiterEmail": "hr@company.com"
    }
  }
}
```

### Postman Collection

[Download Postman Collection](./docs/postify.postman_collection.json) (coming soon)

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

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Web framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [OpenAI](https://openai.com/) - AI models
- [Cloudinary](https://cloudinary.com/) - File storage
- [shadcn/ui](https://ui.shadcn.com/) - UI components

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/postify/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/postify/discussions)
- **Email:** support@postify.app

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the Postify Team

</div>

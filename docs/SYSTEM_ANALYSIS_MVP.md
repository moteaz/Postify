# Postify - System Analysis Document

## 1. Executive Summary

**Project Name:** Postify  
**Version:** 1.0.0 (MVP)  
**Type:** AI-Powered Job Application Automation Platform  
**Architecture:** Full-Stack Web Application (Next.js + Express.js)

### Purpose
Postify automates job application processes by generating personalized cover letters using AI and sending them directly via Gmail integration.

### Key Capabilities
- CV/Resume management with Cloudinary storage
- AI-powered cover letter generation (OpenAI/Ollama/OpenRouter/HuggingFace)
- Direct Gmail integration for application submission
- Application history tracking
- Admin dashboard for user management
- Multi-language support (English, French, German, Spanish)

---

## 2. Business Requirements Analysis

### 2.1 Functional Requirements

#### FR-1: User Authentication
- **FR-1.1:** Google OAuth 2.0 authentication
- **FR-1.2:** JWT-based session management
- **FR-1.3:** Role-based access control (USER/ADMIN)
- **FR-1.4:** Secure token refresh mechanism

#### FR-2: CV Management
- **FR-2.1:** Upload CV files (PDF, DOCX) up to 5MB
- **FR-2.2:** Store CVs in Cloudinary with authenticated access
- **FR-2.3:** Set active CV for AI generation
- **FR-2.4:** Archive/unarchive CVs
- **FR-2.5:** Delete CVs (with validation)
- **FR-2.6:** View all uploaded CVs

#### FR-3: AI Content Generation
- **FR-3.1:** Parse CV content (PDF/DOCX)
- **FR-3.2:** Analyze job descriptions
- **FR-3.3:** Detect language automatically (franc library)
- **FR-3.4:** Generate personalized cover letters
- **FR-3.5:** Extract recruiter email from job description
- **FR-3.6:** Generate email subject lines
- **FR-3.7:** Support multiple AI providers (OpenAI, Ollama, OpenRouter, HuggingFace)

#### FR-4: Email Integration
- **FR-4.1:** OAuth 2.0 Gmail integration
- **FR-4.2:** Send applications with CV attachments
- **FR-4.3:** HTML email formatting
- **FR-4.4:** Input sanitization (DOMPurify)
- **FR-4.5:** Email validation

#### FR-5: Application Management
- **FR-5.1:** Save generated applications as drafts
- **FR-5.2:** Track application status (DRAFT/SENT/FAILED)
- **FR-5.3:** View application history with pagination
- **FR-5.4:** View application details
- **FR-5.5:** Retry failed applications

#### FR-6: Admin Features
- **FR-6.1:** View all users with statistics
- **FR-6.2:** View user details and activity
- **FR-6.3:** Delete users (with restrictions)
- **FR-6.4:** Download user CVs
- **FR-6.5:** Export user data to CSV
- **FR-6.6:** Paginated user lists

### 2.2 Non-Functional Requirements

#### NFR-1: Performance
- **NFR-1.1:** API response time < 2s (excluding AI generation)
- **NFR-1.2:** AI generation time < 30s
- **NFR-1.3:** File upload time < 5s for 5MB files
- **NFR-1.4:** Database query optimization with indexes

#### NFR-2: Security
- **NFR-2.1:** HTTPS enforcement in production
- **NFR-2.2:** JWT token expiration (7 days)
- **NFR-2.3:** HTTP-only secure cookies
- **NFR-2.4:** Helmet.js security headers
- **NFR-2.5:** CORS protection
- **NFR-2.6:** Rate limiting (100 req/15min general, 5 req/15min auth)
- **NFR-2.7:** Input validation (Zod schemas)
- **NFR-2.8:** XSS protection (DOMPurify)
- **NFR-2.9:** SQL injection prevention (Prisma ORM)

#### NFR-3: Scalability
- **NFR-3.1:** Horizontal scaling capability
- **NFR-3.2:** Database connection pooling
- **NFR-3.3:** Cloudinary CDN for file storage
- **NFR-3.4:** Stateless API design

#### NFR-4: Reliability
- **NFR-4.1:** 99.5% uptime target
- **NFR-4.2:** Graceful error handling
- **NFR-4.3:** Database transaction support
- **NFR-4.4:** Automatic token refresh
- **NFR-4.5:** Health check endpoint

#### NFR-5: Maintainability
- **NFR-5.1:** TypeScript for type safety
- **NFR-5.2:** ESLint + Prettier code formatting
- **NFR-5.3:** Dependency injection pattern
- **NFR-5.4:** Repository pattern for data access
- **NFR-5.5:** Structured logging (JSON format)

#### NFR-6: Usability
- **NFR-6.1:** Responsive design (mobile-first)
- **NFR-6.2:** WCAG AA accessibility compliance
- **NFR-6.3:** Loading states and progress indicators
- **NFR-6.4:** Toast notifications for user feedback
- **NFR-6.5:** Error messages in user-friendly language

#### NFR-7: Compatibility
- **NFR-7.1:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-7.2:** Node.js 20+
- **NFR-7.3:** PostgreSQL 14+

---

## 3. System Context

### 3.1 External Systems Integration

#### Google OAuth 2.0
- **Purpose:** User authentication
- **Protocol:** OAuth 2.0
- **Scopes:** profile, email, https://mail.google.com/
- **Data Flow:** Bidirectional (auth + token refresh)

#### Gmail API
- **Purpose:** Send job applications
- **Protocol:** HTTP REST with OAuth 2.0
- **Port:** 443 (HTTPS)
- **Data Flow:** Outbound only

#### Cloudinary
- **Purpose:** CV file storage and delivery
- **Protocol:** HTTPS REST API
- **Features:** Authenticated uploads, CDN delivery
- **Data Flow:** Bidirectional (upload/download)

#### AI Providers
1. **OpenAI API**
   - Model: GPT-4o (default)
   - JSON response format
   
2. **Ollama (Local)**
   - Model: Llama3 (default)
   - Self-hosted option
   
3. **OpenRouter**
   - Model: Claude-3-Haiku (default)
   - Multiple model support
   
4. **HuggingFace**
   - Model: DeepSeek-R1 (default)
   - Open-source models

### 3.2 User Roles

#### Regular User (USER)
- Upload and manage CVs
- Generate cover letters
- Send applications
- View application history

#### Administrator (ADMIN)
- All USER permissions
- View all users
- Delete users
- Export user data
- Download user CVs
- Access admin dashboard

---

## 4. Data Analysis

### 4.1 Data Entities

#### User
- **Primary Key:** UUID
- **Unique Constraints:** email, (provider + providerAccountId)
- **Relationships:** 1:N with UserCV, Application, OAuthToken
- **Cascade Delete:** All related records

#### UserCV
- **Primary Key:** UUID
- **Foreign Keys:** userId
- **Indexes:** (userId, isArchived), (userId, isActive), isActive
- **Business Rules:** 
  - Only one active CV per user
  - Cannot delete active CV
  - Cannot delete CV with applications

#### Application
- **Primary Key:** UUID
- **Foreign Keys:** userId, cvId
- **Indexes:** (userId, status), cvId, (userId, generatedAt), status, (userId, status, generatedAt)
- **Status Flow:** DRAFT → SENT/FAILED

#### OAuthToken
- **Primary Key:** UUID
- **Foreign Keys:** userId
- **Unique Constraint:** (userId, provider)
- **Security:** Encrypted storage, automatic refresh

### 4.2 Data Volumes (Estimated)

| Entity | Initial | 1 Year | 3 Years |
|--------|---------|--------|---------|
| Users | 100 | 10,000 | 50,000 |
| CVs | 150 | 15,000 | 75,000 |
| Applications | 500 | 100,000 | 1,000,000 |
| Tokens | 100 | 10,000 | 50,000 |

### 4.3 Data Retention

- **User Data:** Retained until account deletion
- **CVs:** Retained until manual deletion or account deletion
- **Applications:** Retained indefinitely (audit trail)
- **OAuth Tokens:** Refreshed automatically, expired tokens removed
- **Logs:** 90 days retention (production)

---

## 5. Technical Constraints

### 5.1 Technology Stack Constraints
- **Frontend:** Next.js 16+ (React 19)
- **Backend:** Node.js 20+ with Express.js 5
- **Database:** PostgreSQL only (Prisma ORM)
- **File Storage:** Cloudinary (no local storage in production)

### 5.2 Resource Constraints
- **File Size:** 5MB max per CV
- **Request Size:** 10MB max JSON payload
- **Rate Limits:** 
  - 100 requests/15min (general)
  - 5 requests/15min (auth)
  - 10 uploads/hour
- **AI Generation:** 350 words max cover letter

### 5.3 Security Constraints
- **Authentication:** Google OAuth only (no email/password)
- **Authorization:** JWT tokens only
- **File Types:** PDF and DOCX only
- **Email Provider:** Gmail only

### 5.4 Deployment Constraints
- **Environment Variables:** 15+ required variables
- **Database:** PostgreSQL with connection pooling
- **HTTPS:** Required in production
- **CORS:** Single origin allowed

---

## 6. Risk Analysis

### 6.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI API downtime | Medium | High | Multiple provider support, fallback options |
| Gmail API rate limits | Medium | High | Rate limiting, queue system (future) |
| Cloudinary storage costs | Low | Medium | File size limits, cleanup policies |
| Database performance | Low | High | Indexes, connection pooling, query optimization |
| Token expiration issues | Medium | Medium | Automatic refresh, error handling |

### 6.2 Security Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| XSS attacks | Low | High | DOMPurify sanitization, CSP headers |
| CSRF attacks | Low | High | SameSite cookies, CORS restrictions |
| SQL injection | Very Low | Critical | Prisma ORM, parameterized queries |
| Unauthorized access | Medium | High | JWT validation, role-based access |
| Data breach | Low | Critical | Encrypted tokens, secure storage, HTTPS |

### 6.3 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI generation quality | Medium | High | Prompt engineering, user feedback |
| Email deliverability | Medium | Medium | Gmail integration, proper formatting |
| User adoption | Medium | High | UX optimization, onboarding flow |
| Cost overruns | Low | Medium | Usage monitoring, cost alerts |

---

## 7. Assumptions and Dependencies

### 7.1 Assumptions
1. Users have Google accounts
2. Users grant Gmail send permissions
3. Job descriptions contain sufficient information
4. CVs are in standard formats (PDF/DOCX)
5. Internet connectivity is stable
6. AI providers maintain API compatibility

### 7.2 Dependencies

#### Critical Dependencies
- Google OAuth API availability
- Gmail REST API service availability
- Cloudinary service availability
- At least one AI provider availability
- PostgreSQL database availability

#### Development Dependencies
- Node.js ecosystem stability
- Prisma ORM compatibility
- Next.js framework updates
- TypeScript compiler

---

## 8. Success Metrics

### 8.1 Technical Metrics
- **API Uptime:** > 99.5%
- **Average Response Time:** < 2s
- **Error Rate:** < 1%
- **Database Query Time:** < 100ms (p95)

### 8.2 Business Metrics
- **User Registration Rate:** Track weekly
- **CV Upload Rate:** Track per user
- **Application Generation Rate:** Track daily
- **Application Send Rate:** Track success/failure ratio
- **User Retention:** Track 30-day retention

### 8.3 Quality Metrics
- **Code Coverage:** > 70% (future)
- **TypeScript Strict Mode:** Enabled
- **ESLint Errors:** 0
- **Security Vulnerabilities:** 0 critical/high

---

## 9. Future Enhancements (Post-MVP)

### Phase 2 (3-6 months)
- Email/password authentication option
- Multiple CV versions per user
- Application templates
- Bulk application sending
- Email scheduling

### Phase 3 (6-12 months)
- LinkedIn integration
- Job board scraping
- Application tracking system
- Analytics dashboard
- Team collaboration features

### Phase 4 (12+ months)
- Mobile applications (iOS/Android)
- Browser extension
- API for third-party integrations
- Premium features (subscription model)
- Multi-language UI support

---

## 10. Compliance and Legal

### 10.1 Data Privacy
- **GDPR Compliance:** User data deletion on request
- **Data Storage:** EU/US regions (Cloudinary)
- **User Consent:** OAuth consent screen
- **Privacy Policy:** Required (to be implemented)

### 10.2 Terms of Service
- **User Responsibilities:** Accurate information
- **Service Limitations:** No guarantee of job success
- **Data Usage:** AI training exclusion
- **Account Termination:** Admin rights

### 10.3 Third-Party Compliance
- **Google API Terms:** OAuth and Gmail API compliance
- **Cloudinary Terms:** Storage and bandwidth limits
- **AI Provider Terms:** API usage compliance

---

## Document Control

**Version:** 1.0  
**Date:** 2025  
**Author:** System Analyst  
**Status:** Final - MVP Analysis  
**Next Review:** Post-MVP Launch

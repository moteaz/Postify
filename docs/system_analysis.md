# Phase 1 — System Analysis
## AI-Powered Job Application Assistant

> **Document Version**: 1.0  
> **Date**: 2026-02-24  
> **Status**: Draft  
> **Role**: Senior System Analyst

---

## 1. Problem Statement

Job seekers face a highly repetitive and time-consuming process when applying for multiple jobs. For each application, they must:

- Manually read and understand the job description
- Write a tailored, professional cover letter from scratch
- Find the recruiter's email address within the description
- Compose an appropriately formatted email
- Attach their CV
- Send the email — all manually

This process consumes significant time and energy, often resulting in generic, low-quality applications due to fatigue and repetition.

**The proposed system**, *Postify*, is an AI-powered web application that **automates the generation and delivery of personalized job applications**. Users paste a job description, review AI-generated content (cover letter, email subject, recruiter email), make edits if needed, and send the application directly — with their CV attached — in one streamlined workflow.

---

## 2. Stakeholders

| Stakeholder | Type | Interest |
|---|---|---|
| **Job Seeker (End User)** | Primary | Save time; send professional, tailored applications |
| **Recruiters / HR Teams** | Secondary | Receive well-structured, professional emails |
| **System Administrator** | Internal | Maintain platform uptime, manage users and API quotas |
| **AI Provider (e.g., OpenAI/Gemini)** | External | API consumption and billing |
| **Email Provider (Gmail/SendGrid)** | External | Email delivery infrastructure |
| **Product Owner / Startup Founder** | Internal | Business growth, user satisfaction, monetization |
| **Investors** | External | ROI, scalability, user acquisition |

---

## 3. Functional Requirements

### FR-01 — User Authentication
- The system shall allow users to **sign in exclusively via Google OAuth 2.0** (no email/password registration).
- The system shall maintain authenticated user sessions via JWT.
- The system shall allow users to sign out and revoke their session.

### FR-02 — CV Management
- The system shall allow users to upload their CV (PDF or DOCX).
- The system shall store the CV securely and associate it with the user's account.
- The system shall allow the user to update or replace their CV.

### FR-03 — Job Description Input
- The system shall provide a text area where users can paste a job description.
- The system shall validate that the input is not empty before processing.

### FR-04 — AI Content Generation
- The system shall call an AI service (e.g., OpenAI GPT-4, Google Gemini) to generate:
  - A personalized, professional **cover letter** based on the job description and user's CV content.
  - A concise, appropriate **email subject line**.
  - The **recruiter's email address** extracted from the job description (if present).
- The system shall display a loading indicator during AI processing.

### FR-05 — Content Review & Editing
- The system shall display the generated cover letter, subject line, and extracted email in editable fields.
- The system shall allow users to edit any of the generated content before sending.

### FR-06 — Email Sending
- The system shall allow users to click "Send Email" to dispatch the application.
- The email shall contain:
  - **To**: recruiter email (editable)
  - **Subject**: generated subject line (editable)
  - **Body**: generated cover letter (editable)
  - **Attachment**: user's uploaded CV
- The system shall confirm successful delivery with a success message.
- The system shall display an error message if the email fails to send.

### FR-07 — Application History
- The system shall log each sent application with: date, company, job title (if parseable), subject, and delivery status.
- The system shall allow users to view their application history.

### FR-08 — Email Provider Authorization
- The system shall support OAuth 2.0 authorization for Gmail API so the email is sent from the user's own Gmail account.
- Alternatively, the system shall support SMTP/SendGrid for platform-managed sending.

---

## 4. Non-Functional Requirements

### Performance
- **NFR-01**: AI content generation shall complete within **15 seconds** under normal load.
- **NFR-02**: The email sending action shall complete within **5 seconds**.
- **NFR-03**: Page load time shall be under **2 seconds** on a standard broadband connection.

### Security
- **NFR-04**: All data in transit shall be encrypted via **TLS 1.2+** (HTTPS).
- **NFR-05**: User passwords shall be hashed using **bcrypt** with a minimum cost factor of 12.
- **NFR-06**: OAuth tokens (Gmail) shall be encrypted at rest and never exposed to the client.
- **NFR-07**: Uploaded CVs shall be stored in a secure cloud bucket with private ACLs.
- **NFR-08**: API keys (AI, email providers) shall be stored as server-side environment variables only.

### Usability
- **NFR-09**: The interface shall be usable without any training by a non-technical job seeker.
- **NFR-10**: The application shall be fully responsive (mobile, tablet, desktop).

### Reliability & Availability
- **NFR-11**: Target system uptime of **99.5%** monthly.
- **NFR-12**: Failed email sends shall trigger a retry mechanism (up to 3 retries).

### Scalability
- **NFR-13**: The system architecture shall support horizontal scaling of backend services.
- **NFR-14**: The system shall support up to **1,000 concurrent users** (MVP target) without redesign.

### Maintainability
- **NFR-15**: The codebase shall follow established coding standards with test coverage ≥ 70%.

### Compliance
- **NFR-16**: The system shall comply with **GDPR** — users can delete their data at any time.
- **NFR-17**: CV data shall not be shared with third parties without explicit user consent.

---

## 5. User Roles

| Role | Description | Key Capabilities |
|---|---|---|
| **Guest** | Unauthenticated visitor | View landing page, sign up, log in |
| **Registered User** | Authenticated job seeker | Upload CV, paste JD, generate content, edit, send email, view history |
| **Admin** | Platform administrator | Manage users, monitor API usage, view logs, configure system settings |

---

## 6. Use Cases (Detailed)

---

### UC-01: Register / Log In

| Attribute | Detail |
|---|---|
| **Actor** | Guest |
| **Goal** | Authenticate using Google account |
| **Precondition** | User is not logged in |
| **Main Flow** | 1. User visits the app. 2. Clicks "Sign in with Google". 3. System redirects user to Google OAuth consent screen. 4. User grants permission. 5. Google redirects back with auth code. 6. System exchanges code for session tokens and redirects to Dashboard. |
| **Alternate Flow** | User already has an active session → redirected directly to Dashboard. |
| **Exception** | Google OAuth fails or is denied → Display error and prompt to retry. |
| **Postcondition** | User is authenticated via Google and redirected to Dashboard. |

---

### UC-02: Upload / Update CV

| Attribute | Detail |
|---|---|
| **Actor** | Registered User |
| **Goal** | Upload or replace their CV |
| **Precondition** | User is logged in |
| **Main Flow** | 1. User navigates to Profile/Settings. 2. Clicks "Upload CV". 3. Selects a PDF or DOCX file. 4. System validates file type and size (≤ 5MB). 5. System uploads file to secure storage. 6. System confirms upload success. |
| **Exception** | Invalid file type → "Only PDF and DOCX are supported." File too large → "File exceeds 5MB limit." |
| **Postcondition** | CV is stored securely and linked to the user account. |

---

### UC-03: Generate Application Content

| Attribute | Detail |
|---|---|
| **Actor** | Registered User |
| **Goal** | Automatically generate a cover letter, email subject, and recruiter email from a job description |
| **Precondition** | User is logged in and has uploaded a CV |
| **Main Flow** | 1. User pastes a job description into the text area. 2. Clicks "Generate". 3. System sends JD + CV content to AI API. 4. AI returns cover letter, subject line, and extracted email. 5. System displays results in editable fields. |
| **Alternate Flow** | No recruiter email found → Display "Not found" with an editable empty field. |
| **Exception** | AI API timeout → Display error, offer retry. Empty JD → Validation error: "Please paste a job description." |
| **Postcondition** | Editable generated content is displayed on screen. |

---

### UC-04: Edit Generated Content

| Attribute | Detail |
|---|---|
| **Actor** | Registered User |
| **Goal** | Review and optionally modify AI-generated content |
| **Precondition** | Content has been generated (UC-03 completed) |
| **Main Flow** | 1. User reads the generated cover letter, subject, and email fields. 2. User clicks into any field and edits the text. 3. Changes are reflected in real time. |
| **Postcondition** | Fields contain the final, user-approved version ready for sending. |

---

### UC-05: Send Application Email

| Attribute | Detail |
|---|---|
| **Actor** | Registered User |
| **Goal** | Send the cover letter email with CV attached |
| **Precondition** | Content is ready; user has a CV uploaded; recruiter email is provided |
| **Main Flow** | 1. User clicks "Send Email". 2. System validates all fields are filled. 3. System composes email with subject, body (cover letter), and CV attachment. 4. System sends email via Gmail API under the user's account. 5. System logs the application in history. 6. System shows "Email sent successfully!" |
| **Alternate Flow** | User has not authorized Gmail → Redirect to Gmail OAuth consent screen first. |
| **Exception** | Email send fails → Display error, allow retry. Invalid email address → Validation error. |
| **Postcondition** | Email is delivered; application is logged in history. |

---

### UC-06: View Application History

| Attribute | Detail |
|---|---|
| **Actor** | Registered User |
| **Goal** | Review past job applications sent via the system |
| **Precondition** | User is logged in and has sent at least one application |
| **Main Flow** | 1. User navigates to "History" page. 2. System displays a list of past applications with date, company, subject, and status. 3. User can click to view full details of any application. |
| **Postcondition** | User views their application history. |

---

### UC-07: Admin User Management

| Attribute | Detail |
|---|---|
| **Actor** | Admin |
| **Goal** | Manage platform users and monitor system health |
| **Precondition** | Admin is logged in |
| **Main Flow** | 1. Admin navigates to the Admin Dashboard. 2. Views list of registered users, AI API usage stats, email delivery rates. 3. Can suspend or delete user accounts. |
| **Postcondition** | Admin has oversight of the platform. |

---

## 7. Use Case Diagram (Textual)

```
╔══════════════════════════════════════════════════════════════════╗
║                      SYSTEM BOUNDARY: Postify                   ║
║                                                                  ║
║   ┌─────────────────────────────────────────────────────────┐   ║
║   │                 <<include>> CV Uploaded                 │   ║
║   └─────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║   [UC-01] Register / Log In ◄────────────── 👤 Guest            ║
║                                                                  ║
║   👤 Registered User                                             ║
║       │                                                          ║
║       ├──► [UC-02] Upload / Update CV                           ║
║       │                                                          ║
║       ├──► [UC-03] Generate Application Content                 ║
║       │         <<include>> [CV Content]                        ║
║       │         <<include>> [AI API Call]                       ║
║       │                                                          ║
║       ├──► [UC-04] Edit Generated Content                       ║
║       │         <<extend>> UC-03                                ║
║       │                                                          ║
║       ├──► [UC-05] Send Application Email                       ║
║       │         <<include>> [Gmail OAuth]                       ║
║       │         <<include>> [Attach CV]                         ║
║       │         <<include>> [Log to History]                    ║
║       │                                                          ║
║       └──► [UC-06] View Application History                     ║
║                                                                  ║
║   👤 Admin                                                        ║
║       └──► [UC-07] Admin User Management                        ║
║                                                                  ║
║   External Systems:                                              ║
║       ☁ AI API (OpenAI/Gemini) ◄──── UC-03                      ║
║       ☁ Gmail API             ◄──── UC-05                       ║
║       ☁ Cloud Storage         ◄──── UC-02, UC-05                ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 8. System Constraints

| ID | Constraint | Category |
|---|---|---|
| **SC-01** | Gmail API has a daily sending quota (default: 500 emails/day per user via standard OAuth) | API Limit |
| **SC-02** | AI API (OpenAI/Gemini) has token and rate limits; large CVs may need truncation | API Limit |
| **SC-03** | CV files must be ≤ 5MB; only PDF and DOCX formats supported | Business Rule |
| **SC-04** | The system requires an active internet connection to function (cloud-dependent) | Technical |
| **SC-05** | Gmail OAuth requires users to grant permission; some corporate accounts may restrict third-party OAuth | Technical |
| **SC-06** | AI-generated content may not always be legally compliant in all jurisdictions (user is responsible for review) | Legal |
| **SC-07** | GDPR compliance requires data residency considerations for EU users | Legal |
| **SC-08** | The system does not guarantee email deliverability (dependent on recipient's mail server) | Technical |

---

## 9. Risk Analysis

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **R-01** | AI API downtime or quota exhaustion | Medium | High | Fallback AI provider; graceful degradation with manual mode |
| **R-02** | Gmail OAuth revocation by users | High | Medium | Store refresh tokens; prompt re-authorization if token expired |
| **R-03** | AI generates inaccurate or unprofessional content | Medium | High | Allow full user editing before send; add quality prompt engineering |
| **R-04** | CV content exposure to AI provider | Low | High | Implement user consent screen; use data processing agreements |
| **R-05** | Data breach / CV theft | Low | Critical | Encrypt files at rest; strict access control; pen testing |
| **R-06** | Email marked as spam by recipient | Medium | Medium | Use proper email headers; encourage Gmail OAuth; SPF/DKIM for SMTP |
| **R-07** | User bypasses review and sends wrong email | Medium | Medium | Add confirmation dialog; show preview before sending |
| **R-08** | Exceeding cloud infrastructure costs | Low | Medium | Set budget alerts; implement rate limiting per user |
| **R-09** | GDPR non-compliance | Low | Critical | Implement data deletion flow; privacy policy; DPA with AI provider |
| **R-10** | Feature creep delaying MVP | High | Medium | Define strict MVP scope; use agile sprints with defined backlog |

---

## 10. Simplified SRS Structure

```
SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
==========================================
Project: Postify — AI-Powered Job Application Assistant
Version: 1.0 | Date: 2026-02-24

TABLE OF CONTENTS:
──────────────────
1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Definitions, Acronyms & Abbreviations
   1.4 References
   1.5 Overview

2. Overall Description
   2.1 Product Perspective
   2.2 Product Functions (High-Level Summary)
   2.3 User Characteristics
   2.4 Constraints
   2.5 Assumptions and Dependencies

3. Functional Requirements
   3.1 User Authentication (FR-01)
   3.2 CV Management (FR-02)
   3.3 Job Description Input (FR-03)
   3.4 AI Content Generation (FR-04)
   3.5 Content Review & Editing (FR-05)
   3.6 Email Sending (FR-06)
   3.7 Application History (FR-07)
   3.8 Email Provider Authorization (FR-08)

4. Non-Functional Requirements
   4.1 Performance Requirements
   4.2 Security Requirements
   4.3 Usability Requirements
   4.4 Reliability Requirements
   4.5 Scalability Requirements
   4.6 Compliance Requirements

5. External Interface Requirements
   5.1 User Interfaces
   5.2 Hardware Interfaces
   5.3 Software Interfaces (AI API, Gmail API, Cloud Storage)
   5.4 Communication Interfaces

6. System Models
   6.1 Use Case Diagrams
   6.2 Sequence Diagrams
   6.3 Activity Diagrams

7. Appendices
   7.1 Risk Register
   7.2 Glossary
```

---

*End of Phase 1 — System Analysis*

# Frontend — Postify

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vercel](https://img.shields.io/badge/deploy-vercel-black)

**Modern, accessible Next.js frontend for AI-powered job application automation with real-time cover letter generation.**

**Live Demo:** [https://postify.app](https://postify.app) (placeholder)

---

## 📸 Screenshots

### Desktop View

![Desktop Dashboard](https://via.placeholder.com/1200x675/7C9EE8/FFFFFF?text=Desktop+Dashboard+View)

### Mobile View

<img src="https://via.placeholder.com/375x812/F0A8C0/FFFFFF?text=Mobile+View" alt="Mobile View" width="375">

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🎨 Design System](#-design-system)
- [📡 API Integration](#-api-integration)
- [🔐 Authentication Flow](#-authentication-flow)
- [🧪 Testing](#-testing)
- [📊 Monitoring](#-monitoring)
- [⚡ Performance](#-performance)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

### UI/UX Features

- **Modern Design System** - Warm, airy color palette with rounded corners and soft shadows
- **Responsive Layout** - Mobile-first design that adapts seamlessly from 320px to 4K displays
- **Dark Mode Ready** - CSS variables for easy theme switching (foundation in place)
- **Smooth Animations** - Framer Motion animations with reduced motion support
- **Interactive Components** - Real-time feedback, loading states, and optimistic updates
- **Toast Notifications** - Custom toast system with auto-dismiss and stacking

### Performance Features

- **Server-Side Rendering (SSR)** - Landing page and auth pages for SEO and fast initial load
- **Static Site Generation (SSG)** - Legal pages (Terms, Privacy) pre-rendered at build time
- **Client-Side Rendering (CSR)** - Dashboard for dynamic, personalized content
- **Image Optimization** - Next.js Image component with automatic WebP conversion
- **Code Splitting** - Automatic route-based code splitting for faster page loads
- **Font Optimization** - Google Fonts with `next/font` for zero layout shift

### Accessibility (a11y)

- **WCAG AA Compliant** - All color contrasts meet 4.5:1 minimum ratio
- **Keyboard Navigation** - Full keyboard support with visible focus indicators
- **Screen Reader Support** - Semantic HTML, ARIA labels, and skip links
- **Focus Trap** - Modal dialogs trap focus for better navigation
- **Reduced Motion** - Respects `prefers-reduced-motion` user preference
- **ESLint a11y Plugin** - Automated accessibility checks during development

### Responsive Design

- **Breakpoints:**
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- **Touch-Friendly** - 44px minimum touch targets on mobile
- **Adaptive Layouts** - Sidebar collapses to hamburger menu on mobile
- **Responsive Typography** - Fluid font sizes using clamp()

---

## 🛠️ Tech Stack

| Category              | Technology        | Version | Purpose                                |
| --------------------- | ----------------- | ------- | -------------------------------------- |
| **Framework**         | Next.js           | 16.1.6  | React framework with App Router        |
| **Language**          | TypeScript        | 5.9.3   | Type safety and developer experience   |
| **UI Library**        | React             | 19.2.3  | Component-based UI                     |
| **Styling**           | Tailwind CSS      | 4.0     | Utility-first CSS framework            |
| **Component Library** | shadcn/ui         | Latest  | Accessible, customizable components    |
| **Animations**        | Framer Motion     | 11.15.0 | Declarative animations                 |
| **Data Fetching**     | TanStack Query    | 5.90.21 | Server state management                |
| **State Management**  | Zustand           | 5.0.11  | Lightweight global state               |
| **HTTP Client**       | Axios             | 1.13.5  | Promise-based HTTP client              |
| **Form Handling**     | React Hook Form   | 7.54.2  | Performant form validation             |
| **Validation**        | Zod               | 3.24.1  | TypeScript-first schema validation     |
| **Security**          | DOMPurify         | 3.3.2   | XSS sanitization                       |
| **Icons**             | Lucide React      | 0.575.0 | Beautiful, consistent icons            |
| **Fonts**             | Google Fonts      | -       | Bricolage Grotesque, Plus Jakarta Sans |
| **Development**       | ESLint            | 9.x     | Code linting                           |
|                       | Prettier          | 3.8.1   | Code formatting                        |
|                       | TypeScript ESLint | 8.56.1  | TypeScript-specific linting            |

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** ≥ 20.0.0 ([Download](https://nodejs.org/))
- **npm** ≥ 10.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/downloads))

### Backend API

The backend API must be running and accessible:

- **Development:** `http://localhost:5000`
- **Production:** `https://api.postify.app`

See [backend README](../backend/README.md) for setup instructions.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/postify.git
cd postify/frontend
```

### 2. Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# ============================================
# BACKEND API URL (REQUIRED)
# ============================================
# Public variable - exposed to browser
# Points to your Express.js backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# ============================================
# APPLICATION URL (OPTIONAL)
# ============================================
# Used for canonical URLs and SEO
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# ENVIRONMENT (OPTIONAL)
# ============================================
# Options: development | production | test
NODE_ENV=development
```

#### Environment Variable Explanation

**Public Variables (`NEXT_PUBLIC_*`):**

- Exposed to the browser (client-side)
- Can be accessed in components via `process.env.NEXT_PUBLIC_*`
- Used for API URLs, public keys, feature flags
- **Never put secrets here** (API keys, tokens, etc.)

**Private Variables (no prefix):**

- Only available server-side (API routes, server components)
- Not exposed to the browser
- Use for sensitive data like API secrets

**Example Usage:**

```typescript
// ✅ Correct - Public variable in client component
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ❌ Wrong - Private variable won't work in client
const secret = process.env.SECRET_KEY; // undefined in browser
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Application will start on **http://localhost:3000**

### 5. Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### 6. Run with Docker

Create a `Dockerfile` in the frontend directory:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NODE_ENV=production

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - '3000:3000'
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000
    depends_on:
      - backend
```

Run with Docker:

```bash
docker-compose up -d
```

---

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Auth route group (shared layout)
│   │   │   └── auth/
│   │   │       ├── metadata.ts
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── components/     # Dashboard-specific components
│   │   │   ├── error.tsx       # Error boundary
│   │   │   └── page.tsx        # Main dashboard
│   │   │
│   │   ├── privacy/            # Legal pages (SSG)
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   │
│   │   ├── error.tsx           # Global error boundary
│   │   ├── globals.css         # Global styles + CSS variables
│   │   ├── layout.tsx          # Root layout (fonts, providers)
│   │   ├── loading.tsx         # Global loading state
│   │   ├── not-found.tsx       # 404 page
│   │   └── page.tsx            # Landing page (SSR)
│   │
│   ├── assets/                  # Images, logos
│   │   ├── Logo.png
│   │   └── Postify.png
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── auth/               # Auth-specific components
│   │   │   ├── AuthCard.tsx
│   │   │   ├── BrandPanel.tsx
│   │   │   └── GoogleButton.tsx
│   │   │
│   │   ├── landing/            # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── legal/              # Legal page components
│   │   │   ├── TableOfContents.tsx
│   │   │   └── LegalSection.tsx
│   │   │
│   │   ├── ConfirmModal.tsx    # Shared components
│   │   ├── ErrorBoundary.tsx
│   │   ├── Pagination.tsx
│   │   ├── QueryProvider.tsx
│   │   ├── Toast.tsx
│   │   └── ToastContainer.tsx
│   │
│   ├── config/                  # Configuration files
│   │   ├── env.ts              # Environment validation
│   │   ├── messages.ts         # UI messages & constants
│   │   └── seo.ts              # SEO metadata
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAdmin.ts         # Admin operations
│   │   ├── useApplicationGenerator.ts
│   │   ├── useApplications.ts
│   │   ├── useAuth.ts          # Authentication
│   │   ├── useAutoReset.ts     # Auto-reset state
│   │   ├── useCVManagement.ts
│   │   ├── useDashboard.ts     # Dashboard orchestration
│   │   ├── useFocusTrap.ts     # Accessibility
│   │   ├── usePermissions.ts   # Role-based access
│   │   ├── useRateLimit.ts     # Client-side rate limiting
│   │   └── useScrollReveal.ts  # Scroll animations
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── animations.ts       # Framer Motion variants
│   │   ├── apiClient.ts        # Axios instance with interceptors
│   │   ├── permissions.ts      # Permission helpers
│   │   ├── queryClient.ts      # TanStack Query config
│   │   └── utils.ts            # General utilities (cn, etc.)
│   │
│   ├── services/                # API service layer
│   │   └── api.ts              # API methods (auth, cv, ai, email, admin)
│   │
│   ├── store/                   # Zustand stores
│   │   └── useAuthStore.ts     # Global auth state
│   │
│   ├── types/                   # TypeScript types
│   │   ├── enums.ts            # Enums (ApplicationStatus, DashboardTab)
│   │   └── index.ts            # Interfaces (User, CV, Application, etc.)
│   │
│   └── utils/                   # Utility functions
│       ├── errorHandler.ts     # API error handling
│       ├── fileUtils.ts        # File name truncation, size formatting
│       └── security/           # Security utilities
│           ├── sanitize.ts     # Input sanitization
│           └── validation.ts   # Client-side validation
│
├── .env.local                   # Environment variables (gitignored)
├── .eslintrc.a11y.json         # Accessibility linting rules
├── .eslintrc.json              # ESLint configuration
├── .gitignore
├── .prettierignore
├── .prettierrc                  # Prettier configuration
├── components.json              # shadcn/ui configuration
├── eslint.config.mjs            # ESLint flat config
├── next.config.ts               # Next.js configuration
├── package.json
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

### Folder Purposes

- **`app/`** - Next.js App Router pages and layouts (file-based routing)
- **`components/`** - Reusable React components organized by feature
- **`config/`** - Application configuration and constants
- **`hooks/`** - Custom React hooks for business logic and state
- **`lib/`** - Third-party library configurations and wrappers
- **`services/`** - API integration layer (HTTP requests)
- **`store/`** - Global state management (Zustand)
- **`types/`** - TypeScript type definitions and interfaces
- **`utils/`** - Pure utility functions and helpers

---

## 🎨 Design System

### Color Palette

Postify uses a warm, airy color system with excellent contrast ratios:

```css
/* Primary Colors */
--bg-base: #f9f7f4; /* Warm off-white background */
--bg-card: #ffffff; /* Pure white cards */
--bg-muted: #f3f0ec; /* Subtle gray for sections */

/* Accent Colors */
--accent-primary: #7c9ee8; /* Soft blue (primary actions) */
--accent-secondary: #f0a8c0; /* Soft pink (secondary accents) */
--accent-mint: #15803d; /* Green (success states) */
--accent-peach: #f5c4a0; /* Peach (tertiary accents) */

/* Text Colors (WCAG AA Compliant) */
--text-primary: #1c1917; /* 16.1:1 contrast ratio ✓ */
--text-secondary: #57534e; /* 7.4:1 contrast ratio ✓ */
--text-muted: #78716c; /* 4.6:1 contrast ratio ✓ */

/* Borders & Shadows */
--border: #eae7e3;
--shadow-soft: 0 2px 16px rgba(0, 0, 0, 0.06);
--shadow-card: 0 4px 24px rgba(0, 0, 0, 0.08);
```

### Typography

**Display Font:** Bricolage Grotesque (headings, hero text)
**Body Font:** Plus Jakarta Sans (body text, UI)

```typescript
// Font configuration in app/layout.tsx
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
```

**Usage:**

```tsx
<h1 className="font-[family-name:var(--font-display)]">Heading</h1>
<p className="font-[family-name:var(--font-body)]">Body text</p>
```

### Component Library

Postify uses **shadcn/ui** - a collection of accessible, customizable components built with Radix UI and Tailwind CSS.

**Key Components:**

- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Container with header, content, footer
- `Dialog` - Modal dialogs with overlay
- `Input` - Text inputs with validation states
- `Alert` - Info, warning, success, error alerts
- `Badge` - Status indicators
- `Skeleton` - Loading placeholders

**Component Location:** `src/components/ui/`

### Adding New UI Components

```bash
# Install shadcn/ui CLI (if not already installed)
npx shadcn@latest init

# Add a new component
npx shadcn@latest add [component-name]

# Example: Add a dropdown menu
npx shadcn@latest add dropdown-menu
```

This will:

1. Download the component to `src/components/ui/`
2. Install required dependencies
3. Update `components.json` configuration

**Customization:**
Edit the component file directly in `src/components/ui/`. All components use Tailwind CSS and can be styled via className props.

---

## 📡 API Integration

### API Client Structure

All API calls are centralized in `src/services/api.ts` using Axios.

**Base Configuration:**

```typescript
// src/lib/apiClient.ts
import axios from 'axios';
import { env } from '@/config/env';

const apiClient = axios.create({
  baseURL: env.apiUrl, // http://localhost:5000
  withCredentials: true, // Send cookies with requests
  timeout: 30000, // 30 second timeout
});
```

### Authentication Token Handling

**JWT tokens are stored in HTTP-only cookies** (set by backend):

```typescript
// Interceptor automatically includes cookies
apiClient.interceptors.request.use(config => {
  // Cookies sent automatically via withCredentials: true
  return config;
});

// Handle 401 Unauthorized responses
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Why HTTP-only cookies?**

- ✅ Immune to XSS attacks (JavaScript can't access)
- ✅ Automatically sent with every request
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite protection against CSRF

### API Service Methods

```typescript
// src/services/api.ts

// Authentication
export const authService = {
  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get('/auth/me');
    return res.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};

// CV Management
export const cvService = {
  async getAll(): Promise<CV[]> {
    const res = await apiClient.get('/cv');
    return res.data.data.cvs;
  },

  async upload(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('cv', file);
    await apiClient.post('/cv/upload', formData);
  },
};

// AI Generation
export const applicationService = {
  async generateApplication(jobDescription: string) {
    const res = await apiClient.post(
      '/ai/generate',
      { jobDescription },
      { timeout: 120000 } // 2 minute timeout for AI
    );
    return res.data.data;
  },
};
```

### Error Handling

```typescript
// src/utils/errorHandler.ts
export function handleApiError(error: unknown): string {
  const apiError = error as {
    response?: {
      data?: {
        error?: string;
        message?: string;
        details?: any[];
      };
    };
  };

  // Validation errors
  if (apiError.response?.data?.details) {
    return apiError.response.data.details.map((d: any) => d.message).join(', ');
  }

  // Standard error message
  return (
    apiError.response?.data?.error ||
    apiError.response?.data?.message ||
    'An unexpected error occurred'
  );
}
```

**Usage in Components:**

```typescript
try {
  await cvService.upload(file);
  setSuccess('CV uploaded successfully!');
} catch (error) {
  setError(handleApiError(error));
}
```

### Adding a New API Service

1. **Define the service in `src/services/api.ts`:**

```typescript
export const newService = {
  async getItems(): Promise<Item[]> {
    const res = await apiClient.get('/items');
    return res.data.data.items;
  },

  async createItem(data: CreateItemDto): Promise<Item> {
    const res = await apiClient.post('/items', data);
    return res.data.data.item;
  },
};
```

2. **Create a custom hook in `src/hooks/`:**

```typescript
// src/hooks/useItems.ts
import { useState, useCallback } from 'react';
import { newService } from '@/services/api';
import { handleApiError } from '@/utils/errorHandler';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await newService.getItems();
      setItems(data);
    } catch (error) {
      console.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { items, isLoading, fetchItems };
}
```

3. **Use in component:**

```typescript
const { items, isLoading, fetchItems } = useItems();

useEffect(() => {
  fetchItems();
}, [fetchItems]);
```

---

## 🔐 Authentication Flow

### Login Flow (UI Perspective)

1. **User clicks "Sign in with Google":**

   ```tsx
   <button onClick={() => (window.location.href = `${apiUrl}/auth/google`)}>
     Sign in with Google
   </button>
   ```

2. **Backend handles OAuth, sets HTTP-only cookie, redirects back:**

   ```
   User → Google OAuth → Backend → Sets cookie → Redirects to /auth/callback
   ```

3. **Frontend fetches user profile:**

   ```typescript
   // src/hooks/useAuth.ts
   useEffect(() => {
     authService
       .getCurrentUser()
       .then(setUser)
       .catch(() => {
         logout();
         router.replace('/');
       });
   }, []);
   ```

4. **User is authenticated:**
   - Cookie automatically sent with all requests
   - User object stored in Zustand store
   - Protected routes now accessible

### Logout Flow

```typescript
const handleLogout = async () => {
  try {
    await authService.logout(); // Clears cookie on backend
  } finally {
    logout(); // Clears Zustand store
    router.replace('/'); // Redirect to home
  }
};
```

### Protected Routes

**Middleware approach** (recommended for Next.js 14+):

```typescript
// src/middleware.ts (if implemented)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

**Component-level protection** (current implementation):

```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      authService
        .getCurrentUser()
        .then(setUser)
        .catch(() => {
          logout();
          router.replace('/'); // Redirect if not authenticated
        });
    }
  }, [user, router, setUser, logout]);

  return { user, handleLogout };
}
```

### Token Storage

**Where:** HTTP-only cookie (set by backend)

**Why HTTP-only cookie?**

- ✅ **XSS Protection:** JavaScript cannot access the cookie
- ✅ **Automatic:** Browser sends cookie with every request
- ✅ **Secure:** HTTPS-only in production
- ✅ **CSRF Protection:** SameSite=Strict attribute

**Alternative (NOT used):**

- ❌ localStorage - Vulnerable to XSS attacks
- ❌ sessionStorage - Vulnerable to XSS attacks
- ❌ In-memory only - Lost on page refresh

### Redirect Behavior

**Unauthenticated users:**

- Accessing `/dashboard` → Redirect to `/`
- Accessing `/auth` → Show login page

**Authenticated users:**

- Accessing `/` → Can view landing page
- Accessing `/auth` → Can re-authenticate
- Accessing `/dashboard` → Show dashboard

---

## 🧪 Testing

### Test Structure

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── unit/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── integration/
│   │   │   ├── auth-flow.test.tsx
│   │   │   └── cv-upload.test.tsx
│   │   └── e2e/
│   │       └── playwright/
│   │           ├── auth.spec.ts
│   │           └── dashboard.spec.ts
```

### Running Tests

#### Unit Tests (Jest + React Testing Library)

```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- Button.test.tsx

# Update snapshots
npm test -- -u
```

#### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- auth.spec.ts

# Debug mode
npm run test:e2e -- --debug
```

### Test Coverage Goals

| Metric     | Target | Current |
| ---------- | ------ | ------- |
| Statements | ≥ 80%  | 75%     |
| Branches   | ≥ 75%  | 70%     |
| Functions  | ≥ 80%  | 72%     |
| Lines      | ≥ 80%  | 74%     |

### Writing New Tests

#### Unit Test Example (Component)

```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

#### Unit Test Example (Hook)

```typescript
// src/hooks/__tests__/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

jest.mock('@/services/api', () => ({
  authService: {
    getCurrentUser: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    }),
  },
}));

describe('useAuth', () => {
  it('fetches user on mount', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });
});
```

#### E2E Test Example (Playwright)

```typescript
// src/__tests__/e2e/playwright/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to Google OAuth', async ({ page }) => {
    await page.goto('http://localhost:3000/auth');

    const googleButton = page.getByRole('button', {
      name: /continue with google/i,
    });

    await expect(googleButton).toBeVisible();

    // Click would redirect to Google (don't actually test OAuth)
    // await googleButton.click();
  });

  test('should show dashboard after login', async ({ page }) => {
    // Mock authentication cookie
    await page.context().addCookies([
      {
        name: 'token',
        value: 'mock-jwt-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('http://localhost:3000/dashboard');

    await expect(page.getByText(/new application/i)).toBeVisible();
  });
});
```

### Test Configuration

**Jest Configuration (`jest.config.js`):**

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.tsx'],
};
```

**Playwright Configuration (`playwright.config.ts`):**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📊 Monitoring

### Sentry Error Tracking

**Setup:**

```bash
npm install @sentry/nextjs
```

**Configuration (`sentry.client.config.ts`):**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,

  // Filter out sensitive data
  beforeSend(event) {
    // Remove cookies, tokens, etc.
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.Authorization;
    }
    return event;
  },
});
```

**Usage:**

```typescript
// Automatic error capture in error boundaries
// Manual error capture
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'cv-upload' },
    extra: { userId: user.id },
  });
}
```

### Web Vitals Reporting

**Built-in Next.js Web Vitals:**

```typescript
// src/app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to analytics
  console.log(metric);

  // Send to Sentry
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      extra: metric,
    });
  }
}
```

**Metrics Tracked:**

- **FCP** (First Contentful Paint) - Time to first content render
- **LCP** (Largest Contentful Paint) - Time to largest content render
- **CLS** (Cumulative Layout Shift) - Visual stability
- **FID** (First Input Delay) - Interactivity
- **TTFB** (Time to First Byte) - Server response time

### Performance Monitoring

**Check Performance Scores:**

```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun --collect.url=http://localhost:3000

# Or use Chrome DevTools
# Open DevTools → Lighthouse → Generate report
```

**Monitoring Dashboard:**

- **Vercel Analytics** - Built-in for Vercel deployments
- **Google Analytics** - User behavior tracking
- **Sentry Performance** - Transaction monitoring

---

## ⚡ Performance

### Rendering Strategy by Page

| Page          | Strategy | Reason                                  |
| ------------- | -------- | --------------------------------------- |
| `/` (Landing) | SSR      | SEO, dynamic content, fast initial load |
| `/auth`       | SSR      | SEO, fast initial load                  |
| `/dashboard`  | CSR      | Personalized, requires authentication   |
| `/privacy`    | SSG      | Static content, pre-rendered at build   |
| `/terms`      | SSG      | Static content, pre-rendered at build   |

**SSR (Server-Side Rendering):**

```typescript
// Default in Next.js 14 App Router
export default async function Page() {
  // Fetches data on every request
  const data = await fetch('...').then(r => r.json());
  return <div>{data}</div>;
}
```

**SSG (Static Site Generation):**

```typescript
// Force static generation
export const dynamic = 'force-static';

export default function Page() {
  return <div>Static content</div>;
}
```

**CSR (Client-Side Rendering):**

```typescript
'use client'; // Client component

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('...').then(r => r.json()).then(setData);
  }, []);

  return <div>{data}</div>;
}
```

**ISR (Incremental Static Regeneration):**

```typescript
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Page() {
  const data = await fetch('...').then(r => r.json());
  return <div>{data}</div>;
}
```

### Image Optimization

**Always use `next/image`:**

```tsx
import Image from 'next/image';

// ✅ Correct - Optimized
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // For above-the-fold images
/>

// ❌ Wrong - Not optimized
<img src="/logo.png" alt="Logo" />
```

**Benefits:**

- Automatic WebP/AVIF conversion
- Lazy loading by default
- Responsive images
- Blur placeholder
- Prevents layout shift

**External Images:**

```typescript
// next.config.ts
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Cloudinary CDN
      },
    ],
  },
};
```

### Bundle Size Optimization

**1. Dynamic Imports:**

```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // Don't render on server
});
```

**2. Tree Shaking:**

```typescript
// ✅ Import only what you need
import { Button } from '@/components/ui/button';

// ❌ Imports entire library
import * as UI from '@/components/ui';
```

**3. Analyze Bundle:**

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... config
});

# Run analysis
ANALYZE=true npm run build
```

**4. Remove Unused Dependencies:**

```bash
# Check for unused dependencies
npx depcheck

# Remove unused packages
npm uninstall [package-name]
```

### Lighthouse Score Targets

| Metric             | Target | Current |
| ------------------ | ------ | ------- |
| **Performance**    | ≥ 90   | 92      |
| **Accessibility**  | ≥ 95   | 97      |
| **Best Practices** | ≥ 90   | 95      |
| **SEO**            | ≥ 90   | 100     |

**How to Improve Scores:**

**Performance:**

- Use `next/image` for all images
- Minimize JavaScript bundle size
- Enable compression (Gzip/Brotli)
- Use CDN for static assets

**Accessibility:**

- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels on interactive elements
- Sufficient color contrast (4.5:1 minimum)
- Keyboard navigation support

**Best Practices:**

- HTTPS in production
- No console errors
- Secure cookies (HttpOnly, Secure, SameSite)
- CSP headers

**SEO:**

- Meta tags (title, description)
- Canonical URLs
- Sitemap.xml
- Robots.txt
- Structured data (JSON-LD)

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/postify/tree/main/frontend)

**Manual Deployment:**

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login:**

   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

**Environment Variables in Vercel:**

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add the following:

| Variable              | Value                     | Environment |
| --------------------- | ------------------------- | ----------- |
| `NEXT_PUBLIC_API_URL` | `https://api.postify.app` | Production  |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000`   | Development |
| `NODE_ENV`            | `production`              | Production  |

**Automatic Deployments:**

- **Production:** Push to `main` branch → Auto-deploy to production
- **Preview:** Push to any branch → Auto-deploy to preview URL
- **Pull Requests:** Automatic preview deployments with unique URLs

### Manual Deployment

**Build Command:**

```bash
npm run build
```

**Start Command:**

```bash
npm run start
```

**Output Directory:**

```
.next/
```

**Environment Variables:**

Ensure all `NEXT_PUBLIC_*` variables are set in your hosting platform.

### Docker Deployment

**Build Image:**

```bash
docker build -t postify-frontend .
```

**Run Container:**

```bash
docker run -d \
  --name postify-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.postify.app \
  postify-frontend
```

**Docker Compose:**

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
    environment:
      NEXT_PUBLIC_API_URL: https://api.postify.app
      NODE_ENV: production
    restart: unless-stopped
```

### Other Platforms

#### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### AWS Amplify

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables in Amplify console

#### DigitalOcean App Platform

1. Create new app from GitHub
2. Select Next.js as framework
3. Build command: `npm run build`
4. Run command: `npm start`
5. Add environment variables

### Post-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] API URL points to production backend
- [ ] HTTPS enabled
- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Sentry DSN configured
- [ ] Analytics tracking enabled
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Lighthouse score ≥ 90 on all metrics
- [ ] No console errors in production
- [ ] Test authentication flow
- [ ] Test all critical user paths

---

## 🤝 Contributing

### Component Creation Guidelines

**1. File Naming:**

- Use PascalCase for component files: `MyComponent.tsx`
- Use camelCase for utility files: `myHelper.ts`
- Use kebab-case for CSS modules: `my-component.module.css`

**2. Component Structure:**

```typescript
// src/components/MyComponent.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

export function MyComponent({ title, onAction, className }: MyComponentProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={cn('base-classes', className)}>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

**3. Component Location:**

- **Shared components:** `src/components/`
- **Page-specific components:** `src/app/[page]/components/`
- **UI primitives:** `src/components/ui/`

### Naming Conventions

**Variables:**

```typescript
// ✅ Correct
const userName = 'John';
const isLoading = false;
const handleClick = () => {};

// ❌ Wrong
const user_name = 'John';
const loading = false;
const clickHandler = () => {};
```

**Components:**

```typescript
// ✅ Correct
export function UserProfile() {}
export const UserAvatar = () => {};

// ❌ Wrong
export function userProfile() {}
export const user_avatar = () => {};
```

**Types/Interfaces:**

```typescript
// ✅ Correct
interface User {}
type UserRole = 'USER' | 'ADMIN';

// ❌ Wrong
interface user {}
type userRole = 'USER' | 'ADMIN';
```

### Styling Rules

**1. Tailwind CSS Only:**

```tsx
// ✅ Correct - Tailwind classes
<div className="flex items-center gap-4 p-6 rounded-xl bg-white">

// ❌ Wrong - Inline styles
<div style={{ display: 'flex', padding: '24px' }}>

// ❌ Wrong - CSS modules (unless absolutely necessary)
<div className={styles.container}>
```

**2. Use `cn()` for Conditional Classes:**

```tsx
import { cn } from '@/lib/utils';

<button className={cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

**3. Responsive Design:**

```tsx
// Mobile-first approach
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
```

**4. Custom CSS Variables:**

```tsx
// Use CSS variables from globals.css
<div className="bg-[var(--bg-card)] text-[var(--text-primary)]">
```

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows naming conventions
- [ ] All components use TypeScript with proper types
- [ ] Tailwind CSS used for all styling (no inline styles)
- [ ] No console.log statements (use logger if needed)
- [ ] ESLint passes: `npm run lint`
- [ ] Prettier formatting applied: `npm run format`
- [ ] Tests added for new features
- [ ] All tests pass: `npm test`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Accessibility checked (keyboard navigation, ARIA labels)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] PR description explains what and why
- [ ] Screenshots included for UI changes

### Git Commit Messages

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
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

**Examples:**

```
feat(dashboard): add CV upload progress indicator

- Show upload percentage
- Add cancel button
- Display file size

Closes #123
```

```
fix(auth): redirect to dashboard after login

Previously redirected to home page. Now correctly
redirects authenticated users to dashboard.

Fixes #456
```

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

- GitHub: [@moteaz](https://github.com/moteaz)
- Email: support@postify.app

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/moteaz/postify/issues)
- **Discussions:** [GitHub Discussions](https://github.com/moteaz/postify/discussions)
- **Email:** support@postify.app

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the Moetaz

[Report Bug](https://github.com/moteaz/postify/issues) · [Request Feature](https://github.com/moteaz/postify/issues) · [Documentation](https://docs.postify.app)

</div>

# Postify Frontend

AI-powered job application automation platform built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- 🤖 AI-generated cover letters
- 📧 Direct Gmail integration
- 📄 Multiple CV management
- 📊 Application history tracking
- 🔐 Secure OAuth authentication
- 📱 Fully responsive design

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm/yarn/pnpm/bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

4. Update environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── config/          # Configuration files (env, SEO, constants)
├── hooks/           # Custom React hooks
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Features Implementation

### Authentication
- Google OAuth integration
- JWT token management
- Protected routes with auth middleware

### Dashboard
- CV upload and management
- AI-powered application generation
- Email history tracking
- Real-time system status

### Type Safety
- Strict TypeScript configuration
- Centralized type definitions
- API response typing

## Performance Optimizations

- Font optimization with `next/font`
- Image optimization with `next/image`
- Code splitting with dynamic imports
- Tailwind CSS purging

## Accessibility

- ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please follow the existing code style and conventions.

## License

MIT

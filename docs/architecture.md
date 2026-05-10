# Architecture Decision Record (ADR)

## Project Overview
Neurolinkx is a professional-grade shipment tracking dashboard built to demonstrate modern frontend engineering practices, accessibility, and scalability.

## Tech Stack Decisions

### 1. Next.js 15 & React 19
- **Decision**: Used Next.js App Router for server-side rendering (SSR) and optimized routing.
- **Rationale**: Next.js 15 provides the latest performance optimizations, including improved hydration and faster build times. React 19's new hooks (like `use`) allow for cleaner data handling in client components.

### 2. UI Component Library (Radix UI + Tailwind CSS 4)
- **Decision**: Built a custom design system on top of Radix UI primitives.
- **Rationale**: Radix UI handles the complex accessibility requirements (WAI-ARIA compliance, focus trapping) out of the box. Tailwind CSS 4's new CSS-first engine was used for high-performance styling and design token management via CSS variables.
- **Aesthetic**: Inspired by Stripe and Linear, focusing on high contrast, subtle micro-animations (Framer Motion), and a consistent layout.

### 3. State Management (Zustand)
- **Decision**: Used Zustand for global UI and Auth state.
- **Rationale**: Zustand provides a lightweight, performant alternative to Redux with a minimal footprint, ideal for dashboard state like authentication and global notifications.

### 4. Data Fetching (TanStack Query)
- **Decision**: Integrated TanStack Query (React Query) for server-state management.
- **Rationale**: It handles caching, revalidation, and loading states automatically, reducing boilerplate code and improving UX.

## Folder Structure
```text
src/
  app/          # Next.js App Router pages and layouts
  components/   # React components
    ui/         # Reusable design system components
    ...         # Feature-specific components
  hooks/        # Custom React hooks (useToast, useAuth, etc.)
  lib/          # Utilities, API clients, and shared logic
  services/     # Mock data services and API wrappers
  types/        # TypeScript definitions
  test/         # Global test setup and mocks
```

## Scaling Strategy
- **Component Portability**: UI components are isolated and can be moved to a private NPM package easily.
- **Performance**: Dynamic imports are used for heavy components (like charts) to reduce initial bundle size.
- **Security**: Mock JWT auth demonstrates the pattern for securing routes via Next.js Middleware or Layout checks.

## Tradeoffs & Decisions
- **Mock Data vs API**: For this demonstration, a mock data service was used to ensure stability and focus on UI/UX and architecture. In a real production app, this would be replaced by an OpenAPI/GraphQL client.
- **Testing Coverage**: Focused on "Critical Path" testing (Auth flow, core UI components) to demonstrate engineering maturity within the task constraints.

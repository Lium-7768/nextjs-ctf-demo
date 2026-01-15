# AGENTS.md

This document provides guidelines for AI agents working in this Next.js codebase.

## Commands

### Development
- `npm run dev` - Start dev server with Turbopack (http://localhost:3000)
- `npm run build` - Build production application
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

### Testing
No test framework is currently configured. When adding tests, use Vitest or Jest and update this file with test commands.

**Running a single test** (when configured):
- Vitest: `npm test -- <file-path>` or `npm test -- -t "<test-name>"`
- Jest: `npm test -- <file-path>` or `npm test -- -t "<test-name>"`

## Code Style Guidelines

### Imports
- Use absolute imports with `@/*` alias: `import { Button } from "@/components/button"`
- Use `type` imports for type-only imports: `import type { Metadata } from "next"`
- Group imports: external libraries first, then internal imports

### TypeScript
- TypeScript strict mode is enabled
- Explicitly type function parameters and return types
- Use `interface` for object shapes, `type` for unions and utility types
- Type assertions should be avoided; use proper type guards instead
- Use `Readonly` for props that won't change: `Readonly<{ children: React.ReactNode }>`

### Component Structure
- Mark client components with `"use client"` directive at file top
- Server components are default in App Router (no directive needed)
- Use PascalCase for components, camelCase for functions/variables
- Export components as default, utilities as named exports

### React & Data Fetching
- Use TanStack Query for data fetching with `queryKey` and `queryFn` pattern
- Configure QueryClient in providers with sensible defaults (staleTime, refetchOnWindowFocus)
- Handle loading states: `if (isLoading) return <div>Loading...</div>`
- Handle errors with type assertions: `if (error) return <div>Error: {(error as Error).message}</div>`

### Styling
- Use Tailwind CSS v4 utility classes
- Import Tailwind with `@import "tailwindcss"` in globals.css
- Use `cn()` utility (from lib/utils.ts) to merge class names: `cn("base-class", conditionalClass)`
- Support dark mode using `dark:` prefix and CSS custom properties
- Use design tokens via CSS custom properties in globals.css

### Formatting
- Prettier is configured with double quotes, semicolons, 2-space indentation
- Print width: 80 characters
- Trailing commas in ES5 compatible format

### Error Handling
- Always include error handling in async functions
- Return or display user-friendly error messages
- Use try-catch for critical operations
- Type errors properly with `Error` type

### File Organization
- `app/` - App Router pages and layouts
- `components/` - Reusable components (create if needed)
- `lib/` - Utility functions and service clients
- `providers/` - React context providers (QueryClient, etc.)
- Use clear, descriptive filenames matching component/function names

### Environment & Secrets
- Never commit secrets to repository
- Use `process.env.VARIABLE_NAME` for environment variables
- Define type-safe environment interfaces for required env vars

### ESLint Rules
- ESLint 9 uses flat config format in eslint.config.mjs
- Extends next/core-web-vitals and next/typescript
- Run lint before committing changes

### Git Conventions
- Write clear, concise commit messages describing the "why" not "what"
- Commit frequently with logical groupings of changes
- Use conventional commits when possible: `feat:`, `fix:`, `docs:`, `refactor:`
- Reference relevant issue numbers in commit messages

### Performance
- Use Next.js Image component for optimized images
- Implement code splitting with dynamic imports for large components
- Cache API responses using React Query's staleTime
- Use server components by default, client components only when needed
- Optimize bundle size by avoiding unnecessary dependencies

### Accessibility
- Use semantic HTML elements (header, nav, main, article, footer)
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Add alt text to images describing content context
- Use ARIA labels only when native HTML is insufficient
- Ensure keyboard navigation works for interactive elements
- Test color contrast ratios meet WCAG AA standards (4.5:1 for text)

### API Integration Patterns
- Contentful: Use lib/contentful.ts helper functions (getEntries, getEntry)
- Define types for Contentful entry fields when using typed responses
- Store API base URLs in environment variables
- Use fetch or appropriate SDK for external APIs
- Handle pagination for list endpoints when necessary

### Code Comments
- Add comments only when explaining complex logic or non-obvious behavior
- Prefer self-documenting code with descriptive function and variable names
- Remove commented-out code (git history preserves it)
- Use JSDoc comments only for public APIs requiring documentation

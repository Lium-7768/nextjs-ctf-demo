# AGENTS.md

This document provides guidelines for AI agents working in this Next.js codebase.

## Commands

### Development
- `npm run dev` - Start dev server with Turbopack (http://localhost:3000)
- `npm run build` - Build production application (uses Turbopack)
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
- Use absolute imports with `@/*` alias: `import { Header } from "@/components/Layout/Header"`
- Use `type` imports for type-only imports: `import type { Metadata } from "next"`
- Workspace packages: `import { getPageBySlug } from "@nextjs-ctf-demo/contentful-bff"`
- Group imports: external libraries first, then internal modules

### TypeScript
- Strict mode enabled - always type function parameters and return types explicitly
- Use `interface` for object shapes, `type` for unions and utility types
- Use `Readonly` for props that won't change: `Readonly<{ children: React.ReactNode }>`
- Avoid type assertions when possible; use type guards instead
- For Contentful types, import from BFF package: `import type { Page, Section } from '@nextjs-ctf-demo/contentful-bff'`

### Component Structure
- Client components: add `"use client"` directive at file top
- Server components are default in App Router (no directive needed)
- Use PascalCase for components, camelCase for functions/variables
- Export components as default, utilities/services as named exports
- Use descriptive filenames matching component names

### React & Data Fetching
- TanStack Query configured with `staleTime: 60 * 1000` and `refetchOnWindowFocus: false`
- Handle loading states: `if (isLoading) return <div>Loading...</div>`
- Handle errors with type assertions: `if (error) return <div>Error: {(error as Error).message}</div>`
- For Contentful: use BFF services: `getPageBySlug(slug, locale)`, `getAllPages(locale)`, `getNavigationItems()`

### Styling
- Tailwind CSS v4 with `@import "tailwindcss"` in globals.css
- Use `cn()` utility (lib/utils.ts) to merge class names: `cn("base-class", conditionalClass)`
- Dark mode support via `dark:` prefix and CSS custom properties
- Design tokens via CSS custom properties: `var(--background)`, `var(--foreground)`
- Mobile-first responsive design: `md:text-2xl`, `lg:hidden`, etc.

### Formatting
- Prettier: double quotes, semicolons, 2-space indentation, 80-char print width
- Trailing commas in ES5 compatible format
- Use Prettier to format code before committing

### Error Handling
- Use try-catch for async operations in services
- Log errors with console.error and return null/empty arrays: `catch (error) { console.error('Error:', error); return null }`
- Type errors properly with `Error` type when handling
- Display user-friendly error messages in UI components

### Internationalization
- App Router uses `[lang]` dynamic segment for locale routing
- Supported locales: `'zh'` (default), `'en'`
- Helper functions in lib/i18n.ts: `getLocaleFromPath()`, `getLocalizedPath()`, `getServerLocale()`
- Always pass `locale` parameter to Contentful API calls

### File Organization
```
app/                      # App Router (Next.js 16)
├── [lang]/              # Locale-scoped routes
│   ├── layout.tsx       # Locale layout
│   ├── page.tsx         # Home page
│   └── [...slug]/       # Dynamic content pages
├── components/          # Reusable components
│   ├── Layout/          # Header, Footer, LanguageSwitcher
│   ├── Sections/        # Hero, Content, Features, CTA, Testimonials
│   └── Templates/       # PageTemplate, HomeTemplate
├── lib/                 # Utilities (utils.ts, i18n.ts)
├── providers/           # React context providers (TanStack Query)
└── globals.css          # Global styles and Tailwind imports

packages/@nextjs-ctf-demo/  # Workspace monorepo packages
├── contentful-bff/      # Contentful BFF with typed services
└── contentful-setup/    # Contentful setup and seeding scripts
```

### Accessibility
- Use semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>`
- Add ARIA labels when native HTML insufficient: `aria-label="Switch to English"`
- Ensure keyboard navigation: add `focus-visible:outline-2` styles
- Use proper heading hierarchy (h1 → h2 → h3)
- Add alt text describing content context
- Test with reduced motion: `@media (prefers-reduced-motion: reduce)` already configured

### Performance
- Use Next.js Image component for optimized images
- Implement code splitting with dynamic imports for large components
- Cache API responses via TanStack Query's staleTime
- Use server components by default, client components only when needed
- Optimize bundle size by avoiding unnecessary dependencies

### Environment & Secrets
- Never commit secrets to repository
- Use `process.env.VARIABLE_NAME` for environment variables
- Define type-safe environment interfaces for required env vars

### ESLint
- ESLint 9 flat config in eslint.config.mjs
- Extends `eslint-config-next/core-web-vitals` and `typescript` presets
- Run lint before committing changes
- Note: Next.js 16+ no longer runs linter automatically during build

### Git Conventions
- Write clear commit messages describing the "why" not "what"
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Reference relevant issue numbers in commit messages
- Commit frequently with logical groupings of changes

### Code Comments
- Prefer self-documenting code with descriptive names
- Add comments only for complex/non-obvious logic
- Remove commented-out code (git history preserves it)
- Mix of English and Chinese comments is acceptable
- Use JSDoc only for public APIs requiring documentation

### Workspace Packages
- This is a monorepo using npm workspaces
- `@nextjs-ctf-demo/contentful-bff`: Services for fetching Contentful data
- `@nextjs-ctf-demo/contentful-setup`: Scripts for Contentful setup and seeding
- Import workspace packages directly: `import { getPageBySlug } from '@nextjs-ctf-demo/contentful-bff'`

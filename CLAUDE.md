# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## System Requirements

- **Node.js**: Minimum version 20.9+
- **Operating Systems**: macOS, Windows (including WSL), and Linux
- **Supported Browsers**: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

## Common Commands

- `npm run dev` - Start the development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build the production application (uses Turbopack by default)
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

**Note**: Starting with Next.js 16, `next build` no longer runs the linter automatically. Run linting through NPM scripts.

## Architecture

This is a Next.js 16 application using the App Router architecture with the following stack:

- **Framework**: Next.js 16.1.1 with React 19.2.3
- **Bundler**: Turbopack (default) - Next.js's new Rust-based bundler for faster builds
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/postcss` plugin)
- **Language**: TypeScript v5+ with strict mode enabled
- **Linting**: ESLint 9 with `eslint.config.mjs` (new flat config format)
- **Code Formatting**: Prettier configuration in `.prettierrc`

### Project Structure

```
app/                        # App Router directory
├── layout.tsx             # Root layout with font configuration (Geist Sans/Mono)
├── page.tsx               # Home page component
└── globals.css            # Global styles and Tailwind imports

public/                     # Static assets (images, fonts, etc.)
├── next.svg
├── vercel.svg
└── ...

.eslint.config.mjs         # ESLint flat config (new format)
.next.config.ts            # Next.js configuration
.gitignore                 # Git ignore rules
.prettierrc                # Prettier formatting configuration
package.json               # Project dependencies and scripts
postcss.config.mjs         # PostCSS configuration for Tailwind CSS v4
tsconfig.json              # TypeScript configuration
next-env.d.ts              # Auto-generated TypeScript declarations (do not edit)
```

### App Router vs Pages Router

This project uses **App Router** (the `app/` directory), not the Pages Router (`pages/` directory). App Router:
- Uses React Server Components by default
- Supports layouts, loading states, and error boundaries
- Has built-in data fetching and caching
- Uses file-based routing with `page.tsx` files

### Path Aliases (Absolute Imports)

The project uses the `@/*` path alias configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This allows cleaner imports:
```typescript
// Before
import { Button } from '../../../components/button'

// After
import { Button } from '@/components/button'
```

### Configuration Files

- `next.config.ts` - Next.js configuration (currently minimal/default)
- `tsconfig.json` - TypeScript configuration with strict mode and path aliases
- `eslint.config.mjs` - ESLint flat config extending `eslint-config-next` (core-web-vitals and typescript presets)
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4
- `.prettierrc` - Prettier code formatting configuration

### Turbopack vs Webpack

Turbopack is now the default bundler in Next.js 16. It provides:
- Significantly faster builds and updates
- Better error messages
- Native support for React Server Components

To use Webpack instead (if needed):
- `npm run dev -- --webpack` - Use Webpack for dev server
- `npm run build -- --webpack` - Use Webpack for production build

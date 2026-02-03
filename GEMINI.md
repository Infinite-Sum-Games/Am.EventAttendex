# Gemini Development Instructions

## 📍 START HERE - Read AGENTS.md First

**Before generating any code, read the complete guidelines in: `AGENTS.md`**

## Project Overview

This is a **mobile-first** React + TypeScript application for phones. Mobile responsiveness is the #1 priority.

## Critical Rules (from AGENTS.md)

### 🚨 MOBILE-FIRST DESIGN (HIGHEST PRIORITY)

- This is a web app designed for PHONES - mobile overrides everything
- Design for mobile first, then scale up
- Touch targets minimum 44px
- Always test on mobile viewports

### Component Organization

- Page-specific components go in `src/components/[page-name]/` folders
- Example: `homepage-table` → `src/components/homepage/table.tsx`
- Use kebab-case for folders, PascalCase for files

### API & Data Patterns

- **ALL API calls**: Must use TanStack Query (useQuery/useMutation)
- Always use loading states: `isLoading`, `isFetching`, `isError`
- **All payloads**: Need Zod schemas in `src/schemas/`
- Always validate with `zod.safeParse()`
- **Endpoints**: Centralized in `src/lib/api-endpoints.ts`

### Form Handling

- Show validation errors directly below corresponding fields
- Use consistent error positioning with proper spacing

### Code Style

- Path aliases: `@/components/*`, `@/lib/*`
- Use `cn()` utility for conditional classes
- Consistent variable/file naming
- No semicolons, double quotes, 2-space indentation

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19 + TypeScript
- **Routing**: TanStack Router (file-based)
- **Data**: TanStack Query + Axios + Zod
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Linting**: oxlint + Prettier

## Commands

```bash
bun install          # Install dependencies
bun run dev         # Dev server (localhost:3000)
bun run lint:fix    # Fix linting issues
bun run format      # Format code
```

## Complete Guidelines

**Read `AGENTS.md` for the complete development standards, patterns, and architectural rules.**

When in doubt, prioritize mobile responsiveness and consult AGENTS.md.

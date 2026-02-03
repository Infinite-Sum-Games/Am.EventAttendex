# Project Development Guidelines

## Primary Directive

Read and follow ALL guidelines in AGENTS.md before making any code changes. This file contains the authoritative development standards for this project.

## Critical Project Rules (from AGENTS.md)

### 🚨 MOBILE-FIRST IS #1 PRIORITY

- This is a web app designed for PHONES
- Mobile responsiveness overrides ALL other considerations
- Design for mobile first, then scale up
- Touch targets minimum 44px
- Test on mobile viewports during development

### Component Architecture

- Page-specific components (e.g., homepage-table) go in `src/components/[page-name]/`
- Use kebab-case for folders, PascalCase for files
- Follow existing patterns in `src/components/ui/`

### Data & API Standards

- ALL API calls must use TanStack Query (useQuery/useMutation)
- Always show loading states (`isLoading`, `isFetching`, `isError`)
- All API payloads need Zod schemas in `src/schemas/`
- Use `zod.safeParse()` for validation
- Centralize endpoints in `src/lib/api-endpoints.ts`

### Form Handling

- Validation errors MUST appear directly below corresponding fields
- Use consistent error positioning
- Follow Zod validation patterns

### Code Style

- Path aliases: `@/components/*`, `@/lib/*`
- Use `cn()` utility for conditional classes
- Consistent variable and file naming
- No semicolons, double quotes, 2-space indentation

## Commands

- `bun install` - Install deps
- `bun run dev` - Dev server (localhost:3000)
- `bun run lint:fix` - Fix linting issues
- `bun run format` - Format code

## Quick Reference

- Tech: React 19 + TypeScript + Vite + Bun
- Routing: TanStack Router (file-based)
- Styling: Tailwind CSS v4 + shadcn/ui
- Data: TanStack Query + Axios + Zod

When in doubt, consult AGENTS.md for complete guidelines.

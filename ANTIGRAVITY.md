# Antigravity AI Development Instructions

## 📍 PRIMARY INSTRUCTION: Read AGENTS.md

**Complete development guidelines are in `AGENTS.md` - read it first!**

## Project Context

This is a **mobile-first** React TypeScript web application designed for phones.

## Critical Development Rules

### 🚨 MOBILE-FIRST (#1 Priority)

- Design for PHONES first, mobile responsiveness overrides everything
- Touch targets minimum 44px
- Single column layouts for mobile
- Test on mobile viewports during development

### Component Architecture

- Page components in `src/components/[page-name]/` subfolders
- Use kebab-case folders, PascalCase files
- Follow existing `src/components/ui/` patterns

### API Standards

- All API calls = TanStack Query (useQuery/useMutation)
- Always show loading states (`isLoading`, `isFetching`, `isError`)
- All API payloads need Zod schemas in `src/schemas/`
- Validate with `zod.safeParse()`
- Centralize endpoints in `src/lib/api-endpoints.ts`

### Forms

- Validation errors appear directly below fields
- Use Zod for validation
- Consistent error positioning

### Code Style

- Path aliases: `@/components/*`, `@/lib/*`
- Use `cn()` for conditional classes
- No semicolons, double quotes, 2-space tabs
- Consistent naming throughout

## Stack

- Bun + React 19 + TypeScript + Vite
- TanStack Router (file-based)
- TanStack Query + Axios + Zod
- Tailwind CSS v4 + shadcn/ui
- oxlint + Prettier

## Commands

```bash
bun install
bun run dev
bun run lint:fix
bun run format
```

## 🎯 Remember

**Mobile responsiveness is the highest priority.**
**Complete rules in AGENTS.md - reference it for everything.**

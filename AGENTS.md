# AGENTS.md - Development Guidelines for Am.EventAttendex

## 📋 Overview

This is a modern React + TypeScript application built with:

- **Runtime**: Bun
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: TanStack Query + Axios
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Linting**: oxlint + Prettier
- **Git Hooks**: Husky + lint-staged

---

## 🚀 Essential Commands

### Development

```bash
bun install                    # Install dependencies
bun run dev                   # Start dev server (localhost:3000)
bun run build                 # Build for production (includes type checking)
bun run preview               # Preview production build
```

### Code Quality

```bash
bun run lint                  # Run oxlint linter
bun run lint:fix              # Auto-fix lint issues
bun run format                # Format code with Prettier
bun run check                 # Check Prettier formatting
```

### Git Hooks

- Pre-commit: Runs `lint-staged` (prettier + oxlint --fix)
- All staged files are automatically formatted and linted

---

## 🎯 Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled**: All type checks enforced
- **No unused locals/parameters**: Code must be clean
- **ES2022 target**: Modern JavaScript features available
- **JSX transform**: React 19+ JSX transform enabled

### Import Style

```tsx
// ✅ Correct order and style
import React from "react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/axios"

// ✅ Use path aliases
import Component from "@/components/Component"
import utils from "@/lib/utils"
```

### Component Patterns

```tsx
// ✅ Function component with TypeScript
interface ComponentProps {
  title: string
  variant?: "default" | "secondary"
  children?: React.ReactNode
}

function Component({ title, variant = "default", children }: ComponentProps) {
  return (
    <div
      className={cn(
        "base-styles",
        variant === "secondary" && "secondary-styles"
      )}
    >
      <h1>{title}</h1>
      {children}
    </div>
  )
}

export { Component }
```

### Styling Conventions

```tsx
// ✅ Use cn() utility for conditional classes
import { cn } from "@/lib/utils"

function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        "base-button-styles",
        variant === "primary" && "bg-blue-500",
        variant === "secondary" && "bg-gray-500",
        className
      )}
      {...props}
    />
  )
}
```

---

## 🛠 Project Structure & Conventions

### File-Based Routing

- Routes in `src/routes/` automatically generate routes
- Root layout: `src/routes/__root.tsx`
- Use `<Outlet />` for nested route content
- Use `<Link />` from `@tanstack/react-router` for navigation

```tsx
import { Link } from "@tanstack/react-router"

// ✅ Navigation
<Link to="/about">About</Link>
<Link to="/posts/$postId" params={{ postId: "123" }}>Post 123</Link>
```

### Data Fetching Patterns

```tsx
// ✅ TanStack Query for API calls
import { useQuery } from "@tanstack/react-query"

function PostsList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts").then((res) => res.data),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{/* render posts */}</div>
}
```

### UI Components (shadcn/ui)

```bash
# Install new components
bunx shadcn@latest add <component-name>
```

- Components use `class-variance-authority` for variants
- All components forward refs properly
- Use Radix UI primitives when needed
- Follow existing component patterns in `src/components/ui/`

---

## ⚙️ Configuration Details

### Prettier Rules

- **No semicolons**
- **Double quotes** (not single)
- **2 spaces** for indentation
- **Trailing commas**: ES5 compatible
- **Print width**: 80 characters

### Linting (oxlint)

- Minimal configuration - relies on TypeScript strict mode
- Auto-fixes most issues on commit
- Run `bun run lint:fix` manually for batch fixes

### Path Aliases

```json
{
  "@/*": "./src/*",
  "@/components/*": "./src/components/*",
  "@/lib/*": "./src/lib/*"
}
```

---

## 🔧 Development Workflow

### Adding New Features

1. Create components in appropriate directories
2. Add routes in `src/routes/` for new pages
3. Use TanStack Query for data fetching
4. Follow existing TypeScript patterns
5. Run `bun run lint:fix` before committing

### Working with Styles

- Use Tailwind classes directly in components
- For complex logic, use the `cn()` utility
- Avoid inline styles except for dynamic values
- Follow shadcn/ui patterns for component variants

---

## 🚨 Important Notes

### Build Configuration

- **Base path**: `/app/` (configured in vite.config.ts)
- **Type checking**: Built into build command (fails on type errors)
- **Generated files**: `src/routeTree.gen.ts` (auto-generated, don't edit)

### Environment

- Use `.env.example` as template
- Never commit `.env` file
- Environment variables are available via `import.meta.env`

### DevTools

- TanStack Router DevTools enabled in development
- TanStack Query DevTools integrated
- React DevTools available via browser extension

---

## 🔍 Common Patterns

### Error Handling

```tsx
// ✅ Use error boundaries and proper error states
function Component() {
  const { data, error } = useQuery({...})

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <div>{/* content */}</div>
}
```

### Loading States

```tsx
// ✅ Show loading states during data fetch
function Component() {
  const { data, isLoading } = useQuery({...})

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <div>{/* content */}</div>
}
```

### Form Handling

- Use React's built-in form handling
- Validate with Zod schemas when needed
- Connect to TanStack Query for mutations

---

## 📝 File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Routes: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- Hooks: `useCamelCase.ts` (e.g., `useAuth.ts`)
- Types: `camelCase.types.ts` (e.g., `user.types.ts`)

---

## 🏗 Architecture Rules & Patterns

### Component Organization

- **Page-specific components**: When building homepage or any page with subcomponents (e.g., `homepage-table`, `homepage-card`), organize them in `src/components/[page-name]/` subfolder
- **Consistent naming**: Use kebab-case for component folders, PascalCase for component files
- **Variable casing**: Maintain consistent casing across variables and file names

### Data Validation & API Patterns

```tsx
// ✅ Always use zod schemas for mutations and payloads
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// ✅ Always use zod.safeParse for validation
const result = loginSchema.safeParse(data)
if (!result.success) {
  // Handle validation errors
}
```

### API Endpoints Management

- **Centralized endpoints**: All API endpoints must be defined in `src/lib/api-endpoints.ts`
- **Usage pattern**: `axiosInstance.get(apiEndpoints.LOGIN)` instead of hardcoded URLs
- **Consistent naming**: Use UPPER_CASE constants for endpoint names

```tsx
// api-endpoints.ts example
export const apiEndpoints = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  USERS: "/users",
} as const
```

### TanStack Query Usage

- **All API calls**: Must use TanStack Query (useQuery for GET, useMutation for POST/PUT/DELETE)
- **Loading states**: Always utilize `isLoading`, `isFetching`, `isError` states
- **UI feedback**: Show appropriate loading indicators, error states, and success messages

```tsx
// ✅ Proper Query usage
const { data, isLoading, isFetching, isError, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get(apiEndpoints.USERS)
})

// ✅ Proper Mutation usage
const mutation = useMutation({
  mutationFn: (data) => api.post(apiEndpoints.LOGIN, data),
  onSuccess: () => // handle success
})
```

### Form Error Handling

- **Field-level errors**: Display validation errors directly below the corresponding form field
- **Consistent positioning**: Use fixed positioning or proper spacing to ensure errors are clearly visible

```tsx
// ✅ Error placement pattern
<div className="space-y-4">
  <div>
    <Input name="email" />
    {errors.email && (
      <p className="text-sm text-destructive mt-1">{errors.email}</p>
    )}
  </div>
</div>
```

### 📱 Mobile-First Design (CRITICAL)

**This is the most important rule - this app is designed for mobile phones.**

- **Mobile responsiveness takes priority above all else**
- **100% mobile-first approach**: Design for mobile first, then scale up
- **Touch-friendly**: Ensure buttons, links, and interactive elements have adequate touch targets (minimum 44px)
- **Responsive testing**: Always test on mobile viewports during development
- **Performance**: Optimize for mobile data speeds and device constraints
- **Layouts**: Use mobile-appropriate layouts (single column, collapsible navigation, etc.)
- **Gestures**: Consider touch gestures and mobile interaction patterns

---

This guide should help any agentic coding agent work effectively with this codebase. When in doubt, follow existing patterns and maintain consistency with the established conventions.

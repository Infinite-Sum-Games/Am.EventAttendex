# GitHub Copilot Instructions

This project follows the development guidelines defined in AGENTS.md. Before generating any code, Copilot should:

## Project Context

- **Tech Stack**: React 19 + TypeScript + Vite + Bun
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: TanStack Query + Axios
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Linting**: oxlint + Prettier

## Critical Rules (from AGENTS.md)

1. **MOBILE-FIRST DESIGN**: This is a phone web app - mobile responsiveness above all else
2. **Component Organization**: Page-specific components go in `src/components/[page-name]/`
3. **Data Validation**: All API payloads need Zod schemas in `src/schemas/`
4. **Form Errors**: Show validation errors directly below corresponding fields
5. **API Calls**: Must use TanStack Query (useQuery/useMutation) with loading states
6. **API Endpoints**: All endpoints centralized in `src/lib/api-endpoints.ts`
7. **Validation**: Always use `zod.safeParse()` for data validation

## Code Style

- Use path aliases (`@/components/*`, `@/lib/*`)
- Follow existing component patterns
- Use `cn()` utility for conditional classes
- Maintain consistent variable/file naming
- No semicolons, double quotes, 2-space indentation

## Commands

- Install: `bun install`
- Dev: `bun run dev`
- Build: `bun run build`
- Lint: `bun run lint:fix`
- Format: `bun run format`

Always reference AGENTS.md for complete guidelines before generating code.

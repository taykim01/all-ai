---
applyTo: '**'
---
# Next.js Project Instructions

These guidelines define the default coding conventions for new projects based on the Sylva Board codebase.

## Framework & Language
- Use **Next.js 15** with the **App Router** and React Server Components by default.
- Write all code in **TypeScript** and keep `tsconfig.json` set to `strict` mode with the `@/*` path alias.
- Place all source files under `src/`.

## Project Structure
```
src/
├─ app/              # Routes, layouts and global styles
├─ components/       # Reusable UI elements
├─ core/             # Global types and Zustand stores
├─ features/         # Server actions and business logic
├─ hooks/            # Custom React hooks
├─ infrastructures/  # External service clients (e.g., Supabase)
└─ lib/              # Utility helpers
```

## Components & Styling
- Create server components by default. Add `'use client'` for interactive components.
- Organize UI parts in `src/components` using folders such as `ui`, `auth`, and `layout`.
- Wrap Radix UI primitives and style with **Tailwind CSS**. Reuse the `cn` utility for class merging.
- Use the `class-variance-authority` (`cva`) pattern for variant‑based components.

## State & Data
- Manage global state with **Zustand** stores located in `src/core/states`.
- Implement data operations as **server actions** in `src/features` with the `'use server'` directive.
- Access the database through **Supabase** clients placed in `src/infrastructures/supabase` and configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Use Zustand selectors to derive state and avoid unnecessary re-renders. If applicable, update the local state first for better UX.

## Server-First Approach
- Use Server Actions for data mutations and API calls, ensuring a server-first architecture.
- Implement proper loading and error handling in Server Components.

## Animation & Effects
- Use Tailwind CSS for animations and transitions.
- Implement animations using the `animate` utility classes.
- Respect user preferences for reduced motion by checking the `prefers-reduced-motion` media query.
- If applicable, use glass effects with Tailwind's `backdrop-blur` utility.

## Hooks
- Store custom hooks under `src/hooks` and prefix filenames with `use-` (e.g., `use-board-state.ts`).
- Hooks may wrap Zustand selectors or encapsulate feature logic.

## Linting & Quality
- Use the provided **ESLint** configuration extending `next/core-web-vitals` and `next/typescript`.
- Run `npm run lint` before committing and keep the repository free of lint errors.

## Naming & Conventions
- Use **kebab-case** for filenames and directories.
- Keep components small and composable. Export component functions directly rather than using default-exported objects.

Following these conventions ensures consistency and maintainability across new projects derived from this codebase.
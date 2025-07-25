---
applyTo: "**"
---

# All-AI Project Instructions

## Project Overview

All-AI is a progressive web application (PWA) that provides an intelligent AI routing system. The application analyzes user queries and automatically selects the most appropriate AI model (ChatGPT, Claude, Gemini, or Grok) to provide the best possible response.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase
- **Architecture**: Server Actions + React Hooks
- **AI APIs**: OpenAI (ChatGPT), Anthropic (Claude), Google (Gemini), X.AI (Grok)
- **PWA**: Next.js PWA capabilities

## Core Principles

1. **Type Safety**: Use TypeScript extensively with proper type definitions
2. **Server-First**: Leverage Server Actions for data mutations and API calls
3. **Component Composition**: Build reusable, composable React components
4. **Performance**: Optimize for Core Web Vitals and mobile experience
5. **Accessibility**: Follow WCAG 2.1 AA guidelines
6. **Security**: Implement proper authentication and API key management

## Code Style Guidelines

### General Rules

- Use ESLint and Prettier for consistent formatting
- Prefer named exports over default exports
- Use kebab-case for file and folder names
- Use PascalCase for React components
- Use camelCase for functions and variables
- Use SCREAMING_SNAKE_CASE for constants

### TypeScript

- Define strict types for all props and function parameters
- Use interfaces for object shapes, types for unions
- Leverage TypeScript's utility types (Pick, Omit, Partial, etc.)
- Avoid `any` type - use `unknown` when necessary

### React Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Use Suspense for loading states
- Memoize expensive computations with useMemo/useCallback
- Keep components small and focused (Single Responsibility Principle)

### Next.js App Router

- Use Server Components by default, Client Components when needed
- Implement proper loading and error pages
- Use route groups for organization
- Leverage parallel and intercepting routes when appropriate

### Database & API

- Use Supabase Row Level Security (RLS)
- Implement proper error handling for database operations
- Use Server Actions for all data mutations
- Cache API responses when appropriate

## Project Structure

The project follows a feature-based organization with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main application routes
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── chat/             # Chat-specific components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
│   ├── actions/          # Server Actions
│   ├── ai/               # AI service integrations
│   ├── config/           # Configuration files
│   ├── constants/        # Application constants
│   ├── services/         # External service integrations
│   ├── supabase/         # Supabase client and utilities
│   └── validations/      # Zod schemas and validation
├── store/                 # Global state management
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Development Workflow

1. **Feature Development**: Create feature branches from main
2. **Testing**: Write unit tests for utility functions and integration tests for APIs
3. **Code Review**: All changes require review before merging
4. **Deployment**: Use continuous deployment to staging and production environments

## Performance Guidelines

- Use dynamic imports for code splitting
- Implement proper image optimization with next/image
- Minimize client-side JavaScript bundle size
- Use React.memo() for expensive components
- Implement proper caching strategies
- Monitor Core Web Vitals and fix performance issues promptly

## Security Guidelines

- Store API keys in environment variables
- Implement proper rate limiting
- Use CSRF protection for forms
- Validate all user inputs
- Sanitize data before database operations
- Use HTTPS in production
- Implement proper session management

## Accessibility Guidelines

- Use semantic HTML elements
- Implement proper ARIA labels and roles
- Ensure keyboard navigation works properly
- Maintain sufficient color contrast ratios
- Provide alternative text for images
- Support screen readers
- Test with accessibility tools

## AI Integration Guidelines

- Implement fallback mechanisms for AI API failures
- Rate limit AI API calls per user
- Cache AI responses when appropriate
- Implement proper error handling for each AI service
- Monitor AI API usage and costs
- Provide clear feedback about which AI model is being used

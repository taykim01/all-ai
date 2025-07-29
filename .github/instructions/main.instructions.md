---
applyTo: '**'
---
# All-AI Project Instructions

## Project Overview

All-AI is a progressive web application (PWA) that provides an intelligent AI routing system. The application analyzes user queries and automatically selects the most appropriate AI model (ChatGPT, Claude, Gemini, or Grok) to provide the best possible response. The goal of this project is to provide the most accurate response to the user promptly. The key strength of this project is that the user does not have have to have access to all the AI models, as each model shows strengths and weaknesses in different areas; instead, the user can simply use this project and get the best answer. This project is able to research the internet.

## User Flow Overview

At first, the user finds out about this project on the landing page. The user, who was wondering which AI model to subscribe to, feels that this service is the solution that the user needed. The landing page was aesthetic enough for the user to feel attracted to. The user, who wants to try this project out, signs up using email. There is no verification whatsoever. Then, the user sees a messenger-like screen, which is dynamic enough to make the user want to enter a question that the user had in mind: "scribe the impact of artificial intelligence on healthcare." The project then returns the information the user needed. The user wants to talk about a different topic, so the user creates another chat and deletes the previous one.

## LLM Flow Overview

Different models have different strengths, so this project structures the model as the following:
0. USER: The user enters a prompt.
1. AGENT: The agent analyzes the prompt for clarity. If anything is unclear, the model asks the user for additional information.
2. AGENT: If the agent has enough information to start generating a response, the agent now chooses which model(e.g. GPT 4.1) from which AI service(e.g. ChatGPT) to use, according to the characteristic of the user's prompt.
3. AGENT: If additional information from the internet is required to generate a complete response, the agent continues to search the internet.
4. AGENT: If the search results contain ambiguity and the agent decides that the user needs to clear something out, the agent asks necessary questions to the user.
5. AGENT: At this point, the agent must have a prompt that is clear enough, enough information from the internet, and final clarification from the user to return what the user wants. Otherwise, continue asking the user questions until a separate agent used for evaluating if it is okay to generate a final response confirms the generation of the final response. The maximum number of questions the agent can ask the user is 7 in total, including all steps from 0 to 5.
6. AGENT: The agent can now generate a final response to the user. The agent chooses the best model to do this job.
7. AGENT: Keeping the entire chat is an ineffective and inefficient method of keeping memory on the chat with the user. Therefore, an independent clerk agent will keep the record of what the user and the agent has been talking about. This record will be written in an orderly yet concise manner and will be used as reference in steps 1 through 6.

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
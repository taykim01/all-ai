---
applyTo: "src/types/**"
---

# Types Directory Instructions

## Overview

The `src/types` directory contains TypeScript type definitions and interfaces used throughout the application.

## File Organization

- `auth.ts` - Authentication and user-related types
- `chat.ts` - Chat, conversation, and message types
- `ai.ts` - AI model and response types
- `api.ts` - API request/response types
- `ui.ts` - UI component and state types
- `database.ts` - Database schema types (generated from Supabase)
- `index.ts` - Re-exports for easy importing

## Type Definition Guidelines

### Base Types

```typescript
// auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  preferredAIModel: AIModel;
  theme: "light" | "dark" | "system";
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: "immediate" | "daily" | "weekly";
}
```

### AI Types

```typescript
// ai.ts
export type AIModel = "gpt-4" | "claude-3" | "gemini-pro" | "grok-1";

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  capabilities: AICapability[];
  rateLimits: RateLimit;
}

export interface AIResponse {
  content: string;
  model: AIModel;
  usage: TokenUsage;
  metadata?: Record<string, unknown>;
  generatedAt: Date;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export type AICapability =
  | "text-generation"
  | "code-generation"
  | "analysis"
  | "creative-writing"
  | "search";
```

### Chat Types

```typescript
// chat.ts
export interface Conversation {
  id: string;
  title: string;
  userId: string;
  messages: Message[];
  settings: ConversationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  conversationId: string;
  aiModel?: AIModel;
  metadata?: MessageMetadata;
  createdAt: Date;
}

export interface MessageMetadata {
  usage?: TokenUsage;
  processingTime?: number;
  confidence?: number;
  citations?: Citation[];
}

export interface ConversationSettings {
  aiModel?: AIModel;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}
```

## Best Practices

### Naming Conventions

- Use PascalCase for interfaces and types
- Use descriptive names that clearly indicate purpose
- Prefix with 'I' only when absolutely necessary to avoid conflicts
- Use union types for constrained values

### Type Design

- Prefer interfaces over types for object shapes
- Use types for unions, intersections, and computed types
- Make fields optional only when they truly can be undefined
- Use readonly arrays and objects when appropriate

### Generic Types

```typescript
// Utility types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Generic form state
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}
```

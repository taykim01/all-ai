---
applyTo: "src/lib/**"
---

# Lib Directory Instructions

## Overview

The `src/lib` directory contains utility functions, configurations, services, and business logic that is shared across the application.

## Structure Guidelines

### Organization

- `actions/` - Next.js Server Actions for data mutations
- `ai/` - AI service integrations and utilities
- `config/` - Application configuration and environment variables
- `constants/` - Application-wide constants and enums
- `services/` - External service integrations (APIs, third-party services)
- `supabase/` - Supabase client configuration and database utilities
- `validations/` - Zod schemas and validation utilities

## Coding Standards

### Server Actions (`actions/`)

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerActionClient } from "@/lib/supabase/server";

const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationId: z.string().uuid(),
});

export async function sendChatMessage(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerActionClient();

    // Validate input
    const data = chatMessageSchema.parse({
      message: formData.get("message"),
      conversationId: formData.get("conversationId"),
    });

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Perform action
    const { error } = await supabase.from("messages").insert({
      content: data.message,
      conversation_id: data.conversationId,
      user_id: user.id,
    });

    if (error) throw error;

    // Revalidate cache
    revalidatePath("/chat");

    return { success: true };
  } catch (error) {
    console.error("Send message error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### AI Services (`ai/`)

```typescript
// ai/types.ts
export type AIModel = "gpt-4" | "claude-3" | "gemini-pro" | "grok-1";

export interface AIResponse {
  content: string;
  model: AIModel;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, any>;
}

// ai/selector.ts
export async function selectBestModel(query: string): Promise<AIModel> {
  // Implement logic to analyze query and select best AI model
  // Consider factors: query type, complexity, user preferences, model availability

  if (query.includes("code") || query.includes("programming")) {
    return "gpt-4";
  }

  if (query.includes("creative") || query.includes("writing")) {
    return "claude-3";
  }

  if (query.includes("search") || query.includes("current")) {
    return "gemini-pro";
  }

  return "gpt-4"; // Default fallback
}

// ai/client.ts
export class AIClient {
  async chat(model: AIModel, messages: ChatMessage[]): Promise<AIResponse> {
    switch (model) {
      case "gpt-4":
        return this.chatWithOpenAI(messages);
      case "claude-3":
        return this.chatWithClaude(messages);
      case "gemini-pro":
        return this.chatWithGemini(messages);
      case "grok-1":
        return this.chatWithGrok(messages);
      default:
        throw new Error(`Unsupported model: ${model}`);
    }
  }
}
```

### Configuration (`config/`)

```typescript
// config/env.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  GOOGLE_AI_API_KEY: z.string(),
  XAI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

// config/ai.ts
export const AI_CONFIG = {
  models: {
    "gpt-4": {
      provider: "openai",
      maxTokens: 4096,
      temperature: 0.7,
    },
    "claude-3": {
      provider: "anthropic",
      maxTokens: 4096,
      temperature: 0.7,
    },
    "gemini-pro": {
      provider: "google",
      maxTokens: 4096,
      temperature: 0.7,
    },
    "grok-1": {
      provider: "xai",
      maxTokens: 4096,
      temperature: 0.7,
    },
  },
  rateLimits: {
    perUser: 50, // requests per hour
    perIP: 100, // requests per hour
  },
} as const;
```

### Constants (`constants/`)

```typescript
// constants/app.ts
export const APP_NAME = "All-AI";
export const APP_DESCRIPTION = "Intelligent AI routing for the best responses";

export const ROUTES = {
  HOME: "/",
  CHAT: "/chat",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export const AI_MODELS = {
  GPT_4: "gpt-4",
  CLAUDE_3: "claude-3",
  GEMINI_PRO: "gemini-pro",
  GROK_1: "grok-1",
} as const;

// constants/errors.ts
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to perform this action",
  INVALID_INPUT: "Invalid input provided",
  AI_SERVICE_ERROR: "AI service temporarily unavailable",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later",
} as const;
```

### Validations (`validations/`)

```typescript
import { z } from "zod";

// User schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Chat schemas
export const messageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1).max(10000),
  role: z.enum(["user", "assistant"]),
  conversationId: z.string().uuid(),
  aiModel: z.enum(["gpt-4", "claude-3", "gemini-pro", "grok-1"]).optional(),
  createdAt: z.date(),
});

export const conversationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  userId: z.string().uuid(),
  messages: z.array(messageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Form schemas
export const createMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(10000, "Message too long"),
  conversationId: z.string().uuid("Invalid conversation ID"),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  preferredAI: z.enum(["gpt-4", "claude-3", "gemini-pro", "grok-1"]).optional(),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});
```

## Best Practices

### Error Handling

- Use try-catch blocks in all async functions
- Log errors appropriately for debugging
- Return consistent error formats
- Implement proper error recovery mechanisms

### Type Safety

- Use Zod for runtime validation
- Define strict TypeScript interfaces
- Avoid any types
- Use type guards for type narrowing

### Performance

- Cache expensive computations
- Use connection pooling for database connections
- Implement proper rate limiting
- Monitor and optimize API calls

### Security

- Validate all inputs
- Sanitize data before database operations
- Use environment variables for secrets
- Implement proper authentication checks
- Use HTTPS in production

### Testing

- Write unit tests for utility functions
- Mock external dependencies
- Test error conditions
- Use integration tests for critical paths

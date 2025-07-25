---
applyTo: "src/utils/**"
---

# Utils Directory Instructions

## Overview

The `src/utils` directory contains pure utility functions that can be used across the application without side effects.

## File Organization

- `cn.ts` - Class name utility (clsx + tailwind-merge)
- `date.ts` - Date formatting and manipulation utilities
- `string.ts` - String manipulation utilities
- `validation.ts` - Validation helper functions
- `format.ts` - Number and text formatting utilities
- `ai.ts` - AI-related utility functions
- `crypto.ts` - Cryptographic utilities
- `url.ts` - URL manipulation utilities

## Utility Functions

### Class Name Utility

```typescript
// cn.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Date Utilities

```typescript
// date.ts
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}

export function formatChatTimestamp(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function isWithinTimeRange(date: Date, minutes: number): boolean {
  const now = new Date();
  const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
  return diffInMinutes <= minutes;
}
```

### String Utilities

```typescript
// string.ts
export function truncate(str: string, length: number, suffix = "..."): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}
```

### Validation Utilities

```typescript
// validation.ts
export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

export function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

export function validateChatMessage(message: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!message.trim()) {
    errors.push("Message cannot be empty");
  }

  if (message.length > 10000) {
    errors.push("Message is too long (max 10,000 characters)");
  }

  if (message.trim().length < 1) {
    errors.push("Message must contain at least one character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Format Utilities

```typescript
// format.ts
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function formatTokenCount(tokens: number): string {
  return new Intl.NumberFormat().format(tokens);
}

export function formatFileSize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${size.toFixed(1)} ${sizes[i]}`;
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
```

### AI Utilities

```typescript
// ai.ts
import { type AIModel } from "@/types/ai";

export function getModelDisplayName(model: AIModel): string {
  const modelNames: Record<AIModel, string> = {
    "gpt-4": "GPT-4",
    "claude-3": "Claude 3",
    "gemini-pro": "Gemini Pro",
    "grok-1": "Grok",
  };

  return modelNames[model] || model;
}

export function getModelColor(model: AIModel): string {
  const modelColors: Record<AIModel, string> = {
    "gpt-4": "bg-green-500",
    "claude-3": "bg-orange-500",
    "gemini-pro": "bg-blue-500",
    "grok-1": "bg-purple-500",
  };

  return modelColors[model] || "bg-gray-500";
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

export function calculateCost(tokens: number, model: AIModel): number {
  // Cost per 1K tokens (example pricing)
  const pricing: Record<AIModel, { input: number; output: number }> = {
    "gpt-4": { input: 0.03, output: 0.06 },
    "claude-3": { input: 0.015, output: 0.075 },
    "gemini-pro": { input: 0.0005, output: 0.0015 },
    "grok-1": { input: 0.01, output: 0.02 },
  };

  const cost = pricing[model];
  if (!cost) return 0;

  // Assuming mixed input/output (simple average)
  const avgCost = (cost.input + cost.output) / 2;
  return (tokens / 1000) * avgCost;
}
```

## Best Practices

### Function Design

- Keep functions pure (no side effects)
- Use descriptive names that indicate the function's purpose
- Provide proper TypeScript types for parameters and return values
- Include JSDoc comments for complex functions

### Error Handling

- Validate inputs and handle edge cases gracefully
- Return meaningful error messages or throw specific error types
- Use type guards for runtime type checking

### Performance

- Memoize expensive computations when appropriate
- Avoid creating objects/arrays in utility functions unless necessary
- Use efficient algorithms for text processing

### Testing

- Write comprehensive unit tests for all utility functions
- Test edge cases and error conditions
- Use property-based testing for complex logic

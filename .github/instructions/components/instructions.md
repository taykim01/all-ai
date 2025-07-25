---
applyTo: "src/components/**"
---

# Components Directory Instructions

## Overview

The `src/components` directory contains reusable React components organized by feature and purpose.

## Structure Guidelines

### Organization

- `ui/` - Base UI components (buttons, inputs, modals, etc.)
- `chat/` - Chat-specific components (message bubbles, input forms, etc.)
- `forms/` - Form components and form-related utilities
- `layout/` - Layout components (headers, sidebars, footers)
- `providers/` - Context providers and wrapper components

### File Naming

- Use PascalCase for component files: `ChatMessage.tsx`
- Use kebab-case for directories: `chat-interface/`
- Include index files for easy imports: `index.ts`

## Coding Standards

### Component Structure

```typescript
"use client"; // Only when client-side features are needed

import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  sender: "user" | "ai";
  timestamp: Date;
  aiModel?: "gpt" | "claude" | "gemini" | "grok";
  className?: string;
}

export function ChatMessage({
  message,
  sender,
  timestamp,
  aiModel,
  className,
  ...props
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "chat-message",
        sender === "user" ? "user-message" : "ai-message",
        className
      )}
      {...props}
    >
      <div className="message-content">{message}</div>
      <div className="message-meta">
        <time dateTime={timestamp.toISOString()}>
          {timestamp.toLocaleTimeString()}
        </time>
        {aiModel && <span className="ai-model">{aiModel}</span>}
      </div>
    </div>
  );
}
```

### UI Components Guidelines

- Use compound component pattern for complex components
- Implement proper accessibility attributes
- Support ref forwarding when needed
- Use Tailwind CSS for styling
- Support both controlled and uncontrolled patterns

### Props Design

- Use TypeScript interfaces for props
- Extend HTML element props when appropriate
- Provide sensible defaults
- Make className prop optional for custom styling
- Use union types for constrained values

### State Management

- Keep local state in components when possible
- Use Context for shared state across component trees
- Implement proper loading and error states
- Use optimistic updates for better UX

## Component Categories

### UI Components (`ui/`)

Base components that form the design system:

- Button, Input, Select, Modal, Dialog
- Card, Badge, Avatar, Spinner
- Toast, Alert, Tooltip, Popover

```typescript
// Example: Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }))}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);
```

### Chat Components (`chat/`)

Components specific to chat functionality:

- ChatInterface, MessageList, MessageInput
- AIModelSelector, TypingIndicator
- ChatHistory, ConversationList

### Form Components (`forms/`)

Form-related components with validation:

- LoginForm, RegisterForm, SettingsForm
- FormField, FormError, FormSuccess
- Use react-hook-form with Zod validation

### Layout Components (`layout/`)

Structural components for page layouts:

- Header, Sidebar, Footer
- Navigation, Breadcrumbs
- PageWrapper, ContentArea

### Provider Components (`providers/`)

Context providers for global state:

- AuthProvider, ThemeProvider
- ChatProvider, AIProvider
- ToastProvider, ModalProvider

## Best Practices

### Performance

- Use React.memo() for expensive components
- Implement proper key props for lists
- Use lazy loading for heavy components
- Minimize re-renders with useCallback/useMemo

### Accessibility

- Use semantic HTML elements
- Implement proper ARIA attributes
- Support keyboard navigation
- Provide screen reader support
- Test with accessibility tools

### Testing

- Write unit tests for complex logic
- Test component props and interactions
- Mock external dependencies
- Use React Testing Library best practices

### Documentation

- Add JSDoc comments for complex components
- Document prop interfaces thoroughly
- Provide usage examples
- Maintain component stories (Storybook)

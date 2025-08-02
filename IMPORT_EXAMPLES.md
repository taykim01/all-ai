# Import Examples

This file demonstrates the proper way to import various resources in the refactored codebase structure.

## UI Components

```tsx
// Import UI components from the ui directory
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
```

## Feature Components

```tsx
// Import feature-specific components
import {
  ChatWindow,
  ChatInput,
  MessageBubble,
} from "@/features/chat/components";
import { AuthDialog } from "@/features/auth/components";
import { Sidebar } from "@/features/common/layout";
```

## Server Actions

```tsx
// Import server actions
import { signIn, signUp, signOut } from "@/features/auth/actions";
import { createChat, getChats, deleteChat } from "@/features/chat/actions";
import {
  createMessage,
  generateResponse,
} from "@/features/chat/message-actions";
```

## Hooks

```tsx
// Import feature-specific hooks
import { useAuth } from "@/features/auth/hooks";
import { useChats } from "@/features/chat/hooks/use-chats";
import { useMessages } from "@/features/chat/hooks/use-messages";
```

## Stores

```tsx
// Import stores
import { useAuthStore } from "@/core/stores/auth-store";
import { useChatStore } from "@/core/stores/chat-store";
import { useMessageStore } from "@/core/stores/message-store";

// Or import from the index file
import { useAuthStore, useChatStore, useMessageStore } from "@/core/stores";
```

## Types

```tsx
// Import types
import type { Message, Chat, User } from "@/core/types/models";
import type { AIModel, ModelInfo } from "@/core/types/ai.types";
import type { Tables, Database } from "@/core/types/database.types";
```

## Infrastructure

```tsx
// Import infrastructure services
import { generateAIResponse, getModelInfo } from "@/infrastructure/ai";
import { createBrowserClient } from "@/infrastructure/supabase/browser";
import { createServerClient } from "@/infrastructure/supabase/server";
```

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModelBadge } from "@/features/chat/components/model-badge";
import { formatDate, cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { Tables } from "@/core/types/database.types";
import type { AIModel } from "@/core/types/ai.types";

type Message = Tables<"messages">;

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-2 sm:p-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="text-xs bg-secondary">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium">
            {isUser ? "사용자" : "AI Assistant"}
          </span>
          {message.model_used && !isUser && (
            <ModelBadge model={message.model_used as AIModel} />
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(message.created_at)}
          </span>
        </div>
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl text-sm shadow-md backdrop-blur-sm border",
            isUser
              ? "bg-primary/30 border-primary/20 text-primary-foreground ml-auto"
              : message.model_used?.includes("gpt") ||
                ["o1", "o3", "o3-pro", "o4-mini"].includes(
                  message.model_used as string
                )
              ? "bg-model-gpt/20 border-model-gpt/30 text-foreground mr-auto"
              : message.model_used?.includes("claude")
              ? "bg-model-claude/20 border-model-claude/30 text-foreground mr-auto"
              : message.model_used?.includes("gemini")
              ? "bg-model-gemini/20 border-model-gemini/30 text-foreground mr-auto"
              : message.model_used?.includes("grok")
              ? "bg-model-grok/20 border-model-grok/30 text-foreground mr-auto"
              : "bg-secondary/30 border-secondary/20 text-secondary-foreground mr-auto",
            "whitespace-pre-wrap break-words"
          )}
        >
          <p>{message.content}</p>
          {/* Tail */}
          <span
            className={cn(
              "absolute w-3 h-3",
              isUser
                ? "-right-2 bottom-2 bg-primary/30 rounded-br-2xl"
                : message.model_used?.includes("gpt") ||
                  ["o1", "o3", "o3-pro", "o4-mini"].includes(
                    message.model_used as string
                  )
                ? "-left-2 bottom-2 bg-model-gpt/20 rounded-bl-2xl"
                : message.model_used?.includes("claude")
                ? "-left-2 bottom-2 bg-model-claude/20 rounded-bl-2xl"
                : message.model_used?.includes("gemini")
                ? "-left-2 bottom-2 bg-model-gemini/20 rounded-bl-2xl"
                : message.model_used?.includes("grok")
                ? "-left-2 bottom-2 bg-model-grok/20 rounded-bl-2xl"
                : "-left-2 bottom-2 bg-secondary/30 rounded-bl-2xl"
            )}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
          />
        </div>
      </div>
      {isUser && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModelBadge } from "@/components/model-badge";
import { formatDate, cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { Tables } from "@/types/database.types";
import type { AIModel } from "@/lib/ai";

type Message = Tables<"messages">;

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 p-4 animate-fade-in", className)}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
          )}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
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
            "prose prose-sm max-w-none",
            isUser ? "text-foreground" : "text-foreground"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

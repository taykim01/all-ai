"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { generateResponse } from "@/features/chat/message-actions";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  chatId: string;
  onMessageSent?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  chatId,
  onMessageSent,
  disabled,
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading || disabled) return;

    const currentMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      const result = await generateResponse(chatId, currentMessage);

      if (result.success) {
        onMessageSent?.();
      } else {
        console.error("Failed to send message:", result.error);
        setMessage(currentMessage); // Restore message on error
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessage(currentMessage); // Restore message on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex gap-2 p-4 border-t border-glass-border bg-glass-background backdrop-blur-md",
        "sm:gap-3 sm:p-6",
        className
      )}
      role="form"
      aria-label="Chat input form"
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading || disabled}
        className={cn(
          "flex-1 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200",
          isLoading ? "bg-muted/30" : "bg-glass-background"
        )}
        autoFocus
        aria-label="Message input"
      />
      <Button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        size="icon"
        variant="default"
        className={cn(
          "shrink-0 transition-all duration-200 backdrop-blur-sm",
          isLoading
            ? "cursor-not-allowed opacity-70"
            : "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        )}
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mb-1" />
            <span className="text-[10px] text-muted-foreground animate-pulse">
              AI가 답변을 준비 중...
            </span>
          </div>
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}

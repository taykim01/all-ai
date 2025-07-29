"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { generateResponse } from "@/app/actions/message";
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
      className={cn("flex gap-2 p-4 border-t bg-background", className)}
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
        disabled={isLoading || disabled}
        className="flex-1"
        autoFocus
      />
      <Button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        size="icon"
        className="shrink-0"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}

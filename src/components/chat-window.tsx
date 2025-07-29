"use client";

import { useMessages } from "@/hooks/use-messages";
import { MessageBubble } from "@/components/message-bubble";
import { ChatInput } from "@/components/chat-input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  chatId: string;
}

export function ChatWindow({ chatId }: ChatWindowProps) {
  const { messages, loading, refetch } = useMessages(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <div className="gradient-text text-2xl font-bold">AI</div>
              </div>
              <h3 className="text-lg font-semibold">
                새로운 대화를 시작하세요
              </h3>
              <p className="text-muted-foreground">
                AI가 당신의 질문에 최적화된 모델을 선택하여 답변드립니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {messages.map((message, index) => (
              <div key={message.id}>
                <MessageBubble message={message} />
                {index < messages.length - 1 && <Separator />}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput chatId={chatId} onMessageSent={refetch} />
    </div>
  );
}

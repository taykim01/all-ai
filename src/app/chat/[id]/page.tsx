"use client";

import { ChatWindow } from "@/components/chat-window";
import { notFound } from "next/navigation";
import { use } from "react";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params);

  if (!id) {
    notFound();
  }

  return <ChatWindow chatId={id} />;
}

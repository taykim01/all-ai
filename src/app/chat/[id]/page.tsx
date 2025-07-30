import { ChatWindow } from "@/components/chat-window";
import { notFound } from "next/navigation";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <ChatWindow chatId={id} />;
}

import { getUser } from "@/features/auth/actions";
import { ChatLayoutClient } from "@/features/chat/components/chat-layout-client";
import { redirect } from "next/navigation";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userResult = await getUser();

  if (!userResult.success || !userResult.data) {
    redirect("/");
  }

  return <ChatLayoutClient user={userResult.data}>{children}</ChatLayoutClient>;
}

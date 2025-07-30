import { getUser } from "@/app/actions/auth";
import { ChatLayoutClient } from "@/components/chat-layout-client";
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

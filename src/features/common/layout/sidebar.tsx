"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/core/stores";
import { useChats } from "@/features/chat/hooks/use-chats";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, Trash2, LogOut } from "lucide-react";
import { cn, truncateText } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuthStore();
  const { chats, loading, createChat, deleteChat, fetchChats } = useChats();
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user?.id) {
      fetchChats(user.id);
    }
  }, [user?.id, fetchChats]);

  const handleCreateChat = async () => {
    if (!user) return;

    setIsCreating(true);
    try {
      const newChat = await createChat(user.id, "새로운 채팅");
      if (newChat) {
        router.push(`/chat/${newChat.id}`);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("이 채팅을 삭제하시겠습니까?")) {
      const success = await deleteChat(chatId);
      if (success) {
        if (pathname === `/chat/${chatId}`) {
          router.push("/chat");
        }
      }
    }
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.push("/");
    }
  };

  if (!user) return null;

  return (
    <div className={cn("flex flex-col h-full bg-card border-r", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">All-AI</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-8 h-8"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleCreateChat}
          disabled={isCreating}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          새로운 채팅
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            채팅 목록을 불러오는 중...
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            아직 채팅이 없습니다
          </div>
        ) : (
          chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group mb-1",
                pathname === `/chat/${chat.id}` && "bg-accent"
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {truncateText(chat.title, 20)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(chat.updated_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDeleteChat(chat.id, e)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </Link>
          ))
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

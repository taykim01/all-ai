import { Tables } from "./database.types";

export type User = Tables<"profiles">;
export type Chat = Tables<"chats">;
export type Message = Tables<"messages">;
export type ChatSummary = Tables<"chat_summaries">;

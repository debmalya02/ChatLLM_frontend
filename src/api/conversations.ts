import api from "./api";
import type { Conversation } from "../types/index";

export async function getConversations(): Promise<Conversation[] | void> {
  try {
    const res = await api.get<Conversation[]>("/conversations");
    console.log("Fetched Conversations:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
  }
}

export async function getConversationById(
  id: string
): Promise<Conversation | void> {
  try {
    const res = await api.get<Conversation>(`/conversations/${id}`);
    console.log(`Fetched Conversation (${id}):`, res.data);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch conversation with id ${id}:`, error);
  }
}

export async function createConversation(): Promise<Conversation | void> {
  try {
    const res = await api.post<Conversation>("/conversations");
    console.log("Created Conversation:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to create conversation:", error);
    throw error; // Re-throw to handle in UI
  }
}

export async function deleteConversation(id: string): Promise<void> {
  try {
    await api.delete(`/conversations/${id}`);
    console.log(`Deleted Conversation (${id})`);
  } catch (error) {
    console.error(`Failed to delete conversation with id ${id}:`, error);
    throw error; // Re-throw to handle in UI
  }
}

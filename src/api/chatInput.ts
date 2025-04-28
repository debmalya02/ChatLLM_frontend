import api from "./api";
import { Message } from "../types/index";

export const sendMessage = async (
  model: string,
  message: string,
  conversationId: string
): Promise<string> => {
  try {
    const response = await api.post(
      `/conversations/${conversationId}/messages`,
      {
        model,
        content: message,
      }
    );

    // Return only the assistant's response
    return response.data.response;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
};

export async function getMessages(
  conversationId: string
): Promise<Message[] | void> {
  try {
    const res = await api.get<Message[]>(
      `/conversations/${conversationId}/messages`
    );
    return res.data;
  } catch (error) {
    console.error(
      `Failed to fetch messages for conversation ${conversationId}:`,
      error
    );
  }
}

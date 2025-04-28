import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Conversation,
  ModelType,
  Message,
  UserPreferences,
} from "../types";
import { User } from "@supabase/supabase-js";
import {
  createConversation,
  deleteConversation as deleteConversationApi,
  getConversations,
} from "../api/conversations";
import { sendMessage as sendMessageApi } from "../api/chatInput";
import api from "../api/api";

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  userPreferences: UserPreferences;
  isProcessing: boolean;
  user: User | null;
  isFetchingConversations: boolean;
  isCreatingConversation: boolean;
  lastConversationCreated: number;
  addConversation: () => Promise<string | undefined | null>;
  addMessage: (content: string, role: "user" | "assistant") => Promise<void>;
  updateMessagesFromServer: (conversationId: string) => Promise<void>;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => Promise<void>;
  setCurrentConversation: (id: string) => void;
  setModel: (model: ModelType) => void;
  toggleFavorite: (id: string) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setProcessing: (processing: boolean) => void;
  setUser: (user: User | null) => void;
  fetchConversations: () => Promise<void>;
}

const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isProcessing: false,
      isFetchingConversations: false,
      isCreatingConversation: false,
      lastConversationCreated: 0,
      user: null,
      userPreferences: {
        theme: "system",
        fontSize: "md",
        messageSpacing: "comfortable",
        codeTheme: "github",
      },

      setUser: (user) => set({ user }),

      fetchConversations: async () => {
        const state = get();
        if (state.isFetchingConversations) return;

        try {
          set({ isFetchingConversations: true });
          const conversations = await getConversations();
          if (conversations) {
            set({
              conversations,
              // Clear any stale creation state
              isCreatingConversation: false,
              lastConversationCreated: 0,
            });
          }
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
        } finally {
          set({ isFetchingConversations: false });
        }
      },

      addConversation: async () => {
        const state = get();
        if (state.isCreatingConversation) return;

        // Prevent rapid creation attempts
        const now = Date.now();
        if (now - state.lastConversationCreated < 2000) {
          return state.currentConversationId;
        }

        try {
          set({ isCreatingConversation: true });
          const newConversation = await createConversation();
          if (newConversation) {
            set((state) => ({
              conversations: [newConversation, ...state.conversations].sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              ),
              currentConversationId: newConversation.id,
              lastConversationCreated: now,
            }));
            return newConversation.id;
          }
        } catch (error) {
          console.error("Failed to create conversation:", error);
        } finally {
          set({ isCreatingConversation: false });
        }
      },

      addMessage: async (content: string, role: "user" | "assistant") => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return;

        const currentConversation = conversations.find(
          (c) => c.id === currentConversationId
        );
        if (!currentConversation) return;

        const newMessage: Message = {
          id: uuidv4(),
          conversation_id: currentConversationId,
          content,
          role,
          model: currentConversation.model || "gemini",
          created_at: new Date().toISOString(),
        };

        // Update local state immediately
        set((state) => ({
          conversations: state.conversations
            .map((conv) =>
              conv.id === currentConversationId
                ? {
                    ...conv,
                    messages: [...(conv.messages || []), newMessage],
                    updated_at: new Date().toISOString(),
                  }
                : conv
            )
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            ),
        }));

        if (role === "user") {
          set({ isProcessing: true });
          try {
            await sendMessageApi(
              currentConversation.model || "gemini",
              content,
              currentConversationId
            );
            // After successful API call, update conversation from server
            await get().updateMessagesFromServer(currentConversationId);
          } catch (error) {
            console.error("Error in sendMessage:", error);
          } finally {
            set({ isProcessing: false });
          }
        }
      },

      updateMessagesFromServer: async (conversationId: string) => {
        try {
          const { data: messages } = await api.get<Message[]>(
            `/conversations/${conversationId}/messages`
          );

          if (messages) {
            set((state) => ({
              conversations: state.conversations
                .map((conv) =>
                  conv.id === conversationId
                    ? {
                        ...conv,
                        messages,
                        updated_at: new Date().toISOString(),
                      }
                    : conv
                )
                .sort(
                  (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
                ),
            }));
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      },

      updateConversation: (id: string, updates: Partial<Conversation>) => {
        set((state) => ({
          conversations: state.conversations
            .map((conv) =>
              conv.id === id
                ? {
                    ...conv,
                    ...updates,
                    updated_at: new Date().toISOString(),
                  }
                : conv
            )
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            ),
        }));
      },

      deleteConversation: async (id: string) => {
        try {
          await deleteConversationApi(id);
          set((state) => {
            const newConversations = state.conversations.filter(
              (conv) => conv.id !== id
            );
            return {
              conversations: newConversations,
              currentConversationId:
                state.currentConversationId === id
                  ? newConversations[0]?.id || null
                  : state.currentConversationId,
            };
          });
        } catch (error) {
          console.error("Failed to delete conversation:", error);
          throw error;
        }
      },

      setCurrentConversation: (id: string) => {
        set({ currentConversationId: id });
      },

      setModel: (model: ModelType) => {
        const { currentConversationId } = get();
        if (!currentConversationId) return;

        set((state) => ({
          conversations: state.conversations
            .map((conv) =>
              conv.id === currentConversationId
                ? {
                    ...conv,
                    model,
                    updated_at: new Date().toISOString(),
                  }
                : conv
            )
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            ),
        }));
      },

      toggleFavorite: (id: string) => {
        set((state) => ({
          conversations: state.conversations
            .map((conv) =>
              conv.id === id
                ? {
                    ...conv,
                    favorite: !conv.favorite,
                    updated_at: new Date().toISOString(),
                  }
                : conv
            )
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            ),
        }));
      },

      updateUserPreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        }));
      },

      setProcessing: (processing: boolean) => {
        set({ isProcessing: processing });
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        userPreferences: state.userPreferences,
      }),
    }
  )
);

export default useStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message, ModelType, UserPreferences } from '../types';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  userPreferences: UserPreferences;
  isProcessing: boolean;
  addConversation: () => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string) => void;
  setModel: (model: ModelType) => void;
  toggleFavorite: (id: string) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setProcessing: (processing: boolean) => void;
}

const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isProcessing: false,
      userPreferences: {
        theme: 'system',
        fontSize: 'md',
        messageSpacing: 'comfortable',
        codeTheme: 'github',
      },

      addConversation: () => {
        const newConversation: Conversation = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [],
          model: 'gpt-4',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          favorite: false,
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }));
      },

      addMessage: (content: string, role: 'user' | 'assistant') => {
        const { currentConversationId, conversations } = get();
        if (!currentConversationId) return;

        const newMessage: Message = {
          id: uuidv4(),
          content,
          role,
          model: conversations.find((c) => c.id === currentConversationId)?.model || 'gpt-4',
          timestamp: Date.now(),
        };

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: Date.now(),
                }
              : conv
          ),
        }));
      },

      updateConversation: (id: string, updates: Partial<Conversation>) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, ...updates } : conv
          ),
        }));
      },

      deleteConversation: (id: string) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId:
            state.currentConversationId === id
              ? state.conversations[0]?.id || null
              : state.currentConversationId,
        }));
      },

      setCurrentConversation: (id: string) => {
        set({ currentConversationId: id });
      },

      setModel: (model: ModelType) => {
        const { currentConversationId } = get();
        if (!currentConversationId) return;

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === currentConversationId ? { ...conv, model } : conv
          ),
        }));
      },

      toggleFavorite: (id: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, favorite: !conv.favorite } : conv
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
      name: 'chat-storage',
    }
  )
);

export default useStore;
import React, { useEffect, useRef } from "react";
import { ChatContainer } from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import useStore from "../store/useStore";

export const Home: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    addConversation,
    setCurrentConversation,
    fetchConversations,
    isFetchingConversations,
  } = useStore();

  const initializationComplete = useRef(false);

  // Single fetch on mount
  useEffect(() => {
    const initialize = async () => {
      if (!initializationComplete.current) {
        await fetchConversations();
        initializationComplete.current = true;
      }
    };
    initialize();
  }, []);

  // Handle conversation selection only after fetching is complete and there's no current selection
  useEffect(() => {
    if (!isFetchingConversations && !currentConversationId) {
      // If we have conversations but no current selection, select the most recent one
      if (conversations.length > 0) {
        const mostRecentConversation = conversations.reduce((prev, current) =>
          new Date(current.updated_at || 0) > new Date(prev.updated_at || 0)
            ? current
            : prev
        );
        setCurrentConversation(mostRecentConversation.id);
      }
    }
  }, [conversations, currentConversationId, isFetchingConversations]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full overflow-hidden">
        <Sidebar />
        <ChatContainer />
      </div>
    </SidebarProvider>
  );
};

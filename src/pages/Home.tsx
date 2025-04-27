import React from "react";
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
  } = useStore();

  // Create a new conversation if none exists
  React.useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      // If there are conversations but no current selection, select the most recent one
      const mostRecentConversation = conversations.reduce((prev, current) =>
        current.updatedAt > prev.updatedAt ? current : prev
      );
      setCurrentConversation(mostRecentConversation.id);
    } else if (conversations.length === 0) {
      // If no conversations exist, create a new one
      const newId = addConversation();
      setCurrentConversation(newId);
    }
  }, [
    conversations,
    currentConversationId,
    addConversation,
    setCurrentConversation,
  ]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full overflow-hidden">
        <Sidebar />
        <ChatContainer />
      </div>
    </SidebarProvider>
  );
};

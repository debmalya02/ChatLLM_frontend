import React from "react";
import useStore from "../store/useStore";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { ModelSelector } from "./ModelSelector";
import { Loader2 } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { SidebarInset } from "../components/ui/sidebar";

export const ChatContainer: React.FC = () => {
  const { conversations, currentConversationId, isProcessing } = useStore();
  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  return (
    <SidebarInset className="flex h-full flex-col bg-background text-foreground transition-colors">
      <div className="md:pt-0 pt-14">
        {currentConversation && <ModelSelector />}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {currentConversation?.messages &&
        currentConversation.messages.length > 0 ? (
          currentConversation.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState />
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 p-4 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </div>

      {currentConversation && <ChatInput />}
    </SidebarInset>
  );
};

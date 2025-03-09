import React from 'react';
import useStore from '../store/useStore';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { Loader2 } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const { conversations, currentConversationId, isProcessing } = useStore();
  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  if (!currentConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Select or create a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      <div className="md:pt-0 pt-14"> {/* Add padding top on mobile */}
        <ModelSelector />
      </div>
      <div className="flex-1 overflow-y-auto">
        {currentConversation.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 p-4 text-gray-500 dark:text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </div>
      <ChatInput />
    </div>
  );
};
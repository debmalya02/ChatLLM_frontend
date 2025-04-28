import React, { useState, useRef, useCallback } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "./ui/button";
import useStore from "../store/useStore";

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isProcessing, currentConversationId, addMessage } = useStore();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!message.trim() || !currentConversationId) return;

      const messageContent = message.trim();
      setMessage(""); // Clear input immediately

      try {
        // Add message to UI immediately and handle server communication in the background
        await addMessage(messageContent, "user");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [message, currentConversationId, addMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border bg-background p-4 min-h-20 transition-colors"
    >
      <div className="relative flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-2"
          onClick={() => {}}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="max-h-32 w-full resize-none rounded-lg border border-input bg-background pl-12 pr-12 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          rows={1}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-2"
          disabled={!message.trim() || isProcessing}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

import React, { useState } from "react";
import { MessageSquare, Star, Trash2, Pencil, Check, X } from "lucide-react";
import useStore from "../store/useStore";
import { formatDistanceToNow } from "date-fns";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";

interface EditingState {
  id: string;
  title: string;
}

interface ConversationListProps {
  onConversationSelect?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onConversationSelect,
}) => {
  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    deleteConversation,
    toggleFavorite,
    updateConversation,
  } = useStore();

  const [editing, setEditing] = useState<EditingState | null>(null);

  const handleEditStart = (conversation: { id: string; title: string }) => {
    setEditing({ id: conversation.id, title: conversation.title });
  };

  const handleEditSave = () => {
    if (editing) {
      updateConversation(editing.id, { title: editing.title.trim() });
      setEditing(null);
    }
  };

  const handleEditCancel = () => {
    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleConversationClick = (id: string) => {
    if (!editing) {
      setCurrentConversation(id);
      onConversationSelect?.();
    }
  };

  return (
    <SidebarMenu className="p-2">
      {conversations.map((conversation) => (
        <SidebarMenuItem
          key={conversation.id}
          className="mb-2 overflow-hidden rounded-md border border-transparent hover:bg-accent/5 transition-colors hover:border-border"
        >
          <div className="group relative flex w-full items-center">
            <SidebarMenuButton
              isActive={currentConversationId === conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              className="pr-24 "
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1 ">
                {editing?.id === conversation.id ? (
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium">
                      {conversation.title}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {formatDistanceToNow(conversation.updatedAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>

            <div className="absolute right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {editing?.id === conversation.id ? (
                <>
                  <button
                    onClick={handleEditSave}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditStart(conversation)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(conversation.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <Star
                      className={
                        conversation.favorite
                          ? "fill-yellow-400 text-yellow-400"
                          : ""
                      }
                    />
                  </button>
                  <button
                    onClick={() => deleteConversation(conversation.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

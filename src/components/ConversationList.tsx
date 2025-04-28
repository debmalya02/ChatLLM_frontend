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
      const trimmedTitle = editing.title.trim();
      if (trimmedTitle) {
        updateConversation(editing.id, { title: trimmedTitle });
      }
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

  // Filter out any potential duplicate conversations and ensure stable sort
  const uniqueConversations = React.useMemo(() => {
    const seen = new Set();
    return conversations.filter((conv) => {
      if (seen.has(conv.id)) {
        return false;
      }
      seen.add(conv.id);
      return true;
    });
  }, [conversations]);

  // Sort conversations by favorite status and updated_at date, ensuring stable sort
  const sortedConversations = React.useMemo(() => {
    return [...uniqueConversations].sort((a, b) => {
      if (a.favorite !== b.favorite) {
        return a.favorite ? -1 : 1;
      }
      const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
      const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
      if (aTime !== bTime) {
        return bTime - aTime;
      }
      // Ensure stable sort by comparing IDs
      return a.id.localeCompare(b.id);
    });
  }, [uniqueConversations]);

  return (
    <SidebarMenu className="p-2">
      {sortedConversations.map((conversation) => (
        <SidebarMenuItem
          key={`conv-${conversation.id}`}
          className="mb-2 overflow-hidden rounded-md border border-transparent hover:bg-accent/5 transition-colors hover:border-border"
        >
          <div className="group relative flex w-full items-center">
            <SidebarMenuButton
              isActive={currentConversationId === conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              className="pr-24"
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
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
                      {conversation.updated_at
                        ? formatDistanceToNow(
                            new Date(conversation.updated_at),
                            {
                              addSuffix: true,
                            }
                          )
                        : "Just now"}
                    </span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>

            <div className="absolute right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {editing?.id === conversation.id ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSave();
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCancel();
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(conversation);
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(conversation.id);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
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

import React, { useState } from 'react';
import { MessageSquare, Star, Trash2, Pencil, Check, X } from 'lucide-react';
import useStore from '../store/useStore';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';

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
    addConversation,
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
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
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
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-800">
      <div className="p-4 pt-16 md:pt-4">
        <Button
          onClick={() => {
            addConversation();
            onConversationSelect?.();
          }}
          className="w-full"
        >
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
              currentConversationId === conversation.id ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MessageSquare className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
              <div className="flex-1 min-w-0">
                {editing?.id === conversation.id ? (
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <h3 className="font-medium truncate">{conversation.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              {editing?.id === conversation.id ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSave();
                    }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCancel();
                    }}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(conversation);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(conversation.id);
                    }}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        conversation.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
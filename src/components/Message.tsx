import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message as MessageType } from '../types';
import { formatDistanceToNow } from 'date-fns';
import useStore from '../store/useStore';
import { Clipboard, Check } from 'lucide-react'; // Icons

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { userPreferences } = useStore();
  const isDark = userPreferences.theme === 'dark';
  const isUser = message.role === 'user';

  // Store copied state for each code block
  const [copiedBlocks, setCopiedBlocks] = useState<Record<string, boolean>>({});

  // Generate a simple hash for strings to use as IDs
  const generateHashId = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `code-${Math.abs(hash).toString(16).substring(0, 8)}`;
  };

  // Memoized copy handler to prevent unnecessary re-renders
  const handleCopy = useCallback(async (text: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Update state to show the check mark
      setCopiedBlocks(prev => ({
        ...prev,
        [blockId]: true
      }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedBlocks(prev => ({
          ...prev,
          [blockId]: false
        }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <div className={`flex flex-col gap-2 p-4 md:p-6 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium order-1">{isUser ? 'You' : 'AI Assistant'}</span>
        <span className="text-gray-500 dark:text-gray-400 order-2">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </span>
        {!isUser && (
          <span className="text-gray-500 dark:text-gray-400 order-3">using {message.model}</span>
        )}
      </div>

      <div className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 ${isUser ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <div className={`prose ${isUser ? 'prose-invert' : 'dark:prose-invert'} prose-sm max-w-none`}>
          <ReactMarkdown
            components={{
              code: ({ className, children }) => {
                const match = /language-(\w+)/.exec(className || '');
                const codeText = String(children).replace(/\n$/, '');
                
                // Create a stable ID based on code content using our hash function
                const blockId = generateHashId(codeText.slice(0, 50));
                const isCopied = Boolean(copiedBlocks[blockId]);

                if (match && match[1]) {
                  return (
                    <div className="relative group">
                      {/* Copy Button with visual state */}
                      <button
                        onClick={() => handleCopy(codeText, blockId)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:bg-gray-600 bg-gray-700 text-white p-1.5 rounded transition-all duration-200 z-10"
                        title={isCopied ? "Copied!" : "Copy to clipboard"}
                        aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
                      >
                        {isCopied ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Clipboard size={16} />
                        )}
                      </button>

                      <SyntaxHighlighter
                        style={isDark ? oneDark : oneLight}
                        language={match[1]}
                        customStyle={{ 
                          borderRadius: '0.375rem',
                          paddingRight: '2.5rem' // Make room for the copy button
                        }}
                      >
                        {codeText}
                      </SyntaxHighlighter>

                      {/* Copied notification */}
                      {isCopied && (
                        <div className="absolute bottom-3 right-3 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                          Copied!
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular inline code
                return <code className={className}>{children}</code>;
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-2">
            <h4 className="text-sm font-medium">Citations</h4>
            <ul className="mt-2 space-y-1">
              {message.citations.map((citation) => (
                <li key={citation.id}>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {citation.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
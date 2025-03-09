import React from 'react';
import useStore from '../store/useStore';
import type { ModelType } from '../types';
import { Check, ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { cn } from '../lib/utils';

const models: { id: ModelType; name: string }[] = [
  { id: 'mistral', name: 'Mistral' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'deepseek', name: 'DeepSeek R1' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'claude-2', name: 'Claude 2' },
];

export const ModelSelector: React.FC = () => {
  const { conversations, currentConversationId, setModel, userPreferences, updateUserPreferences } = useStore();
  const currentModel = conversations.find(
    (conv) => conv.id === currentConversationId
  )?.model;

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Select.Root value={currentModel} onValueChange={setModel}>
        <Select.Trigger
          className="inline-flex ml-8 items-center justify-between rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 w-[200px]"
          aria-label="Select model"
        >
          <Select.Value placeholder="Select model" />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-md">
            <Select.Viewport>
              {models.map((model) => (
                <Select.Item
                  key={model.id}
                  value={model.id}
                  className={cn(
                    'relative flex items-center px-8 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 cursor-pointer outline-none',
                    currentModel === model.id && 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  )}
                >
                  <Select.ItemText>{model.name}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <button
        onClick={() => updateUserPreferences({
          theme: userPreferences.theme === 'dark' ? 'light' : 'dark'
        })}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {userPreferences.theme === 'dark' ? '🌞' : '🌙'}
      </button>
    </div>
  );
};
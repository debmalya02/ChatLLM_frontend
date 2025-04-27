import React from "react";
import useStore from "../store/useStore";
import type { ModelType } from "../types";
import { Check, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { cn } from "../lib/utils";

const models: { id: ModelType; name: string }[] = [
  { id: "mistral", name: "Mistral" },
  { id: "gemini", name: "Gemini" },
  { id: "deepseek", name: "DeepSeek R1" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-2", name: "Claude 2" },
];

export const ModelSelector: React.FC = () => {
  const { conversations, currentConversationId, setModel } = useStore();
  const currentModel = conversations.find(
    (conv) => conv.id === currentConversationId
  )?.model;

  return (
    <div className="flex items-center justify-between p-4 border-b border-border transition-colors">
      <Select.Root value={currentModel} onValueChange={setModel}>
        <Select.Trigger
          className="inline-flex ml-8 items-center justify-between rounded-md px-3 py-2 text-sm bg-background border border-input hover:bg-accent focus:ring-2 focus:ring-ring w-[200px] transition-colors"
          aria-label="Select model"
        >
          <Select.Value placeholder="Select model" />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-popover rounded-md border border-border shadow-md">
            <Select.Viewport>
              {models.map((model) => (
                <Select.Item
                  key={model.id}
                  value={model.id}
                  className={cn(
                    "relative flex items-center px-8 py-2 text-sm text-popover-foreground hover:bg-accent focus:bg-accent outline-none transition-colors cursor-pointer",
                    currentModel === model.id && "bg-accent"
                  )}
                >
                  <Select.ItemText>{model.name}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2 text-primary">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export type ModelType = 'mistral'| 'deepseek'| 'gemini' | 'gpt-4' | 'claude-2';

export interface Message {
  id: string;
  content: string;
  role?: 'user' | 'assistant' | 'system';
  model: ModelType;
  timestamp: number;
  citations?: Citation[];
  attachments?: Attachment[];
}

export interface Citation {
  id: string;
  text: string;
  url: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: ModelType;
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'sm' | 'md' | 'lg';
  messageSpacing: 'compact' | 'comfortable';
  codeTheme: 'github' | 'dracula';
}
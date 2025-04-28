export type ModelType =
  | "mistral"
  | "deepseek"
  | "gemini"
  | "gpt-4"
  | "claude-2";

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: "user" | "assistant" | "system";
  model: ModelType;
  created_at?: string;
  timestamp?: number;
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
  type: "image" | "file";
  url: string;
  name: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  model?: ModelType;
  created_at: string;
  updated_at: string;
  favorite?: boolean;
}

export interface CreateMessagePayload {
  role: "user" | "assistant" | "system";
  content: string;
  model: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  fontSize: "sm" | "md" | "lg";
  messageSpacing: "compact" | "comfortable";
  codeTheme: "github" | "dracula";
}

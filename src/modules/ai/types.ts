export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  scheduleAction?: ScheduleAction | null;
  scheduleConfirmed?: boolean;
};

export type ScheduleAction = {
  courseName: string;
  weekday: number; // 1=Mon..7=Sun
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  location: string;
  itemType: "course" | "personal";
  note?: string;
};

export type APISettings = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

export type Conversation = {
  id: string;
  title: string;
  modeId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

export type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
};

export const STORAGE_KEYS = {
  chatHistory: "campus-ai-chat-history",
  conversations: "campus-ai-conversations",
  activeConversationId: "campus-ai-active-conversation",
  apiSettings: "campus-ai-api-settings",
} as const;

export const DEFAULT_PROVIDERS = {
  deepseek: {
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
  },
} as const;

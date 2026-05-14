import { useCallback, type RefObject } from "react";
import type { ChatMessage } from "../types";
import { ChatBubble } from "./ChatBubble";
import { ChatSuggestions } from "./ChatSuggestions";
import { APIGuideCard } from "./APIGuideCard";

type ChatMessagesProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  hasApiKey: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onConfirmSchedule: (messageId: string) => void;
  onDismissSchedule: (messageId: string) => void;
  onSuggestionSelect: (text: string) => void;
  onOpenSettings: () => void;
};

export function ChatMessages({
  messages,
  isLoading,
  hasApiKey,
  messagesEndRef,
  onConfirmSchedule,
  onDismissSchedule,
  onSuggestionSelect,
  onOpenSettings,
}: ChatMessagesProps) {
  const handleSuggestion = useCallback(
    (text: string) => {
      onSuggestionSelect(text);
    },
    [onSuggestionSelect],
  );

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {hasApiKey ? (
          <ChatSuggestions onSelect={handleSuggestion} />
        ) : (
          <APIGuideCard onOpenSettings={onOpenSettings} />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <div className="flex flex-col gap-4 py-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            onConfirmSchedule={onConfirmSchedule}
            onDismissSchedule={onDismissSchedule}
          />
        ))}

        {isLoading && (
          <div className="flex items-start gap-2 py-1">
            <div className="liquid-glass max-w-[82%] rounded-[22px] rounded-bl-lg px-5 py-3">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

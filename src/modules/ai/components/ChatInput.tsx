import { ArrowUp, Loader2 } from "lucide-react";
import { useCallback, useRef, type KeyboardEvent } from "react";

type ChatInputProps = {
  onSubmit: (content: string) => void;
  isLoading: boolean;
  hasApiKey: boolean;
  onOpenSettings: () => void;
};

export function ChatInput({
  onSubmit,
  isLoading,
  hasApiKey,
  onOpenSettings,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const value = textareaRef.current?.value.trim();
    if (!value || isLoading) return;
    onSubmit(value);
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
  }, [onSubmit, isLoading]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  return (
    <div className="shrink-0 px-4 pb-3 pt-1">
      <div className="liquid-soft flex items-end gap-2 rounded-[24px] px-3 py-2">
        <textarea
          ref={textareaRef}
          className="field-input min-h-[44px] flex-1 resize-none border-none bg-transparent py-2 text-sm leading-relaxed shadow-none focus:shadow-none"
          disabled={isLoading}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            hasApiKey ? "输入消息，Enter 发送..." : "请先配置 API Key..."
          }
          rows={1}
        />

        {!hasApiKey ? (
          <button
            className="liquid-orb flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-teal-600 transition active:scale-95"
            onClick={onOpenSettings}
            type="button"
            title="配置 API"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            className="liquid-orb flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-teal-700 transition active:scale-95 disabled:opacity-50"
            disabled={isLoading}
            onClick={handleSubmit}
            type="button"
            title="发送"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ArrowUp size={20} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

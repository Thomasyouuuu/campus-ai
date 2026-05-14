import type { ChatMessage } from "../types";
import { ScheduleConfirmCard } from "./ScheduleConfirmCard";

type ChatBubbleProps = {
  message: ChatMessage;
  onConfirmSchedule: (messageId: string) => void;
  onDismissSchedule: (messageId: string) => void;
};

export function ChatBubble({
  message,
  onConfirmSchedule,
  onDismissSchedule,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col gap-1.5 ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`max-w-[82%] rounded-[22px] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "liquid-soft rounded-br-lg bg-teal-50/40"
            : "liquid-glass rounded-bl-lg"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>

      <span className="px-1 text-[11px] text-slate-400">{time}</span>

      {!isUser &&
        message.scheduleAction &&
        !message.scheduleConfirmed &&
        message.scheduleAction.courseName && (
          <div className="ml-2 mt-1">
            <ScheduleConfirmCard
              action={message.scheduleAction}
              onConfirm={() => onConfirmSchedule(message.id)}
              onDismiss={() => onDismissSchedule(message.id)}
            />
          </div>
        )}

      {!isUser && message.scheduleConfirmed && (
        <p className="ml-3 mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50/60 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur-sm">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          已添加到日程
        </p>
      )}
    </div>
  );
}

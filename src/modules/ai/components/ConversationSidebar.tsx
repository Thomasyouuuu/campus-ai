"use client";

import { MessageCircle, Plus, Trash2, X } from "lucide-react";
import type { Conversation } from "../types";

function formatTime(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

function getPreview(messages: Conversation["messages"]): string {
  if (messages.length === 0) return "空对话";
  const last = messages[messages.length - 1];
  return last.content.slice(0, 40) + (last.content.length > 40 ? "..." : "");
}

type ConversationSidebarProps = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onClose?: () => void;
  isMobile?: boolean;
};

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onCreate,
  onClose,
  isMobile,
}: ConversationSidebarProps) {
  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Campus AI</h2>
          {isMobile && (
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 active:scale-95"
              onClick={onClose}
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">对话记录</p>
      </div>

      {/* New conversation button */}
      <div className="shrink-0 px-3 pb-2">
        <button
          className="liquid-soft flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition active:scale-[0.98] hover:shadow-md"
          onClick={onCreate}
          type="button"
        >
          <Plus size={17} />
          新对话
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {conversations.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-slate-400">
            暂无对话记录
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {conversations.map((conv) => {
              const isActive = conv.id === activeId;
              return (
                <div className="group relative" key={conv.id}>
                  <button
                    className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition active:scale-[0.98] ${
                      isActive
                        ? "bg-white/60 shadow-sm"
                        : "hover:bg-white/30"
                    }`}
                    onClick={() => onSelect(conv.id)}
                    type="button"
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isActive
                          ? "bg-slate-200/70 text-slate-700"
                          : "bg-white/40 text-slate-500"
                      }`}
                    >
                      <MessageCircle size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-sm font-semibold ${
                            isActive ? "text-slate-900" : "text-slate-700"
                          }`}
                        >
                          {conv.title}
                        </p>
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {formatTime(conv.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {getPreview(conv.messages)}
                      </p>
                    </div>
                  </button>
                  <button
                    className="absolute right-1 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:text-red-500 hover:bg-white/60 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    title="删除对话"
                    type="button"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40 flex">
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-72 max-w-[85vw] h-full liquid-glass rounded-r-[28px] border-l-0">
          {sidebar}
        </div>
      </div>
    );
  }

  return (
    <aside className="liquid-glass hidden h-full w-72 shrink-0 flex-col rounded-l-[28px] lg:flex">
      {sidebar}
    </aside>
  );
}

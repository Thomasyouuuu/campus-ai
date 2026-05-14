import { Settings, Trash2 } from "lucide-react";
import type { AgentMode } from "../utils/agentModes";
import { ModeSwitcher } from "./ModeSwitcher";

type ChatHeaderProps = {
  activeMode: AgentMode;
  allModes: AgentMode[];
  hasApiKey: boolean;
  hasMessages: boolean;
  onSwitchMode: (mode: AgentMode) => void;
  onCreateAgent: () => void;
  onEditAgent: (mode: AgentMode) => void;
  onOpenSettings: () => void;
  onClearHistory: () => void;
};

export function ChatHeader({
  activeMode,
  allModes,
  hasApiKey,
  hasMessages,
  onSwitchMode,
  onCreateAgent,
  onEditAgent,
  onOpenSettings,
  onClearHistory,
}: ChatHeaderProps) {
  return (
    <header className="liquid-glass shrink-0 mx-4 mt-4 rounded-[24px] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <ModeSwitcher
            activeMode={activeMode}
            allModes={allModes}
            onCreate={onCreateAgent}
            onEdit={onEditAgent}
            onSwitch={onSwitchMode}
          />
          <div className="flex items-center gap-1.5 mt-0.5 ml-1">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                hasApiKey ? "bg-emerald-400" : "bg-slate-300"
              }`}
            />
            <span className="text-[11px] text-slate-500">
              {hasApiKey ? "已连接" : "未配置 API"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {hasMessages && (
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600 active:scale-95"
              onClick={onClearHistory}
              title="清空对话"
              type="button"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600 active:scale-95"
            onClick={onOpenSettings}
            title="API 设置"
            type="button"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

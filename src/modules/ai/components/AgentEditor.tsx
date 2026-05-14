"use client";

import { X, Trash2 } from "lucide-react";
import { useCallback, useState, type FormEvent } from "react";
import type { CustomAgentData } from "../utils/agentModes";
import { availableColors, availableIcons } from "../utils/agentModes";

type AgentEditorProps = {
  mode: CustomAgentData | null; // null = create new, passed object = edit
  onSave: (data: CustomAgentData) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
};

export function AgentEditor({
  mode,
  onSave,
  onDelete,
  onClose,
}: AgentEditorProps) {
  const isEditing = mode !== null;

  const [label, setLabel] = useState(mode?.label ?? "");
  const [desc, setDesc] = useState(mode?.desc ?? "");
  const [iconName, setIconName] = useState(mode?.iconName ?? "Sparkles");
  const [color, setColor] = useState(mode?.color ?? "text-teal-600");
  const [systemPrompt, setSystemPrompt] = useState(
    mode?.systemPrompt ??
      `## 当前模式：自定义
你是 Campus AI 的自定义助手。你可以：
- 回答各种问题
- 根据你的专业领域提供帮助`,
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!label.trim()) return;
      onSave({
        id: mode?.id ?? crypto.randomUUID(),
        label: label.trim(),
        desc: desc.trim(),
        iconName,
        color,
        systemPrompt: systemPrompt.trim(),
      });
    },
    [label, desc, iconName, color, systemPrompt, mode, onSave],
  );

  const handleDelete = useCallback(() => {
    if (mode?.id && onDelete) {
      onDelete(mode.id);
      onClose();
    }
  }, [mode, onDelete, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <form
        className="liquid-glass flex w-full max-w-md flex-col gap-4 rounded-[28px] p-6 max-h-[90dvh] overflow-y-auto"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? "编辑 Agent" : "创建 Agent"}
          </h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 active:scale-95"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-500" htmlFor="agent-name">
            名称
          </label>
          <input
            autoFocus
            className="field-input h-11"
            id="agent-name"
            onChange={(e) => setLabel(e.target.value)}
            placeholder="给 Agent 起个名字"
            required
            type="text"
            value={label}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-500" htmlFor="agent-desc">
            描述
          </label>
          <input
            className="field-input h-11"
            id="agent-desc"
            onChange={(e) => setDesc(e.target.value)}
            placeholder="一句话描述 Agent 的功能"
            type="text"
            value={desc}
          />
        </div>

        {/* Icon picker */}
        <div>
          <label className="block mb-2 text-xs font-semibold text-slate-500">
            图标
          </label>
          <div className="grid grid-cols-8 gap-1.5">
            {availableIcons.map(({ name, icon: Icon }) => (
              <button
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition active:scale-90 ${
                  iconName === name
                    ? "bg-slate-200/70 ring-2 ring-slate-300"
                    : "hover:bg-white/40"
                }`}
                key={name}
                onClick={() => setIconName(name)}
                title={name}
                type="button"
              >
                <Icon className={color} size={17} />
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block mb-2 text-xs font-semibold text-slate-500">
            颜色
          </label>
          <div className="flex gap-1.5">
            {availableColors.map((c) => (
              <button
                className={`relative h-8 w-8 shrink-0 rounded-full transition active:scale-90 ${
                  color === c.class
                    ? "ring-2 ring-slate-300 ring-offset-2 scale-110"
                    : ""
                }`}
                key={c.name}
                onClick={() => setColor(c.class)}
                title={c.name}
                type="button"
                style={{
                  background: `linear-gradient(135deg, ${c.hexSoft} 0%, ${c.hex} 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 6px rgba(0,0,0,0.12)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-500" htmlFor="agent-prompt">
            系统提示词
          </label>
          <textarea
            className="field-input min-h-[120px] resize-y py-3"
            id="agent-prompt"
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="用 Markdown 编写系统提示词..."
            value={systemPrompt}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            提示词会附加到基础 Campus AI 提示词之后，共用日期和日程识别规则
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            className="flex-1 rounded-full bg-slate-950 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
            type="submit"
          >
            {isEditing ? "保存" : "创建"}
          </button>
          {isEditing && onDelete && (
            <button
              className="liquid-soft flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-red-500 transition active:scale-95"
              onClick={handleDelete}
              type="button"
              title="删除"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

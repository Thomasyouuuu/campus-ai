"use client";

import { ChevronDown, Pencil, Plus } from "lucide-react";
import { useCallback, useRef, useState, type MouseEvent } from "react";
import { builtinModes, type AgentMode } from "../utils/agentModes";

type ModeSwitcherProps = {
  activeMode: AgentMode;
  allModes: AgentMode[];
  onSwitch: (mode: AgentMode) => void;
  onCreate: () => void;
  onEdit: (mode: AgentMode) => void;
};

export function ModeSwitcher({
  activeMode,
  allModes,
  onSwitch,
  onCreate,
  onEdit,
}: ModeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const handleOpen = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  const handleSelect = useCallback(
    (mode: AgentMode, e: MouseEvent) => {
      e.stopPropagation();
      if (mode.id !== activeMode.id) {
        onSwitch(mode);
      }
      setOpen(false);
    },
    [activeMode.id, onSwitch],
  );

  const handleEdit = useCallback(
    (mode: AgentMode, e: MouseEvent) => {
      e.stopPropagation();
      onEdit(mode);
      setOpen(false);
    },
    [onEdit],
  );

  const handleCreate = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onCreate();
      setOpen(false);
    },
    [onCreate],
  );

  const ActiveIcon = activeMode.icon;
  const customModes = allModes.filter((m) => !m.isBuiltin);
  const builtinIds = new Set(builtinModes.map((m) => m.id));
  const visibleBuiltins = allModes.filter((m) => builtinIds.has(m.id));

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 rounded-2xl px-2 py-1 -ml-2 transition hover:bg-white/30 active:scale-[0.98]"
        onClick={handleOpen}
        onBlur={handleClose}
        type="button"
      >
        <ActiveIcon className={`h-5 w-5 ${activeMode.color}`} size={20} />
        <span className="text-base font-semibold text-slate-900">
          {activeMode.label}
        </span>
        <ChevronDown
          className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
          size={16}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          className="liquid-glass absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl p-2 shadow-2xl"
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Built-in section */}
          {visibleBuiltins.map((mode) => {
            const Icon = mode.icon;
            const isActive = mode.id === activeMode.id;

            return (
              <button
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition active:scale-[0.98] ${
                  isActive ? "bg-slate-100/60" : "hover:bg-white/40"
                }`}
                key={mode.id}
                onClick={(e) => handleSelect(mode, e)}
                role="option"
                aria-selected={isActive}
                type="button"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isActive ? "bg-white/70" : "bg-white/30"
                  }`}
                >
                  <Icon className={mode.color} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {mode.label}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {mode.desc}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Custom section separator */}
          {customModes.length > 0 && (
            <div className="my-1 border-t border-slate-200/60" />
          )}

          {/* Custom modes */}
          {customModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = mode.id === activeMode.id;

            return (
              <div className="group relative flex items-center" key={mode.id}>
                <button
                  className={`flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition active:scale-[0.98] ${
                    isActive ? "bg-slate-100/60" : "hover:bg-white/40"
                  }`}
                  onClick={(e) => handleSelect(mode, e)}
                  role="option"
                  aria-selected={isActive}
                  type="button"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isActive ? "bg-white/70" : "bg-white/30"
                    }`}
                  >
                    <Icon className={mode.color} size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {mode.label}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {mode.desc}
                    </p>
                  </div>
                </button>
                <button
                  className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:text-slate-600 hover:bg-white/50 group-hover:opacity-100"
                  onClick={(e) => handleEdit(mode, e)}
                  title="编辑"
                  type="button"
                >
                  <Pencil size={13} />
                </button>
              </div>
            );
          })}

          {/* Create button */}
          <button
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-white/40 active:scale-[0.98]"
            onClick={handleCreate}
            type="button"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/30">
              <Plus size={18} />
            </span>
            创建自定义 Agent
          </button>
        </div>
      )}
    </div>
  );
}

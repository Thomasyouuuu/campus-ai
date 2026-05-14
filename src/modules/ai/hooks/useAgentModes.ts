"use client";

import { useCallback, useRef, useState } from "react";
import type { AgentMode, CustomAgentData } from "../utils/agentModes";
import {
  defaultMode,
  getAllModes,
  loadCustomModes,
  resolveCustomMode,
  saveCustomModes,
} from "../utils/agentModes";

export function useAgentModes() {
  const [customModes, setCustomModes] = useState<CustomAgentData[]>(
    () => loadCustomModes(),
  );
  const [activeMode, setActiveMode] = useState<AgentMode>(defaultMode);
  const activeModeRef = useRef<AgentMode>(defaultMode);

  const allModes = getAllModes(customModes);

  const switchMode = useCallback(
    (mode: AgentMode) => {
      setActiveMode(mode);
      activeModeRef.current = mode;
    },
    [],
  );

  const addCustomMode = useCallback(
    (data: CustomAgentData) => {
      setCustomModes((prev) => {
        const next = [...prev, data];
        saveCustomModes(next);
        return next;
      });
      // Auto-switch to new mode
      const mode = resolveCustomMode(data);
      setActiveMode(mode);
      activeModeRef.current = mode;
    },
    [],
  );

  const editCustomMode = useCallback(
    (data: CustomAgentData) => {
      setCustomModes((prev) => {
        const next = prev.map((m) => (m.id === data.id ? data : m));
        saveCustomModes(next);
        return next;
      });
      // Update active mode if currently using this one
      setActiveMode((current) => {
        if (current.id === data.id && !current.isBuiltin) {
          const resolved = resolveCustomMode(data);
          activeModeRef.current = resolved;
          return resolved;
        }
        return current;
      });
    },
    [],
  );

  const deleteCustomMode = useCallback(
    (id: string) => {
      setCustomModes((prev) => {
        const next = prev.filter((m) => m.id !== id);
        saveCustomModes(next);
        return next;
      });
      // Switch to default if deleting the active mode
      setActiveMode((current) => {
        if (current.id === id) {
          activeModeRef.current = defaultMode;
          return defaultMode;
        }
        return current;
      });
    },
    [],
  );

  return {
    activeMode,
    activeModeRef,
    allModes,
    customModes,
    switchMode,
    addCustomMode,
    editCustomMode,
    deleteCustomMode,
  };
}

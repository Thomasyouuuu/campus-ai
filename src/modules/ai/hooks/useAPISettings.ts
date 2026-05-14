"use client";

import { useCallback, useState } from "react";
import type { APISettings } from "../types";
import { DEFAULT_PROVIDERS, STORAGE_KEYS } from "../types";

function loadSettings(): APISettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.apiSettings);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSettings(settings: APISettings): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.apiSettings,
      JSON.stringify(settings),
    );
  } catch {
    // storage full or unavailable
  }
}

const DEFAULT_SETTINGS: APISettings = {
  baseUrl: DEFAULT_PROVIDERS.deepseek.baseUrl,
  apiKey: "",
  model: DEFAULT_PROVIDERS.deepseek.model,
};

export function useAPISettings() {
  const [settings, setSettings] = useState<APISettings | null>(
    () => loadSettings() ?? DEFAULT_SETTINGS,
  );

  const updateSettings = useCallback(
    (next: APISettings) => {
      setSettings(next);
      saveSettings(next);
    },
    [],
  );

  const clearSettings = useCallback(() => {
    setSettings(null);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.apiSettings);
    } catch {
      // ignore
    }
  }, []);

  return { settings, updateSettings, clearSettings };
}

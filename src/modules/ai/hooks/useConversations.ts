"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation, ChatMessage } from "../types";
import { STORAGE_KEYS } from "../types";
import { defaultMode } from "../utils/agentModes";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.conversations);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted data
  }

  // Migrate old chat history
  try {
    const oldRaw = window.localStorage.getItem(STORAGE_KEYS.chatHistory);
    if (oldRaw) {
      const oldMessages: ChatMessage[] = JSON.parse(oldRaw);
      window.localStorage.removeItem(STORAGE_KEYS.chatHistory);
      if (oldMessages.length > 0) {
        const firstUser = oldMessages.find((m) => m.role === "user");
        const title = firstUser
          ? firstUser.content.slice(0, 30)
          : "历史对话";
        const migrated: Conversation = {
          id: crypto.randomUUID(),
          title,
          modeId: defaultMode.id,
          messages: oldMessages,
          createdAt: oldMessages[0]?.timestamp ?? Date.now(),
          updatedAt: Date.now(),
        };
        saveConversations([migrated]);
        return [migrated];
      }
    }
  } catch {
    // migration failed
  }

  return [];
}

function saveConversations(convs: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.conversations,
      JSON.stringify(convs),
    );
  } catch {
    // ignore
  }
}

function persistActiveId(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) {
      window.localStorage.setItem(STORAGE_KEYS.activeConversationId, id);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.activeConversationId);
    }
  } catch {
    // ignore
  }
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(
    () => loadConversations(),
  );
  const [activeId, setActiveId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const convs = loadConversations();
      const saved =
        window.localStorage.getItem(STORAGE_KEYS.activeConversationId);
      if (saved && convs.some((c) => c.id === saved)) return saved;
      return convs[0]?.id ?? null;
    } catch {
      return null;
    }
  });
  const isHydrated = useRef(false);

  // Persist conversations on change
  useEffect(() => {
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }
    saveConversations(conversations);
  }, [conversations]);

  // Persist activeId on change
  useEffect(() => {
    if (!isHydrated.current) return;
    persistActiveId(activeId);
  }, [activeId]);

  const activeConversation = activeId
    ? conversations.find((c) => c.id === activeId) ?? null
    : null;

  const createConversation = useCallback(
    (title?: string): Conversation => {
      const conv: Conversation = {
        id: crypto.randomUUID(),
        title: title || "新对话",
        modeId: defaultMode.id,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
      return conv;
    },
    [],
  );

  const updateConversation = useCallback(
    (
      id: string,
      updater: (conv: Conversation) => Conversation,
    ) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? updater(c) : c)),
      );
    },
    [],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeId === id) {
          const newActive = next[0] ?? null;
          setActiveId(newActive?.id ?? null);
        }
        return next;
      });
    },
    [activeId],
  );

  const switchConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return {
    conversations,
    activeConversation,
    activeId,
    createConversation,
    updateConversation,
    deleteConversation,
    switchConversation,
  };
}

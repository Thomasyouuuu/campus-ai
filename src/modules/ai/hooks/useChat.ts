"use client";

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import type { ChatMessage } from "../types";
import { STORAGE_KEYS } from "../types";
import { buildSystemPrompt } from "../utils/systemPrompt";
import { parseAIResponse } from "../utils/parser";
import { addScheduleItem } from "../utils/schedule";
import { defaultMode, type AgentMode } from "../utils/agentModes";

export function useChat(
  messages: ChatMessage[],
  onMessagesChange: (messages: ChatMessage[]) => void,
  modeRef?: MutableRefObject<AgentMode>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const internalModeRef = useRef<AgentMode>(defaultMode);
  const activeModeRef = modeRef ?? internalModeRef;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const getAPISettings = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.apiSettings);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const settings = getAPISettings();
      if (!settings?.apiKey) {
        setError("请先配置 API Key");
        return;
      }

      setError(null);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      const currentMessages = messagesRef.current;
      const withUser = [...currentMessages, userMessage];
      onMessagesChange(withUser);
      setIsLoading(true);

      try {
        const systemPrompt = buildSystemPrompt(activeModeRef.current);

        const recentMessages = currentMessages.slice(-20);
        const apiMessages = [
          { role: "system", content: systemPrompt },
          ...recentMessages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user" as const, content: trimmed },
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            apiKey: settings.apiKey,
            baseUrl: settings.baseUrl,
            model: settings.model,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          const msg =
            response.status === 401
              ? "API Key 无效，请在设置中更新"
              : response.status === 429
                ? "请求过于频繁，请稍后再试"
                : body.error || `请求失败 (${response.status})`;
          setError(msg);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        const rawText =
          data.choices?.[0]?.message?.content || data.message?.content || "";

        const { displayText, scheduleAction } = parseAIResponse(rawText);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: displayText,
          timestamp: Date.now(),
          scheduleAction,
          scheduleConfirmed: false,
        };

        onMessagesChange([...withUser, assistantMessage]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("请求超时，请稍后再试");
        } else {
          setError("网络连接失败，请检查网络后重试");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getAPISettings, onMessagesChange, activeModeRef],
  );

  const confirmSchedule = useCallback(
    (messageId: string) => {
      const updated = messagesRef.current.map((m) => {
        if (m.id !== messageId || !m.scheduleAction) return m;
        addScheduleItem(m.scheduleAction);
        return { ...m, scheduleConfirmed: true };
      });
      onMessagesChange(updated);
    },
    [onMessagesChange],
  );

  const dismissSchedule = useCallback(
    (messageId: string) => {
      const updated = messagesRef.current.map((m) => {
        if (m.id !== messageId) return m;
        return { ...m, scheduleAction: null };
      });
      onMessagesChange(updated);
    },
    [onMessagesChange],
  );

  return {
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    confirmSchedule,
    dismissSchedule,
    setError,
  };
}

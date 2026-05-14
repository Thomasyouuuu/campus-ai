"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { AppShell } from "@/components/layout";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { APISettingsDialog } from "./components/APISettingsDialog";
import { AgentEditor } from "./components/AgentEditor";
import { ConversationSidebar } from "./components/ConversationSidebar";
import { useChat } from "./hooks/useChat";
import { useAPISettings } from "./hooks/useAPISettings";
import { useAgentModes } from "./hooks/useAgentModes";
import { useConversations } from "./hooks/useConversations";
import type { ChatMessage } from "./types";
import type { AgentMode, CustomAgentData } from "./utils/agentModes";

export function ChatPage() {
  const {
    activeMode,
    activeModeRef,
    allModes,
    customModes,
    switchMode,
    addCustomMode,
    editCustomMode,
    deleteCustomMode,
  } = useAgentModes();

  const {
    conversations,
    activeConversation,
    activeId,
    createConversation,
    updateConversation,
    deleteConversation,
    switchConversation,
  } = useConversations();

  // Auto-create a conversation if none exists
  const hasAutoCreated = useRef(false);
  useEffect(() => {
    if (hasAutoCreated.current) return;
    if (conversations.length === 0) {
      hasAutoCreated.current = true;
      createConversation();
    }
  }, [conversations.length, createConversation]);

  // Build a stable callback for updating messages in the active conversation
  const handleMessagesChange = useCallback(
    (newMessages: ChatMessage[]) => {
      if (!activeId) return;
      updateConversation(activeId, (conv) => {
        // Auto-title: use first user message
        let title = conv.title;
        if (title === "新对话" && newMessages.length > 0) {
          const firstUser = newMessages.find((m) => m.role === "user");
          if (firstUser) {
            title = firstUser.content.slice(0, 30);
          }
        }
        return {
          ...conv,
          title,
          messages: newMessages,
          modeId: activeModeRef.current.id,
          updatedAt: Date.now(),
        };
      });
    },
    [activeId, updateConversation, activeModeRef],
  );

  const messages = activeConversation?.messages ?? [];

  const {
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    confirmSchedule,
    dismissSchedule,
    setError,
  } = useChat(messages, handleMessagesChange, activeModeRef);

  const { settings, updateSettings } = useAPISettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Agent editor state
  const [editorMode, setEditorMode] = useState<AgentMode | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const hasApiKey = Boolean(settings?.apiKey);

  const handleSuggestionSelect = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage],
  );

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
    setError(null);
  }, [setError]);

  const handleSaveSettings = useCallback(
    (s: typeof settings) => {
      if (s) {
        updateSettings(s);
      }
    },
    [updateSettings],
  );

  // Mode switch: also update the conversation's modeId
  const handleSwitchMode = useCallback(
    (mode: AgentMode) => {
      switchMode(mode);
      if (activeId) {
        updateConversation(activeId, (conv) => ({
          ...conv,
          modeId: mode.id,
        }));
      }
    },
    [switchMode, activeId, updateConversation],
  );

  // New conversation
  const handleCreateConversation = useCallback(() => {
    createConversation();
  }, [createConversation]);

  // Switch conversation: also restore the mode
  const handleSwitchConversation = useCallback(
    (id: string) => {
      switchConversation(id);
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        const mode =
          allModes.find((m) => m.id === conv.modeId) ?? allModes[0];
        switchMode(mode);
      }
    },
    [switchConversation, conversations, allModes, switchMode],
  );

  // Agent editor
  const handleCreateAgent = useCallback(() => {
    setEditorMode(null);
    setShowEditor(true);
  }, []);

  const handleEditAgent = useCallback((mode: AgentMode) => {
    setEditorMode(mode);
    setShowEditor(true);
  }, []);

  const handleSaveAgent = useCallback(
    (data: CustomAgentData) => {
      const existing = customModes.find((m) => m.id === data.id);
      if (existing) {
        editCustomMode(data);
      } else {
        addCustomMode(data);
      }
    },
    [customModes, editCustomMode, addCustomMode],
  );

  const handleDeleteAgent = useCallback(
    (id: string) => {
      deleteCustomMode(id);
    },
    [deleteCustomMode],
  );

  const editorInitialData: CustomAgentData | null = editorMode
    ? (customModes.find((m) => m.id === editorMode.id) ?? {
        id: editorMode.id,
        label: editorMode.label,
        desc: editorMode.desc,
        iconName: editorMode.iconName,
        color: editorMode.color,
        systemPrompt: editorMode.systemPrompt,
      })
    : null;

  return (
    <AppShell contentClassName="gap-0 pt-0 !pb-0 flex flex-col flex-1 lg:px-4 lg:pt-4 lg:pb-[calc(var(--bottom-tab-height)+var(--safe-bottom)+1.25rem)]">
      {/* Full-height flex container */}
      <div className="flex w-full flex-1 min-h-0 lg:gap-0">
        {/* Desktop sidebar */}
        <ConversationSidebar
          activeId={activeId}
          conversations={conversations}
          onCreate={handleCreateConversation}
          onDelete={deleteConversation}
          onSelect={handleSwitchConversation}
        />

        {/* Mobile sidebar overlay */}
        {showSidebar && (
          <ConversationSidebar
            activeId={activeId}
            conversations={conversations}
            isMobile
            onClose={() => setShowSidebar(false)}
            onCreate={handleCreateConversation}
            onDelete={deleteConversation}
            onSelect={(id) => {
              handleSwitchConversation(id);
              setShowSidebar(false);
            }}
          />
        )}

        {/* Main chat area */}
        <div className="flex min-w-0 flex-1 flex-col lg:rounded-r-[28px] lg:border lg:border-l-0 lg:border-white/60 lg:bg-white/10 lg:backdrop-blur-xl">
          <ChatHeader
            activeMode={activeMode}
            allModes={allModes}
            hasApiKey={hasApiKey}
            hasMessages={messages.length > 0}
            onClearHistory={handleCreateConversation}
            onCreateAgent={handleCreateAgent}
            onEditAgent={handleEditAgent}
            onOpenSettings={handleOpenSettings}
            onSwitchMode={handleSwitchMode}
            onToggleSidebar={() => setShowSidebar(true)}
          />

          {error && (
            <div className="mx-4 mt-3 shrink-0">
              <div className="liquid-soft rounded-2xl px-4 py-3 text-center text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          <ChatMessages
            hasApiKey={hasApiKey}
            isLoading={isLoading}
            messages={messages}
            messagesEndRef={messagesEndRef}
            onConfirmSchedule={confirmSchedule}
            onDismissSchedule={dismissSchedule}
            onOpenSettings={handleOpenSettings}
            onSuggestionSelect={handleSuggestionSelect}
          />

          <ChatInput
            hasApiKey={hasApiKey}
            isLoading={isLoading}
            onOpenSettings={handleOpenSettings}
            onSubmit={sendMessage}
          />
        </div>
      </div>

      {showSettings && (
        <APISettingsDialog
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
          settings={settings}
        />
      )}

      {showEditor && (
        <AgentEditor
          mode={editorInitialData}
          onClose={() => setShowEditor(false)}
          onDelete={
            editorMode && !editorMode.isBuiltin ? handleDeleteAgent : undefined
          }
          onSave={handleSaveAgent}
        />
      )}
    </AppShell>
  );
}

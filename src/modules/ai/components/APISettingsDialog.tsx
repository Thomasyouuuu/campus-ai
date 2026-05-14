"use client";

import { X, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useCallback, useState } from "react";
import type { APISettings } from "../types";
import { DEFAULT_PROVIDERS } from "../types";

const PROVIDER_KEYS_URLS: Record<string, string> = {
  deepseek: "https://platform.deepseek.com/api_keys",
  openai: "https://platform.openai.com/api-keys",
  doubao: "https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey",
  glm: "https://open.bigmodel.cn/usercenter/apikeys",
};

type APISettingsDialogProps = {
  settings: APISettings | null;
  onSave: (settings: APISettings) => void;
  onClose: () => void;
};

export function APISettingsDialog({
  settings,
  onSave,
  onClose,
}: APISettingsDialogProps) {
  const [baseUrl, setBaseUrl] = useState(settings?.baseUrl || "");
  const [apiKey, setApiKey] = useState(settings?.apiKey || "");
  const [model, setModel] = useState(settings?.model || "");
  const [showKey, setShowKey] = useState(false);

  const handleSave = useCallback(() => {
    onSave({
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim(),
    });
    onClose();
  }, [baseUrl, apiKey, model, onSave, onClose]);

  const fillPreset = useCallback(
    (preset: "deepseek" | "openai") => {
      const p = DEFAULT_PROVIDERS[preset];
      setBaseUrl(p.baseUrl);
      setModel(p.model);
    },
    [],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="liquid-glass w-full max-w-md rounded-[28px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">API 设置</h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 active:scale-95"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Provider presets */}
          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-500">
              快速预设
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className="liquid-soft rounded-full px-4 py-1.5 text-xs font-medium text-slate-700 transition active:scale-95"
                onClick={() => fillPreset("deepseek")}
                type="button"
              >
                DeepSeek
              </button>
              <button
                className="liquid-soft rounded-full px-4 py-1.5 text-xs font-medium text-slate-700 transition active:scale-95"
                onClick={() => fillPreset("openai")}
                type="button"
              >
                OpenAI
              </button>
              <button
                className="liquid-soft rounded-full px-4 py-1.5 text-xs font-medium text-slate-700 transition active:scale-95"
                onClick={() => {
                  setBaseUrl("https://ark.cn-beijing.volces.com/api/v3");
                  setModel("doubao-pro-32k");
                }}
                type="button"
              >
                豆包
              </button>
              <button
                className="liquid-soft rounded-full px-4 py-1.5 text-xs font-medium text-slate-700 transition active:scale-95"
                onClick={() => {
                  setBaseUrl("https://open.bigmodel.cn/api/paas/v4");
                  setModel("glm-4");
                }}
                type="button"
              >
                智谱 GLM
              </button>
            </div>
          </div>

          {/* Get API Key links */}
          <div className="liquid-soft rounded-2xl px-4 py-3">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              还没有 Key？
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <a
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-teal-600 transition hover:bg-white/40"
                href={PROVIDER_KEYS_URLS.deepseek}
                rel="noopener noreferrer"
                target="_blank"
              >
                DeepSeek <ExternalLink size={11} />
              </a>
              <a
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-indigo-600 transition hover:bg-white/40"
                href={PROVIDER_KEYS_URLS.doubao}
                rel="noopener noreferrer"
                target="_blank"
              >
                豆包 <ExternalLink size={11} />
              </a>
              <a
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-emerald-600 transition hover:bg-white/40"
                href={PROVIDER_KEYS_URLS.openai}
                rel="noopener noreferrer"
                target="_blank"
              >
                OpenAI <ExternalLink size={11} />
              </a>
              <a
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-blue-600 transition hover:bg-white/40"
                href={PROVIDER_KEYS_URLS.glm}
                rel="noopener noreferrer"
                target="_blank"
              >
                智谱 <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Base URL */}
          <div>
            <label
              className="block mb-1.5 text-xs font-semibold text-slate-500"
              htmlFor="api-base-url"
            >
              Base URL
            </label>
            <input
              className="field-input h-11"
              id="api-base-url"
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.deepseek.com/v1"
              type="text"
              value={baseUrl}
            />
          </div>

          {/* API Key */}
          <div>
            <label
              className="block mb-1.5 text-xs font-semibold text-slate-500"
              htmlFor="api-key"
            >
              API Key
            </label>
            <div className="relative">
              <input
                autoComplete="off"
                className="field-input h-11 pr-10"
                id="api-key"
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                type={showKey ? "text" : "password"}
                value={apiKey}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() => setShowKey((v) => !v)}
                type="button"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Model */}
          <div>
            <label
              className="block mb-1.5 text-xs font-semibold text-slate-500"
              htmlFor="api-model"
            >
              Model
            </label>
            <input
              className="field-input h-11"
              id="api-model"
              onChange={(e) => setModel(e.target.value)}
              placeholder="deepseek-chat"
              type="text"
              value={model}
            />
          </div>

          <button
            className="mt-2 w-full rounded-full bg-slate-950 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
            onClick={handleSave}
            type="button"
          >
            保存
          </button>

          <p className="text-center text-[11px] text-slate-400">
            API Key 仅保存在浏览器本地，通过服务端代理请求
          </p>
        </div>
      </div>
    </div>
  );
}

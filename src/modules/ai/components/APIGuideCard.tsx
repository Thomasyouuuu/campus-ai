"use client";

import { ArrowUpRight, Key, Sparkles } from "lucide-react";

type Provider = {
  name: string;
  desc: string;
  keysUrl: string;
  bgClass: string;
  textClass: string;
};

const providers: Provider[] = [
  {
    name: "DeepSeek",
    desc: "性价比高，中文能力强",
    keysUrl: "https://platform.deepseek.com/api_keys",
    bgClass: "bg-teal-100/60",
    textClass: "text-teal-600",
  },
  {
    name: "豆包 (Doubao)",
    desc: "字节跳动出品，校园场景友好",
    keysUrl: "https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey",
    bgClass: "bg-indigo-100/60",
    textClass: "text-indigo-600",
  },
  {
    name: "OpenAI",
    desc: "GPT 系列模型，综合能力强",
    keysUrl: "https://platform.openai.com/api-keys",
    bgClass: "bg-emerald-100/60",
    textClass: "text-emerald-600",
  },
  {
    name: "智谱 (GLM)",
    desc: "清华系，国产大模型",
    keysUrl: "https://open.bigmodel.cn/usercenter/apikeys",
    bgClass: "bg-blue-100/60",
    textClass: "text-blue-600",
  },
];

type APIGuideCardProps = {
  onOpenSettings: () => void;
};

export function APIGuideCard({ onOpenSettings }: APIGuideCardProps) {
  return (
    <div className="flex flex-col gap-6 px-2 pt-6">
      {/* Hero */}
      <div className="liquid-glass flex flex-col items-center gap-3 rounded-[28px] px-5 py-8 text-center">
        <span className="liquid-orb flex h-16 w-16 items-center justify-center rounded-full text-teal-600">
          <Sparkles size={30} />
        </span>
        <h2 className="text-xl font-semibold text-slate-900">
          配置 AI 助手
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-slate-500">
          选择一个 AI 服务商，获取 API Key 后粘贴到设置中，<br />
          即可开始使用校园 AI 助手。
        </p>
      </div>

      {/* Provider list */}
      <div className="grid gap-3">
        <p className="text-xs font-semibold text-slate-400 px-1">
          选择服务商 &rarr; 获取 Key
        </p>
        {providers.map((p) => (
          <a
            className={`liquid-soft group flex items-center gap-4 rounded-[22px] px-4 py-3.5 transition hover:-translate-y-0.5 hover:shadow-lg`}
            href={p.keysUrl}
            key={p.name}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${p.bgClass} ${p.textClass}`}
            >
              <Key size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {p.name}
              </p>
              <p className="text-xs text-slate-500">{p.desc}</p>
            </div>
            <ArrowUpRight
              className="shrink-0 text-slate-300 transition group-hover:text-slate-600"
              size={18}
            />
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        className="liquid-glass mx-auto inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-slate-900 transition active:scale-[0.98] hover:shadow-xl"
        onClick={onOpenSettings}
        type="button"
      >
        已有 Key？点此配置
      </button>

      <p className="text-center text-[11px] text-slate-400">
        Key 只保存在你的浏览器中，通过服务端代理请求，不会泄露
      </p>
    </div>
  );
}

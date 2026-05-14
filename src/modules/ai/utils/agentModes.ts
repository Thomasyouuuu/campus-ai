import {
  BookOpen,
  Brain,
  CalendarCheck,
  Camera,
  Code,
  FileText,
  FlaskConical,
  Globe,
  Heart,
  ListChecks,
  MessageCircle,
  Music,
  Pen,
  Presentation,
  RotateCcw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────

export type AgentMode = {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  iconName: string;
  color: string;
  systemPrompt: string;
  isBuiltin: boolean;
};

/** Serializable version stored in localStorage (icon as string) */
export type CustomAgentData = {
  id: string;
  label: string;
  desc: string;
  iconName: string;
  color: string;
  systemPrompt: string;
};

// ─── Icon Picker Options ─────────────────────────────

export const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: "MessageCircle", icon: MessageCircle },
  { name: "BookOpen", icon: BookOpen },
  { name: "FileText", icon: FileText },
  { name: "Presentation", icon: Presentation },
  { name: "Brain", icon: Brain },
  { name: "Sparkles", icon: Sparkles },
  { name: "Pen", icon: Pen },
  { name: "Code", icon: Code },
  { name: "FlaskConical", icon: FlaskConical },
  { name: "Music", icon: Music },
  { name: "Globe", icon: Globe },
  { name: "Heart", icon: Heart },
  { name: "Camera", icon: Camera },
  { name: "ListChecks", icon: ListChecks },
  { name: "RotateCcw", icon: RotateCcw },
  { name: "CalendarCheck", icon: CalendarCheck },
];

const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  availableIcons.map((i) => [i.name, i.icon]),
);

// ─── Color Picker Options ────────────────────────────

export const availableColors = [
  { name: "teal", class: "text-teal-600", hex: "#14b8a6", hexSoft: "#ccfbf1" },
  { name: "red", class: "text-red-600", hex: "#ef4444", hexSoft: "#fee2e2" },
  { name: "amber", class: "text-amber-600", hex: "#f59e0b", hexSoft: "#fef3c7" },
  { name: "violet", class: "text-violet-600", hex: "#8b5cf6", hexSoft: "#ede9fe" },
  { name: "blue", class: "text-blue-600", hex: "#3b82f6", hexSoft: "#dbeafe" },
  { name: "emerald", class: "text-emerald-600", hex: "#10b981", hexSoft: "#d1fae5" },
  { name: "fuchsia", class: "text-fuchsia-600", hex: "#d946ef", hexSoft: "#fae8ff" },
  { name: "orange", class: "text-orange-600", hex: "#f97316", hexSoft: "#ffedd5" },
  { name: "slate", class: "text-slate-600", hex: "#64748b", hexSoft: "#f1f5f9" },
  { name: "pink", class: "text-pink-600", hex: "#ec4899", hexSoft: "#fce7f3" },
];

// ─── Built-in Modes ──────────────────────────────────

export const builtinModes: AgentMode[] = [
  {
    id: "chat",
    label: "聊天模式",
    desc: "日常对话、校园咨询、日程安排",
    icon: MessageCircle,
    iconName: "MessageCircle",
    color: "text-teal-600",
    isBuiltin: true,
    systemPrompt: `## 当前模式：聊天模式
你是 Campus AI 的默认聊天助手。你可以：
- 回答校园相关的问题（课程、社团、活动等）
- 帮学生安排日程
- 日常闲聊和学习建议
- 当学生提到明确的时间安排时，附加日程 JSON`,
  },
  {
    id: "study",
    label: "学习助手",
    desc: "概念解释、解题引导、自测生成",
    icon: BookOpen,
    iconName: "BookOpen",
    color: "text-violet-600",
    isBuiltin: true,
    systemPrompt: `## 当前模式：学习助手
你是一位耐心的学习导师。你必须遵守以下原则：
- **绝不直接给答案**：先让学生说出自己的思路，给予提示和引导
- **拆解概念**：把复杂概念拆成定义、例子、反例和应用场景
- **苏格拉底式提问**：通过连续提问引导学生自己发现答案
- **生成自测**：当学生要求时，根据知识点生成小测验，先测理解再给反馈
- **错题分析**：分析错题背后的知识漏洞，推荐相似题巩固`,
  },
  {
    id: "ppt",
    label: "PPT 模式",
    desc: "生成演示文稿大纲、排版建议",
    icon: FileText,
    iconName: "FileText",
    color: "text-amber-600",
    isBuiltin: true,
    systemPrompt: `## 当前模式：PPT 模式
你是一位专业的演示文稿设计顾问。你可以：
- **生成大纲**：根据主题生成结构清晰的 PPT 大纲（封面、目录、内容页、总结）
- **每页内容**：为每一页提供标题、要点、配图建议
- **排版建议**：提供字体、配色、图表类型的建议
- **演讲备注**：为每一页生成演讲者备注
- **精简表达**：每页要点不超过 5 条，每条不超过 15 字，适合投影展示`,
  },
  {
    id: "preview",
    label: "预习模式",
    desc: "课前预习、知识图谱、重点提炼",
    icon: Presentation,
    iconName: "Presentation",
    color: "text-rose-600",
    isBuiltin: true,
    systemPrompt: `## 当前模式：预习模式
你是一位帮助学生做课前预习的导师。你可以：
- **知识图谱**：梳理课程的知识结构，画出前置知识的依赖关系
- **重点提炼**：提取课程的核心概念和重难点
- **预习问题**：生成 3-5 个引导性问题，让学生带着问题去听课
- **术语解释**：预先解释课程中会出现的陌生术语
- **学习目标**：明确这堂课结束后学生应该掌握什么`,
  },
];

export const defaultMode = builtinModes[0];

// ─── Custom Modes Persistence ───────────────────────

const CUSTOM_AGENTS_KEY = "campus-ai-custom-agents";

export function loadCustomModes(): CustomAgentData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_AGENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomModes(modes: CustomAgentData[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CUSTOM_AGENTS_KEY, JSON.stringify(modes));
  } catch {
    // ignore
  }
}

// ─── Resolve Custom → AgentMode ─────────────────────

export function resolveCustomMode(data: CustomAgentData): AgentMode {
  return {
    id: data.id,
    label: data.label,
    desc: data.desc,
    icon: iconMap[data.iconName] ?? Sparkles,
    iconName: data.iconName,
    color: data.color,
    systemPrompt: data.systemPrompt,
    isBuiltin: false,
  };
}

export function getAllModes(customModes: CustomAgentData[]): AgentMode[] {
  const resolved = customModes.map(resolveCustomMode);
  return [...builtinModes, ...resolved];
}

// ─── Helpers ─────────────────────────────────────────

export function findMode(
  id: string,
  customModes: CustomAgentData[],
): AgentMode | undefined {
  const builtin = builtinModes.find((m) => m.id === id);
  if (builtin) return builtin;
  const custom = customModes.find((m) => m.id === id);
  if (custom) return resolveCustomMode(custom);
  return undefined;
}

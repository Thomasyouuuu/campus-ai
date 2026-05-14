type ChatSuggestionsProps = {
  onSelect: (text: string) => void;
};

const suggestions = [
  {
    label: "帮我排自习",
    text: "帮我安排明天下午2点到4点的自习",
  },
  {
    label: "今天有什么安排",
    text: "帮我看看今天有什么安排",
  },
  {
    label: "帮我学高数",
    text: "我在学高数，帮我解释一下微积分的基本概念",
  },
  {
    label: "复习计划",
    text: "下周有考试，帮我规划一个复习计划",
  },
];

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="flex flex-col items-center gap-6 px-2 pt-8">
      <p className="text-center text-sm font-medium text-slate-500">
        我是你的校园 AI 助手，有什么可以帮你？
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            className="liquid-soft rounded-full px-4 py-2 text-sm text-slate-700 transition active:scale-95"
            key={s.label}
            onClick={() => onSelect(s.text)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

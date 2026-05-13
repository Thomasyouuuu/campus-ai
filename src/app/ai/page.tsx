import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  Camera,
  ListChecks,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { GlobalDock } from "@/components/navigation/GlobalDock";

const aiFeatures = [
  {
    description: "拍下题目后先识别知识点，再用提示把你带到下一步。",
    icon: <Camera size={22} />,
    label: "拍题学习",
  },
  {
    description: "把陌生概念拆成定义、例子、反例和课堂语境。",
    icon: <Brain size={22} />,
    label: "概念解释",
  },
  {
    description: "根据当前课程笔记生成小测，先测理解，不急着给答案。",
    icon: <ListChecks size={22} />,
    label: "生成自测",
  },
  {
    description: "把错题归因、复习时间和相似题串成复习节奏。",
    icon: <RotateCcw size={22} />,
    label: "错题回顾",
  },
  {
    description: "将课堂主题、共享笔记和 DDL 合成一张学习摘要。",
    icon: <BookOpen size={22} />,
    label: "课程总结",
  },
  {
    description: "按考试、作业和空闲时间排出可执行的学习计划。",
    icon: <CalendarCheck size={22} />,
    label: "学习计划",
  },
];

export default function AIPage() {
  return (
    <main className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-48 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        <header className="liquid-glass rounded-[34px] p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                <Sparkles size={18} />
                Skills AI
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-none tracking-normal sm:text-6xl">
                不直接给答案，先带你真正学会
              </h1>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              AI 板块会围绕课程、题目、错题和计划提供分步引导。第一版先把功能入口和学习路径铺好，后续每个能力进入独立页面。
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiFeatures.map((feature) => (
            <article
              className="liquid-soft group min-h-56 rounded-[30px] p-5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10"
              key={feature.label}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/35 text-teal-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_30px_rgba(31,47,62,0.1)] backdrop-blur-xl">
                  {feature.icon}
                </span>
                <span className="rounded-full bg-white/45 px-3 py-1 text-xs font-semibold text-slate-500 backdrop-blur-md">
                  Mock
                </span>
              </div>
              <h2 className="mt-8 text-2xl font-semibold">{feature.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                进入引导
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </div>
            </article>
          ))}
        </section>
      </section>
      <GlobalDock />
    </main>
  );
}

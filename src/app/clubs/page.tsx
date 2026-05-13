import {
  CalendarDays,
  Megaphone,
  PenLine,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { GlobalDock } from "@/components/navigation/GlobalDock";

const clubCards = [
  {
    description: "摄影社周末 Citywalk 正在报名，适合想认识同频同学的人。",
    label: "活动日历",
    meta: "本周 3 场活动",
  },
  {
    description: "辩论社、AI 社、滑板社正在开放新成员申请。",
    label: "招新信息",
    meta: "6 个社团招新",
  },
  {
    description: "先用标签记录兴趣、可用时间和想参与的活动类型。",
    label: "成员展示",
    meta: "同频推荐预留",
  },
];

export default function ClubsPage() {
  return (
    <main className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-48 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        <header className="liquid-glass rounded-[34px] p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                <UsersRound size={18} />
                Club Hub
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-none tracking-normal sm:text-6xl">
                从活动开始，慢慢找到同频的人
              </h1>
            </div>
            <div className="liquid-soft rounded-[28px] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles size={17} className="text-teal-700" />
                AI 社团助手
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                后续可生成招新文案、活动策划和报名问卷。当前先保留轻量入口。
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="paper-board rounded-[32px] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <CalendarDays size={16} />
                  社团活动
                </p>
                <h2 className="mt-2 text-3xl font-semibold">近期可参加</h2>
              </div>
              <span className="rounded-full bg-white/48 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-md">
                Mock
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {clubCards.map((card) => (
                <article className="liquid-soft rounded-[28px] p-5" key={card.label}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{card.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                    </div>
                    <span className="w-fit rounded-full bg-white/55 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {card.meta}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="liquid-glass rounded-[32px] p-5">
              <Megaphone size={22} className="text-amber-700" />
              <h2 className="mt-5 text-2xl font-semibold">招新文案</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                输入社团风格、活动亮点和目标人群，AI 生成一版不油腻的招新稿。
              </p>
            </div>
            <div className="liquid-soft rounded-[32px] p-5">
              <PenLine size={22} className="text-violet-700" />
              <h2 className="mt-5 text-2xl font-semibold">活动策划</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                将活动主题拆成流程、物料、报名表和风险提醒。
              </p>
            </div>
          </aside>
        </section>
      </section>
      <GlobalDock />
    </main>
  );
}

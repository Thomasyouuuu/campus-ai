import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  MapPin,
  Megaphone,
  PenLine,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/layout";
import { activityHighlights, clubSignals, opportunities } from "./data";

export function ClubsPage() {
  return (
    <AppShell contentClassName="gap-4 pt-4 sm:gap-5 sm:pt-5 lg:pt-8">
        <header className="liquid-glass overflow-hidden rounded-[28px] p-4 sm:rounded-[34px] sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                <UsersRound size={18} />
                Club Hub
              </p>
              <h1 className="mt-3 max-w-3xl text-[2rem] font-semibold leading-[1.04] tracking-normal sm:mt-4 sm:text-6xl">
                从活动开始，慢慢找到同频的人
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                先把本周可参加、正在招新和需要 AI 帮忙准备的社团事务放到一屏里。手机上先扫重点，再决定报名或收藏。
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-white/24 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl sm:gap-3 sm:rounded-[30px] sm:p-3">
              {clubSignals.map((signal) => (
                <div
                  className="liquid-soft rounded-[20px] px-2.5 py-3 text-center sm:rounded-[24px] sm:px-4 sm:py-5"
                  key={signal.label}
                >
                  <p className="text-2xl font-semibold leading-none sm:text-4xl">
                    {signal.value}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-slate-500 sm:text-sm">
                    {signal.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="paper-board rounded-[28px] p-3 sm:rounded-[32px] sm:p-5">
            <div className="flex items-start justify-between gap-3 px-1 sm:items-center">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <CalendarDays size={16} />
                  社团活动
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
                  近期可参加
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-white/48 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-md">
                Mock
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {activityHighlights.map((activity) => (
                <article
                  className="liquid-soft rounded-[24px] p-4 transition hover:-translate-y-0.5 sm:rounded-[28px] sm:p-5"
                  key={`${activity.club}-${activity.title}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-teal-700">
                        {activity.club}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold leading-tight sm:text-2xl">
                        {activity.title}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/55 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {activity.seats}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                    <span className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-white/38 px-3 font-semibold">
                      <CalendarDays size={15} className="text-teal-700" />
                      {activity.date}
                    </span>
                    <span className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-white/38 px-3 font-semibold">
                      <MapPin size={15} className="text-teal-700" />
                      {activity.location}
                    </span>
                    <span className="inline-flex min-h-10 items-center rounded-2xl bg-white/38 px-3 font-semibold">
                      {activity.mood}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <section className="liquid-glass rounded-[28px] p-4 sm:rounded-[32px] sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                    <Sparkles size={17} />
                    AI 社团助手
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
                    把招新和活动准备变轻
                  </h2>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/35 text-teal-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_30px_rgba(31,47,62,0.1)] backdrop-blur-xl">
                  <ClipboardList size={22} />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                后续可生成招新文案、活动策划和报名问卷。当前先把负责人最常用的入口放在右侧，移动端自动排列到活动下方。
              </p>
            </section>

            <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {opportunities.map((item) => (
                <article
                  className="liquid-soft rounded-[26px] p-4 transition hover:-translate-y-0.5 sm:rounded-[30px] sm:p-5"
                  key={item.label}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/40 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] backdrop-blur-xl">
                      {item.label === "招新信息" ? (
                        <Megaphone size={20} className="text-amber-700" />
                      ) : item.label === "活动策划" ? (
                        <PenLine size={20} className="text-violet-700" />
                      ) : (
                        <UsersRound size={20} className="text-teal-700" />
                      )}
                    </span>
                    <span className="rounded-full bg-white/45 px-3 py-1 text-xs font-semibold text-slate-500">
                      {item.metric}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.body}
                  </p>
                  <div className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950/90 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10">
                    查看入口
                    <ArrowRight size={15} />
                  </div>
                </article>
              ))}
            </section>
          </aside>
        </section>
    </AppShell>
  );
}

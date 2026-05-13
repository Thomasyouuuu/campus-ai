"use client";

import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  Sparkles,
  Tags,
  UsersRound,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { GlobalDock } from "@/components/navigation/GlobalDock";

type BoardKey = "tools" | "tag-world";

export default function Home() {
  const [board, setBoard] = useState<BoardKey>("tools");

  return (
    <main className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 pb-48 pt-5 sm:px-6 lg:px-8">
        <header className="liquid-glass overflow-hidden rounded-[34px] p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                <Sparkles size={18} />
                Campus AI · Tool-first Workspace
              </div>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-normal sm:text-6xl">
                先把校园生活整理清楚，再遇见同频的人
              </h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              首页先聚合自己的日程、课程、DDL 和社团活动。Tools 继续承载日程表、课程空间、AI 输入和任务管理。
            </p>
          </div>
        </header>

        <section className="paper-board rounded-[34px] p-3 sm:p-4">
          <div className="grid grid-cols-2 items-end gap-2">
            <BoardTab
              active={board === "tools"}
              label="Tools"
              onClick={() => setBoard("tools")}
            />
            <BoardTab
              active={board === "tag-world"}
              label="Tag World"
              onClick={() => setBoard("tag-world")}
            />
          </div>

          <div className="relative -mt-px overflow-hidden rounded-b-[30px] rounded-tr-[30px] border border-white/70 bg-[#fff8dd]/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-5">
            {board === "tools" ? (
              <ToolsBoard />
            ) : (
              <TagWorldBoard />
            )}
          </div>
        </section>
      </section>
      <GlobalDock />
    </main>
  );
}

function BoardTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`relative min-h-20 rounded-t-[30px] px-6 py-5 text-left transition ${
        active
          ? "z-10 bg-[#fff8dd] text-slate-950 shadow-[0_-10px_28px_rgba(92,72,30,0.08),inset_0_1px_0_rgba(255,255,255,0.88)]"
          : "bg-[#efe4bd]/80 text-amber-950/55 hover:text-amber-950/80"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="block text-3xl font-semibold tracking-normal sm:text-5xl">
        {label}
      </span>
    </button>
  );
}

function ToolsBoard() {
  return (
    <div className="grid gap-5">
      <QuickAccessCards />

      <section className="min-h-[720px]">
        <HomeDashboard />
      </section>
    </div>
  );
}

function QuickAccessCards() {
  const quickCards = [
    {
      body: "校历、地图、校园服务、常用入口会收在这里。",
      icon: <Wrench size={22} />,
      title: "校内工具",
    },
    {
      body: "作业、论文、考试和项目截止时间的任务中心。",
      icon: <CheckSquare size={22} />,
      title: "DDL",
    },
  ];

  return (
    <section className="grid gap-3 lg:grid-cols-2">
      {quickCards.map((card) => (
        <article
          className="liquid-soft min-h-28 rounded-[28px] p-5 transition hover:-translate-y-0.5"
          key={card.title}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-teal-700">Quick</p>
              <h2 className="mt-2 text-3xl font-semibold leading-none">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {card.body}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/32 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_30px_rgba(31,47,62,0.1)] backdrop-blur-xl">
              {card.icon}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function HomeDashboard() {
  const cards = [
    {
      accent: "bg-sky-400/70",
      icon: <BookOpen size={20} />,
      label: "课程",
      title: "3 门课程在本周活跃",
      body: "课程板块会承载 AI 总结、共享笔记、疑问和聊天室",
    },
    {
      accent: "bg-violet-400/70",
      icon: <CheckSquare size={20} />,
      label: "DDL",
      title: "论文选题草稿 · 周五前",
      body: "后续会按重要程度和剩余时间自动排序",
    },
    {
      accent: "bg-amber-400/70",
      icon: <UsersRound size={20} />,
      label: "社团活动",
      title: "摄影社周末 Citywalk",
      body: "社团活动先作为入口保留，后续接报名和活动日历",
    },
  ];

  return (
    <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="liquid-glass rounded-[32px] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">Home</p>
            <h2 className="mt-2 text-4xl font-semibold leading-none">
              今天先看这些
            </h2>
          </div>
          <span className="w-fit rounded-full bg-white/38 px-3 py-2 text-xs font-semibold text-slate-600 backdrop-blur-md">
            默认主页
          </span>
        </div>

        <MiniSchedulePreview />

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              className="liquid-soft group relative min-h-40 overflow-hidden rounded-[26px] p-4 transition hover:-translate-y-0.5"
              key={card.label}
            >
              <div
                className={`absolute inset-y-5 left-4 w-1 rounded-full ${card.accent}`}
              />
              <div className="pl-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    {card.icon}
                    {card.label}
                  </span>
                  <span className="rounded-full bg-white/40 px-2 py-1 text-[10px] font-semibold text-slate-500 backdrop-blur-md">
                    Active
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-tight">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="paper-board rounded-[32px] p-5">
        <div className="liquid-glass rounded-[28px] p-5">
          <p className="text-sm font-semibold text-teal-700">AI Brief</p>
          <h3 className="mt-3 text-3xl font-semibold leading-tight">
            把今天的课、DDL 和活动压成一张行动卡
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            首页只放你今天最需要处理的信息。AI 输入板块后续可以从这里接管总结、拆任务和生成提醒。
          </p>
        </div>
      </aside>
    </section>
  );
}

function MiniSchedulePreview() {
  const days = [
    { label: "周一", short: "一" },
    { label: "周二", short: "二" },
    { label: "周三", short: "三" },
  ];
  const hours = ["09:00", "12:00", "15:00", "18:00"];
  const events = [
    {
      day: 0,
      top: "29%",
      height: "23%",
      title: "计量经济学",
      time: "10:00 - 11:40",
      tone: "emerald",
    },
    {
      day: 1,
      top: "61%",
      height: "24%",
      title: "传播学专题",
      time: "14:00 - 15:40",
      tone: "emerald",
    },
    {
      day: 2,
      top: "76%",
      height: "18%",
      title: "和室友吃饭",
      time: "18:30 - 19:30",
      tone: "sky",
    },
  ];

  return (
    <section className="paper-board mt-6 overflow-hidden rounded-[30px] p-3">
      <div className="flex items-center justify-between px-2 pb-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
            <CalendarDays size={16} />
            自己的日程
          </p>
          <h3 className="mt-1 text-2xl font-semibold">三日缩略视图</h3>
        </div>
        <span className="rounded-full bg-white/48 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-md">
          预览
        </span>
      </div>

      <div className="grid h-[360px] grid-cols-[64px_1fr] overflow-hidden rounded-[24px] border border-white/64 bg-white/18">
        <div className="relative border-r border-white/58 bg-[#fff8dd]/42">
          {hours.map((hour, index) => (
            <span
              className="absolute left-3 text-xs font-semibold text-amber-950/38"
              key={hour}
              style={{ top: `${12 + index * 24}%` }}
            >
              {hour}
            </span>
          ))}
        </div>

        <div className="relative grid grid-cols-3">
          {days.map((day, dayIndex) => (
            <div
              className="relative border-r border-white/48 last:border-r-0"
              key={day.label}
            >
              <div className="sticky top-0 z-10 border-b border-white/52 bg-[#fff8dd]/44 px-3 py-3 backdrop-blur-md">
                <p className="text-xs font-semibold text-amber-950/44">
                  {day.label}
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {day.short}
                </p>
              </div>
              {hours.map((hour, index) => (
                <div
                  className="absolute left-0 right-0 border-t border-white/42"
                  key={`${day.label}-${hour}`}
                  style={{ top: `${22 + index * 24}%` }}
                />
              ))}
              {events
                .filter((event) => event.day === dayIndex)
                .map((event) => (
                  <article
                    className={`liquid-distort-glass left-3 right-3 rounded-[20px] p-3 ${
                      event.tone === "sky" ? "text-sky-800" : "text-emerald-800"
                    }`}
                    key={event.title}
                    style={{ top: event.top, height: event.height }}
                  >
                    <div className="glass-lens" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-semibold">
                        {event.tone === "sky" ? "安排" : "课程"}
                      </p>
                      <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight">
                        {event.title}
                      </h4>
                      <p className="mt-1 truncate text-[11px] font-semibold text-slate-600/88">
                        {event.time}
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TagWorldBoard() {
  return (
    <section className="liquid-glass grid min-h-[620px] place-items-center rounded-[32px] p-8 text-center">
      <div className="max-w-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/34 text-teal-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_18px_40px_rgba(31,47,62,0.12)] backdrop-blur-xl">
          <Tags size={30} />
        </div>
        <h2 className="mt-5 text-4xl font-semibold">Tag World</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          后续这里承载同频发现、兴趣标签、搭子需求和主页推荐。现在先和 Tools 分开，保持产品结构清楚。
        </p>
      </div>
    </section>
  );
}

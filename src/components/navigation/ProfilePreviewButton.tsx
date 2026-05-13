"use client";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  Eye,
  GraduationCap,
  MapPin,
  Pencil,
  Shield,
  Sparkles,
  Tags,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const publicSchedule = [
  { label: "计量经济学", time: "周二 10:00", visibility: "完整公开" },
  { label: "传播学专题", time: "周四 14:00", visibility: "仅忙碌" },
  { label: "摄影社 Citywalk", time: "周六 15:30", visibility: "活动可见" },
];

const tags = ["经济学", "摄影", "自习搭子", "Citywalk", "AI 工具", "小组报告"];

const profileTriggerStyle: CSSProperties = {
  position: "fixed",
  top: "1.25rem",
  right: "1.5rem",
  zIndex: 60,
  isolation: "isolate",
  border: "1px solid rgba(255, 255, 255, 0.82)",
  background:
    "radial-gradient(circle at 30% 18%, rgba(255, 255, 255, 0.62), transparent 18%), radial-gradient(circle at 70% 76%, rgba(45, 212, 191, 0.12), transparent 28%), linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.025) 58%, rgba(148, 163, 184, 0.08)), rgba(255, 255, 255, 0.028)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.86), inset 10px 14px 20px rgba(255, 255, 255, 0.16), inset -12px -16px 26px rgba(20, 184, 166, 0.06), 0 18px 44px rgba(31, 47, 62, 0.16), 0 2px 12px rgba(255, 255, 255, 0.42)",
  backdropFilter: "blur(28px) saturate(2) contrast(1.16) brightness(1.04)",
  WebkitBackdropFilter: "blur(28px) saturate(2) contrast(1.16) brightness(1.04)",
};

const profilePanelStyle: CSSProperties = {
  position: "absolute",
  isolation: "isolate",
  border: "1px solid rgba(255, 255, 255, 0.78)",
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0.12) 54%, rgba(215, 240, 255, 0.14)), rgba(255, 255, 255, 0.1)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.92), inset 0 -1px 0 rgba(255, 255, 255, 0.22), 0 24px 58px rgba(28, 48, 67, 0.14), 0 28px 80px rgba(15, 23, 42, 0.22)",
  backdropFilter: "blur(26px) saturate(1.75) contrast(1.04)",
  WebkitBackdropFilter: "blur(26px) saturate(1.75) contrast(1.04)",
};

export function ProfilePreviewButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-label="打开我的主页预览"
        className="profile-trigger flex h-14 w-14 items-center justify-center rounded-full text-base font-semibold text-slate-950 transition hover:scale-105 sm:h-16 sm:w-16"
        onClick={() => setOpen((current) => !current)}
        style={profileTriggerStyle}
        type="button"
      >
        我
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <button
            aria-label="关闭我的主页预览"
            className="absolute inset-0 cursor-default bg-slate-950/10 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            type="button"
          />

          <aside
            className="profile-panel right-3 top-3 max-h-[calc(100vh-1.5rem)] w-[min(calc(100vw-1.5rem),430px)] overflow-auto rounded-[34px] p-4 text-slate-950 sm:right-5 sm:top-5 sm:p-5"
            style={profilePanelStyle}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="liquid-orb flex h-16 w-16 items-center justify-center rounded-full text-slate-800">
                  <UserRound size={28} />
                </div>
                <div>
                  <p className="text-xl font-semibold">Thomas</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                    <GraduationCap size={15} />
                    经济学 · 大三
                  </p>
                </div>
              </div>
              <button
                aria-label="关闭"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/45 text-slate-700 transition hover:bg-white/70"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-[28px] border border-white/70 bg-white/40 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <Eye size={16} />
                  别人看到的主页
                </p>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  预览模式
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                这里展示你的公开资料、可见日程、兴趣标签和可协作状态。隐私设置会决定别人具体能看到多少。
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ProfileStat icon={<CalendarDays size={17} />} label="公开日程" value="5 条" />
              <ProfileStat icon={<UsersRound size={17} />} label="同频连接" value="12 人" />
            </div>

            <section className="mt-4 rounded-[28px] border border-white/70 bg-white/45 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays size={17} className="text-teal-700" />
                  我的公开日程
                </h2>
                <button className="rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-700" type="button">
                  管理可见性
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {publicSchedule.map((item) => (
                  <div className="rounded-2xl bg-white/55 px-3 py-3" key={item.label}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3 size={13} />
                          {item.time}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                        {item.visibility}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-[28px] border border-white/70 bg-white/45 p-4 backdrop-blur-md">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Tags size={17} className="text-violet-700" />
                我的 Tag
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-700" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-[28px] border border-white/70 bg-white/45 p-4 backdrop-blur-md">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen size={17} className="text-blue-700" />
                个人资料
              </h2>
              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                <ProfileLine icon={<MapPin size={15} />} label="常在" value="图书馆 / 经管楼 / 操场" />
                <ProfileLine icon={<Sparkles size={15} />} label="正在找" value="自习搭子、课程讨论、小组报告队友" />
                <ProfileLine icon={<Shield size={15} />} label="隐私" value="课程细节默认仅同课同学可见" />
              </div>
            </section>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button className="rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" type="button">
                <span className="inline-flex items-center gap-2">
                  <Pencil size={16} />
                  编辑主页
                </span>
              </button>
              <button className="rounded-full border border-white/70 bg-white/55 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white/75" type="button">
                预览公开版
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function ProfileStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/45 p-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-white/65 p-2 text-slate-700">{icon}</span>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProfileLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/55 px-3 py-3">
      <span className="mt-0.5 text-slate-500">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-800">{value}</p>
      </div>
    </div>
  );
}

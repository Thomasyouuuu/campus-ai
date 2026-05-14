"use client";

import {
  BookOpen,
  Bot,
  CalendarDays,
  House,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type DockItem = {
  description: string;
  href: string;
  icon: ReactNode;
  label: string;
  match: (pathname: string) => boolean;
};

const dockItems: DockItem[] = [
  {
    description: "日程、课程、DDL、社团活动",
    href: "/",
    icon: <House size={30} />,
    label: "主页",
    match: (pathname) => pathname === "/",
  },
  {
    description: "三日视图、课程、个人安排",
    href: "/schedule",
    icon: <CalendarDays size={29} />,
    label: "日程",
    match: (pathname) => pathname.startsWith("/schedule"),
  },
  {
    description: "输入、总结、破冰和规划",
    href: "/ai",
    icon: <Bot size={36} />,
    label: "AI",
    match: (pathname) => pathname.startsWith("/ai"),
  },
  {
    description: "课程空间、笔记、疑问",
    href: "/courses",
    icon: <BookOpen size={31} />,
    label: "课程",
    match: (pathname) => pathname.startsWith("/courses"),
  },
  {
    description: "社团主页、活动报名、招新",
    href: "/clubs",
    icon: <UsersRound size={31} />,
    label: "社团",
    match: (pathname) => pathname.startsWith("/clubs"),
  },
];

export function GlobalDock() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-[calc(0.55rem+env(safe-area-inset-bottom,0px))] left-1/2 z-50 w-[min(calc(100vw-0.9rem),34rem)] -translate-x-1/2 sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:w-[min(calc(100vw-2rem),56rem)]">
      <div className="liquid-dock mx-auto grid grid-cols-5 items-end gap-0.5 rounded-[30px] px-2 py-2 sm:flex sm:justify-between sm:gap-3 sm:rounded-full sm:px-5 sm:py-3">
        {dockItems.map((item) => {
          const active = item.match(pathname);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className="group flex min-w-0 flex-col items-center gap-1.5 rounded-3xl px-1 py-1 transition active:scale-[0.98] sm:flex-1 sm:gap-2 sm:px-0 sm:py-0"
              href={item.href}
              key={item.href}
              title={item.description}
            >
              <span
                className={`liquid-dock-orb flex items-center justify-center rounded-full transition duration-200 ${
                  active
                    ? "h-12 w-12 text-slate-950 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                    : "h-10 w-10 text-slate-700 sm:h-20 sm:w-20 lg:h-[86px] lg:w-[86px]"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[11px] font-semibold leading-none transition sm:text-base ${
                  active ? "text-slate-950" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

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
    <nav className="fixed bottom-4 left-1/2 z-50 w-[min(calc(100vw-1rem),56rem)] -translate-x-1/2 sm:bottom-5">
      <div className="liquid-dock mx-auto flex items-end justify-between gap-1 rounded-full px-3 py-3 sm:gap-3 sm:px-5">
        {dockItems.map((item) => {
          const active = item.match(pathname);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className="group flex min-w-0 flex-1 flex-col items-center gap-2"
              href={item.href}
              key={item.href}
              title={item.description}
            >
              <span
                className={`liquid-dock-orb flex items-center justify-center rounded-full transition duration-200 ${
                  active
                    ? "h-[86px] w-[86px] text-slate-950 sm:h-28 sm:w-28"
                    : "h-[68px] w-[68px] text-slate-700 sm:h-[86px] sm:w-[86px]"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm font-semibold transition sm:text-base ${
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

import type { ReactNode } from "react";
import { GlobalDock } from "@/components/navigation/GlobalDock";

type AppShellProps = {
  children: ReactNode;
  contentClassName?: string;
  maxWidth?: string;
};

export function AppShell({
  children,
  contentClassName = "gap-5 pt-4 sm:pt-5 lg:pt-8",
  maxWidth = "max-w-7xl",
}: AppShellProps) {
  return (
    <main className="liquid-page flex min-h-dvh flex-col overflow-hidden text-slate-950">
      <section
        className={`mobile-page-shell mobile-page-x mx-auto flex w-full flex-col ${maxWidth} ${contentClassName}`}
      >
        {children}
      </section>
      <GlobalDock />
    </main>
  );
}

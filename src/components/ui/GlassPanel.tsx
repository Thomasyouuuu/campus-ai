import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type GlassPanelProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  tone?: "glass" | "soft" | "paper";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const toneClassNames = {
  glass: "liquid-glass",
  paper: "paper-board",
  soft: "liquid-soft",
};

export function GlassPanel<T extends ElementType = "section">({
  as,
  children,
  className = "",
  tone = "glass",
  ...props
}: GlassPanelProps<T>) {
  const Component = as ?? "section";

  return (
    <Component className={`${toneClassNames[tone]} ${className}`} {...props}>
      {children}
    </Component>
  );
}

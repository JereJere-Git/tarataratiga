import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">{eyebrow}</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-.03em] sm:text-3xl">{title}</h2>{description && <p className="text-muted mt-3 text-sm leading-7">{description}</p>}</div>;
}

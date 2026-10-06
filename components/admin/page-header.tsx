import type { ReactNode } from "react";

export function PageHeader({ eyebrow = "Administrasi", title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">{eyebrow}</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>}</div>{action}</div>;
}

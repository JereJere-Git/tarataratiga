import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="glass-strong flex flex-col items-center justify-center px-6 py-12 text-center"><span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Inbox size={22} /></span><h2 className="text-lg font-bold">{title}</h2><p className="text-muted mt-2 max-w-sm text-sm leading-6">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

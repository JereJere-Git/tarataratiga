"use client";

import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SegmentedControl<T extends string>({ options, value, onChange }: { options: readonly { label: string; value: T }[]; value: T; onChange: (value: T) => void }) {
  return <LayoutGroup id="segmented-control"><div className="glass-pill inline-flex min-h-12 items-center gap-1 p-1">{options.map((option) => <button key={option.value} onClick={() => onChange(option.value)} className={cn("focus-ring relative min-h-10 rounded-full px-4 text-sm font-bold", value === option.value ? "text-[var(--primary)]" : "text-muted")}>{value === option.value && <motion.span layoutId="segmented-indicator" className="absolute inset-0 -z-10 rounded-full bg-white/75 shadow-sm" transition={{ type: "spring", stiffness: 300, damping: 28 }} />}<span className="relative">{option.label}</span></button>)}</div></LayoutGroup>;
}

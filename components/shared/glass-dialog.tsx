"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PropsWithChildren } from "react";

export function GlassDialog({ open, onClose, title, children }: PropsWithChildren<{ open: boolean; onClose: () => void; title: string }>) {
  return <AnimatePresence>{open && <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm" /><motion.section role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0, scale: .94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 8 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className="glass-strong relative z-10 w-full max-w-lg p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Tutup dialog" className="focus-ring glass-pill flex h-11 w-11 items-center justify-center"><X size={18} /></button></div><div className="mt-5">{children}</div></motion.section></div>}</AnimatePresence>;
}

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function StatCard({ label, value, detail, icon, accent }: { label: string; value: number; detail: string; icon: ReactNode; accent: string }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-[var(--line)] bg-white p-4 shadow-sm dark:bg-[#102b1a]"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-muted">{label}</p><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }} className="mt-2 text-3xl font-extrabold tracking-tight">{value.toLocaleString("id-ID")}</motion.p><p className="mt-1 text-xs font-semibold text-muted">{detail}</p></div><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-soft)]" style={{ color: accent }}>{icon}</span></div></motion.div>;
}

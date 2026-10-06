"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { checkComplaintStatus } from "../actions";
import { GlassButton, GlassCard } from "@/components/shared/glass";

type StatusData = { status: "baru" | "diproses" | "selesai"; kategori: string; tanggal: string; balasan: string | null };
const statuses = ["baru", "diproses", "selesai"] as const;

export function ComplaintStatusForm({ initialTicket = "" }: { initialTicket?: string }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [result, setResult] = useState<StatusData | null>(null);
  const [message, setMessage] = useState("");
  async function search(event: React.FormEvent) {
    event.preventDefault();
    const response = await checkComplaintStatus(ticket);
    if (!response.success || !response.data) { setResult(null); setMessage(response.success ? "Nomor tiket tidak ditemukan." : response.error); return; }
    setMessage("");
    setResult(response.data as StatusData);
  }
  const active = result ? statuses.indexOf(result.status) : -1;
  return <div className="max-w-2xl"><form onSubmit={search} className="glass-strong flex gap-2 rounded-full p-2"><input value={ticket} onChange={(event) => setTicket(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 outline-none" placeholder="Contoh: ADU-2026-0001" aria-label="Nomor tiket" /><GlassButton type="submit"><Search size={17} />Cari</GlassButton></form>{message && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">{message}</p>}{result && <GlassCard className="mt-6 p-6"><p className="text-sm font-bold text-[var(--primary)]">{result.kategori}</p><div className="mt-6 space-y-4">{statuses.map((status, index) => <div key={status} className="flex items-center gap-3"><motion.span initial={{ scale: 0.7 }} animate={{ scale: index <= active ? 1 : .85 }} className={`h-4 w-4 rounded-full ${index <= active ? "bg-[var(--primary)]" : "bg-slate-300 dark:bg-slate-700"}`} /><span className={index <= active ? "font-extrabold capitalize" : "text-muted capitalize"}>{status}</span></div>)}</div>{result.balasan && <div className="mt-6 rounded-2xl bg-[var(--primary-soft)] p-4 dark:bg-[var(--primary-soft)]"><p className="text-xs font-bold uppercase text-muted">Balasan petugas</p><p className="mt-2 leading-7">{result.balasan}</p></div>}<p className="text-muted mt-5 text-xs">Diterima pada {new Date(result.tanggal).toLocaleString("id-ID")}</p></GlassCard>}</div>;
}

import Link from "next/link";
import { CalendarDays, ChevronRight, FileText, MessageSquareWarning, Newspaper } from "lucide-react";
import { requireStaff } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { GlassChip } from "@/components/shared/glass";

export default async function AdminDashboard() {
  const { supabase } = await requireStaff();
  const [{ count: newsCount }, { count: newComplaints }, { count: agendaCount }, { data: complaints }] = await Promise.all([
    supabase.from("berita").select("id", { count: "exact", head: true }),
    supabase.from("pengaduan").select("id", { count: "exact", head: true }).eq("status", "baru"),
    supabase.from("agenda").select("id", { count: "exact", head: true }).gte("mulai", new Date().toISOString()),
    supabase.from("pengaduan").select("id, nomor_tiket, kategori, isi, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  return <><PageHeader eyebrow="Ringkasan hari ini" title="Dashboard" description="Pantau informasi kelurahan dan respons warga dari satu ruang kerja." action={<Link href="/admin/berita" className="focus-ring glass-pill inline-flex min-h-11 items-center gap-2 px-4 text-sm font-bold text-[var(--primary)]">Kelola berita <ChevronRight size={16} /></Link>} /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><StatCard label="Total berita" value={newsCount ?? 0} detail="Semua status" icon={<Newspaper size={20} />} accent="var(--primary)" /><StatCard label="Pengaduan baru" value={newComplaints ?? 0} detail="Perlu ditinjau" icon={<MessageSquareWarning size={20} />} accent="var(--primary)" /><StatCard label="Agenda mendatang" value={agendaCount ?? 0} detail="Mulai setelah hari ini" icon={<CalendarDays size={20} />} accent="var(--accent)" /></div><section className="mt-6"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">Kotak masuk</p><h2 className="mt-2 text-xl font-extrabold">Pengaduan terbaru</h2></div><Link href="/admin/pengaduan" className="text-sm font-bold text-[var(--primary)]">Lihat semua</Link></div><div className="glass-strong overflow-hidden rounded-[28px]">{complaints?.length ? <div className="divide-y divide-white/35">{complaints.map((complaint) => <Link href="/admin/pengaduan" key={complaint.id} className="flex items-center justify-between gap-4 p-4 transition hover:bg-white/35 dark:hover:bg-white/5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-extrabold">{complaint.nomor_tiket}</span><GlassChip className="capitalize">{complaint.status}</GlassChip></div><p className="mt-1 truncate text-sm text-muted">{complaint.kategori} · {complaint.isi}</p></div><ChevronRight size={18} className="shrink-0 text-muted" /></Link>)}</div> : <div className="flex flex-col items-center gap-3 p-10 text-center text-muted"><FileText /><p className="text-sm font-semibold">Belum ada pengaduan masuk.</p></div>}</div></section></>;
}

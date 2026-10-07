"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Users, GraduationCap, Briefcase, Baby, Church, TrendingUp } from "lucide-react";
import { GlassCard, GlassChip } from "@/components/shared/glass";
import { Reveal } from "@/components/shared/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/layout";

// ─── Types ───────────────────────────────────────────────────────────────────
export type MonografiRow = { id: string; kategori: string; label: string; nilai: number; urutan: number };
export type EkonomiRow = { id: string; sektor: string; jumlah: number; urutan: number };

type Props = { monografi: MonografiRow[]; ekonomi: EkonomiRow[] };

// ─── Palette ─────────────────────────────────────────────────────────────────
const PALETTE = [
  "#047857", "#34d399", "#2dd4bf", "#6ee7b7",
  "#0d9488", "#10b981", "#6366f1", "#f59e0b",
  "#ef4444", "#3b82f6",
];

// ─── Kategori config ──────────────────────────────────────────────────────────
const KATEGORI = [
  { key: "kependudukan", label: "Kependudukan", icon: Users },
  { key: "pendidikan", label: "Pendidikan", icon: GraduationCap },
  { key: "pekerjaan", label: "Pekerjaan", icon: Briefcase },
  { key: "usia", label: "Usia", icon: Baby },
  { key: "agama", label: "Agama", icon: Church },
] as const;

type KategoriKey = typeof KATEGORI[number]["key"];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-2xl px-4 py-3 text-sm shadow-xl">
      <p className="font-extrabold">{label}</p>
      <p className="text-[var(--primary)] font-bold">{(payload[0].value ?? 0).toLocaleString("id-ID")} jiwa</p>
    </div>
  );
}

function EkonomiTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-2xl px-4 py-3 text-sm shadow-xl">
      <p className="font-extrabold">{label}</p>
      <p className="text-[var(--primary)] font-bold">{(payload[0].value ?? 0).toLocaleString("id-ID")} orang</p>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <GlassCard className="flex items-center gap-4 p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-extrabold">{value.toLocaleString("id-ID")}</p>
        <p className="text-xs font-semibold text-muted">{label}</p>
      </div>
    </GlassCard>
  );
}

// ─── Kependudukan ─────────────────────────────────────────────────────────────
// ─── Kependudukan ─────────────────────────────────────────────────────────────
function KependudukanSection({ rows }: { rows: MonografiRow[] }) {
  const total = rows.reduce((sum, r) => sum + r.nilai, 0);
  const pieData = rows.map((r, i) => ({ name: r.label, value: r.nilai, fill: PALETTE[i % PALETTE.length] }));

  if (!rows.length) return <EmptyState title="Belum ada data kependudukan" description="Data akan muncul setelah diisi oleh pengelola kelurahan." />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total penduduk" value={total} icon={<Users size={20} />} />
        {rows.map((r) => (
          <StatCard key={r.id} label={r.label} value={r.nilai} icon={<Users size={20} />} />
        ))}
      </div>

      {pieData.length > 1 && (
        <GlassCard className="p-5">
          <p className="mb-4 font-extrabold">Komposisi penduduk</p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  // Perbaikan 1: Gunakan validasi fallback opsional (?.) dan default nilai jika undefined
                  label={({ name, percent }) => {
                    const pct = percent !== undefined ? (percent * 100).toFixed(0) : "0";
                    return `${name} ${pct}%`;
                  }}
                  labelLine={false}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
                {/* Perbaikan 2: Ubah tipe data parameter formatter menjadi 'any' atau 'unknown' untuk mengakomodasi struktur Recharts terbaru */}
                <Tooltip
                  formatter={(v: any) => [
                    v !== undefined && v !== null ? `${Number(v).toLocaleString("id-ID")} jiwa` : "0 jiwa",
                    ""
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Bar Chart Generic ────────────────────────────────────────────────────────
function BarSection({ rows, valueLabel }: { rows: MonografiRow[]; valueLabel: string }) {
  if (!rows.length) return <EmptyState title="Belum ada data" description="Data akan muncul setelah diisi oleh pengelola kelurahan." />;
  const data = rows.map((r) => ({ name: r.label, nilai: r.nilai }));
  const total = rows.reduce((s, r) => s + r.nilai, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label={`Total ${valueLabel}`} value={total} icon={<Users size={20} />} />
      </div>
      <GlassCard className="p-5">
        <p className="mb-4 font-extrabold">Distribusi {valueLabel}</p>
        <ResponsiveContainer width="100%" height={Math.max(220, data.length * 44)}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--muted)" />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} stroke="var(--muted)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="nilai" radius={[0, 8, 8, 0]}>
              {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}

// ─── Ekonomi Section ──────────────────────────────────────────────────────────
function EkonomiSection({ rows }: { rows: EkonomiRow[] }) {
  if (!rows.length) return <EmptyState title="Belum ada data ekonomi" description="Data akan muncul setelah diisi oleh pengelola kelurahan." />;
  const total = rows.reduce((s, r) => s + r.jumlah, 0);
  const data = rows.map((r) => ({ name: r.sektor, jumlah: r.jumlah }));
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total tenaga kerja" value={total} icon={<TrendingUp size={20} />} />
        <StatCard label="Jumlah sektor" value={rows.length} icon={<Briefcase size={20} />} />
      </div>
      <GlassCard className="p-5">
        <p className="mb-4 font-extrabold">Distribusi sektor usaha / mata pencaharian</p>
        <ResponsiveContainer width="100%" height={Math.max(220, data.length * 44)}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--muted)" />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} stroke="var(--muted)" />
            <Tooltip content={<EkonomiTooltip />} />
            <Bar dataKey="jumlah" radius={[0, 8, 8, 0]}>
              {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Daftar ringkasan */}
      <GlassCard className="overflow-hidden p-0">
        <div className="divide-y divide-white/30">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: PALETTE[i % PALETTE.length] }}>
                  {i + 1}
                </span>
                <span className="font-semibold">{r.sektor}</span>
              </div>
              <GlassChip>{r.jumlah.toLocaleString("id-ID")} orang</GlassChip>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StatistikClient({ monografi, ekonomi }: Props) {
  const [mainTab, setMainTab] = useState<"monografi" | "ekonomi">("monografi");
  const [subTab, setSubTab] = useState<KategoriKey>("kependudukan");

  const byKategori = useMemo(() => {
    const map: Record<string, MonografiRow[]> = {};
    for (const row of monografi) {
      if (!map[row.kategori]) map[row.kategori] = [];
      map[row.kategori].push(row);
    }
    return map;
  }, [monografi]);

  return (
    <div className="mt-10 space-y-8">
      {/* Main tab */}
      <Reveal>
        <div className="flex gap-2">
          {(["monografi", "ekonomi"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`focus-ring rounded-full px-5 py-2.5 text-sm font-bold transition ${mainTab === tab ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "glass-pill"}`}
            >
              {tab === "monografi" ? "📋 Monografi" : "📈 Ekonomi"}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Monografi */}
      {mainTab === "monografi" && (
        <Reveal>
          {/* Sub-tab kategori */}
          <div className="mb-6 flex flex-wrap gap-2">
            {KATEGORI.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSubTab(key)}
                className={`focus-ring flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${subTab === key ? "bg-[var(--primary-soft)] text-[var(--primary)] font-bold" : "glass-pill"}`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {/* Konten per kategori */}
          {subTab === "kependudukan" && (
            <div>
              <SectionHeading eyebrow="Data kependudukan" title="Jumlah penduduk" description="Data jumlah penduduk berdasarkan jenis kelamin dan total keseluruhan." />
              <div className="mt-6">
                <KependudukanSection rows={byKategori["kependudukan"] ?? []} />
              </div>
            </div>
          )}
          {subTab === "pendidikan" && (
            <div>
              <SectionHeading eyebrow="Data pendidikan" title="Tingkat pendidikan" description="Distribusi penduduk berdasarkan tingkat pendidikan yang ditamatkan." />
              <div className="mt-6">
                <BarSection rows={byKategori["pendidikan"] ?? []} valueLabel="penduduk" />
              </div>
            </div>
          )}
          {subTab === "pekerjaan" && (
            <div>
              <SectionHeading eyebrow="Data pekerjaan" title="Mata pencaharian" description="Distribusi penduduk berdasarkan jenis pekerjaan atau mata pencaharian utama." />
              <div className="mt-6">
                <BarSection rows={byKategori["pekerjaan"] ?? []} valueLabel="penduduk" />
              </div>
            </div>
          )}
          {subTab === "usia" && (
            <div>
              <SectionHeading eyebrow="Data usia" title="Kelompok umur" description="Distribusi penduduk berdasarkan kelompok umur / usia." />
              <div className="mt-6">
                <BarSection rows={byKategori["usia"] ?? []} valueLabel="penduduk" />
              </div>
            </div>
          )}
          {subTab === "agama" && (
            <div>
              <SectionHeading eyebrow="Data agama" title="Agama penduduk" description="Distribusi penduduk berdasarkan agama yang dianut." />
              <div className="mt-6">
                <BarSection rows={byKategori["agama"] ?? []} valueLabel="penduduk" />
              </div>
            </div>
          )}
        </Reveal>
      )}

      {/* Ekonomi */}
      {mainTab === "ekonomi" && (
        <Reveal>
          <SectionHeading eyebrow="Data ekonomi" title="Sektor usaha & mata pencaharian" description="Distribusi warga berdasarkan sektor usaha dan jenis pekerjaan yang digeluti." />
          <div className="mt-6">
            <EkonomiSection rows={ekonomi} />
          </div>
        </Reveal>
      )}
    </div>
  );
}

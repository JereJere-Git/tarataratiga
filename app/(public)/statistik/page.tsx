import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Statistik Kelurahan Taratara Tiga",
  description: "Data kependudukan Kelurahan Taratara Tiga.",
};

type Row = { kelompok: string; label: string; nilai: number; periode: string; urutan: number };

const GROUPS = [
  { key: "jenis_kelamin", title: "Jenis kelamin", type: "donut", sort: false },
  { key: "usia", title: "Kelompok usia", type: "column", sort: false },
  { key: "pekerjaan", title: "Pekerjaan", type: "bar", sort: true },
  { key: "pendidikan", title: "Pendidikan", type: "bar", sort: false },
  { key: "agama", title: "Agama", type: "bar", sort: true },
  { key: "lainnya", title: "Data lainnya", type: "bar", sort: false },
] as const;

const COLORS = ["#047857", "#14b8a6", "#34d399", "#0ea5e9", "#6ee7b7", "#0f766e", "#7dd3fc", "#10b981"];
const nf = new Intl.NumberFormat("id-ID");
const pct = (value: number, total: number) => (total > 0 ? (value / total) * 100 : 0);
const pctText = (value: number, total: number) => `${pct(value, total).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;

const card = "rounded-[28px] border border-[var(--line)] bg-white/80 p-5 shadow-sm sm:p-6 dark:bg-[#0a2d26]/80";

function TableView({ rows, total }: { rows: Row[]; total: number }) {
  return (
    <details className="mt-5 text-sm">
      <summary className="cursor-pointer font-bold text-[var(--primary)]">Lihat sebagai tabel</summary>
      <table className="mt-3 w-full text-left">
        <thead>
          <tr className="text-muted">
            <th className="py-1 pr-3 font-semibold">Kategori</th>
            <th className="py-1 pr-3 font-semibold">Jumlah</th>
            <th className="py-1 font-semibold">Persen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-[var(--line)]">
              <td className="py-1.5 pr-3">{row.label}</td>
              <td className="py-1.5 pr-3 font-bold">{nf.format(row.nilai)}</td>
              <td className="py-1.5">{pctText(row.nilai, total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

function Donut({ rows, total, title }: { rows: Row[]; total: number; title: string }) {
  const segments = rows.reduce<{ row: Row; p: number; start: number }[]>((list, row) => {
    const last = list[list.length - 1];
    list.push({ row, p: pct(row.nilai, total), start: last ? last.start + last.p : 0 });
    return list;
  }, []);
  const summary = rows.map((row) => `${row.label} ${pctText(row.nilai, total)}`).join(", ");
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <svg viewBox="0 0 42 42" className="h-44 w-44 shrink-0" role="img" aria-label={`${title}: ${summary}`}>
        <circle cx="21" cy="21" r="15.91549431" fill="none" stroke="var(--skeleton)" strokeWidth="6" />
        {segments.map(({ row, p, start }, index) => (
          <circle
            key={row.label}
            cx="21"
            cy="21"
            r="15.91549431"
            fill="none"
            stroke={COLORS[index % COLORS.length]}
            strokeWidth="6"
            strokeDasharray={`${p} ${100 - p}`}
            strokeDashoffset={25 - start}
          />
        ))}
        <text x="21" y="21" textAnchor="middle" className="fill-current text-[5px] font-extrabold">{nf.format(total)}</text>
        <text x="21" y="26" textAnchor="middle" className="fill-current text-[2.6px]" opacity=".7">jiwa</text>
      </svg>
      <ul className="w-full space-y-2 text-sm">
        {segments.map(({ row }, index) => (
          <li key={row.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-semibold">
              <span className="h-3 w-3 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
              {row.label}
            </span>
            <span className="text-muted">{nf.format(row.nilai)} · {pctText(row.nilai, total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Columns({ rows, total, title }: { rows: Row[]; total: number; title: string }) {
  const max = Math.max(...rows.map((row) => row.nilai), 1);
  const summary = rows.map((row) => `${row.label} ${nf.format(row.nilai)}`).join(", ");
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-end gap-3 pt-2" role="img" aria-label={`${title}: ${summary}`}>
        {rows.map((row) => (
          <div key={row.label} className="flex w-16 flex-col items-center gap-1">
            <span className="text-xs font-bold">{nf.format(row.nilai)}</span>
            <div className="w-full rounded-t-xl" style={{ height: `${Math.max((row.nilai / max) * 160, 4)}px`, background: "var(--primary)" }} />
            <span className="text-center text-[11px] leading-tight text-muted">{row.label}</span>
            <span className="text-[10px] text-muted">{pctText(row.nilai, total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bars({ rows, total }: { rows: Row[]; total: number }) {
  const max = Math.max(...rows.map((row) => row.nilai), 1);
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-semibold">{row.label}</span>
            <span className="shrink-0 text-muted">{nf.format(row.nilai)} · {pctText(row.nilai, total)}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full" style={{ background: "var(--skeleton)" }}>
            <div className="h-full rounded-full" style={{ width: `${(row.nilai / max) * 100}%`, background: "var(--primary)" }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function StatistikPage({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  const { periode: requested } = await searchParams;
  const supabase = await createClient();
  const [{ data: profil }, { data }] = await Promise.all([
    supabase.from("profil_kelurahan").select("jumlah_rt, jumlah_rw, jumlah_penduduk").limit(1).maybeSingle(),
    supabase
      .from("statistik")
      .select("kelompok, label, nilai, periode, urutan")
      .order("urutan", { ascending: true })
      .order("label", { ascending: true }),
  ]);

  const rows = (data ?? []) as Row[];
  const periods = [...new Set(rows.map((row) => row.periode))].sort().reverse();
  const periode = requested && periods.includes(requested) ? requested : periods[0];
  const current = rows.filter((row) => row.periode === periode);

  const summary = [
    ["Penduduk", profil?.jumlah_penduduk],
    ["RT", profil?.jumlah_rt],
    ["RW", profil?.jumlah_rw],
  ] as const;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-24 md:pb-16">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--primary)]">Data wilayah</p>
      <h1 className="mt-2 text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold leading-tight tracking-tight">Statistik Kelurahan</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Gambaran kependudukan Kelurahan Taratara Tiga{periode ? `, data periode ${periode}` : ""}.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {summary.map(([label, value]) => (
          <div key={label} className={`${card} text-center`}>
            <div className="text-3xl font-extrabold text-[var(--primary)] sm:text-4xl">
              {typeof value === "number" ? nf.format(value) : "-"}
            </div>
            <div className="mt-1 text-sm font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {periods.length > 1 && (
        <nav aria-label="Pilih periode" className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold">Periode:</span>
          {periods.map((item) => (
            <Link
              key={item}
              href={`/statistik?periode=${encodeURIComponent(item)}`}
              aria-current={item === periode ? "page" : undefined}
              className={`focus-ring rounded-full border px-4 py-2 text-sm font-bold ${
                item === periode
                  ? "border-transparent bg-[var(--primary)] text-white"
                  : "border-[var(--line)] bg-white/70 dark:bg-white/10"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>
      )}

      {periods.length === 0 ? (
        <div className={`${card} mt-8 text-center`}>
          <p className="font-bold">Data statistik belum tersedia.</p>
          <p className="mt-1 text-sm text-muted">Data akan ditampilkan setelah diisi oleh pengelola kelurahan.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {GROUPS.map((group) => {
            let groupRows = current.filter((row) => row.kelompok === group.key);
            if (groupRows.length === 0) return null;
            if (group.sort) groupRows = [...groupRows].sort((a, b) => b.nilai - a.nilai);
            const total = groupRows.reduce((sum, row) => sum + row.nilai, 0);
            return (
              <section key={group.key} className={card} aria-label={group.title}>
                <h2 className="mb-4 text-lg font-extrabold">{group.title}</h2>
                {group.type === "donut" && <Donut rows={groupRows} total={total} title={group.title} />}
                {group.type === "column" && <Columns rows={groupRows} total={total} title={group.title} />}
                {group.type === "bar" && <Bars rows={groupRows} total={total} />}
                <TableView rows={groupRows} total={total} />
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">Data diperbarui oleh pengelola Kelurahan Taratara Tiga.</p>
    </div>
  );
}
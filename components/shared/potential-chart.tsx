"use client";

import { useState } from "react";
import { ArrowDownRight, BarChart3, Sprout, Trees } from "lucide-react";
import { GlassCard } from "@/components/shared/glass";
import { PROFIL_2024 } from "@/lib/profil-2024";

const land = [
  ...PROFIL_2024.wilayah.penggunaan.map(({ nama, hektare }) => ({ name: nama, value: hektare })),
  { name: "Hutan produksi terbatas", value: PROFIL_2024.wilayah.hutanProduksiTerbatasHa },
];
const crops = PROFIL_2024.tanamanPangan.map(({ nama, hektare }) => ({ name: nama, value: hektare }));

export function PotentialChart() {
  const [view, setView] = useState<"land" | "crops">("land");
  const [selected, setSelected] = useState(0);
  const items = view === "land" ? land : crops;
  const current = items[selected] ?? items[0];
  const maximum = Math.max(...items.map((item) => item.value));

  function changeView(next: "land" | "crops") {
    setView(next);
    setSelected(0);
  }

  const summary = [
    { label: "Luas wilayah", value: `${PROFIL_2024.wilayah.luasHa.toLocaleString("id-ID")} ha`, icon: BarChart3 },
    { label: "Perkebunan", value: `${PROFIL_2024.wilayah.penggunaan[0].hektare.toLocaleString("id-ID")} ha`, icon: Sprout },
    { label: "Hutan produksi", value: `${PROFIL_2024.wilayah.hutanProduksiTerbatasHa.toLocaleString("id-ID")} ha`, icon: Trees },
  ];

  return <GlassCard className="p-4 sm:p-6 lg:p-7">
    <div className="grid gap-5 lg:grid-cols-[1.12fr_.88fr] lg:gap-7">
      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--accent)]">Data profil kelurahan {PROFIL_2024.tahun}</p><h3 className="mt-1 text-lg font-extrabold">Potensi dalam angka</h3></div>
          <div className="grid grid-cols-2 rounded-full border border-[var(--line)] bg-white/45 p-1 dark:bg-black/10" role="group" aria-label="Pilih data potensi">
            <button type="button" onClick={() => changeView("land")} aria-pressed={view === "land"} className={`min-h-9 rounded-full px-3 text-xs font-bold transition-colors ${view === "land" ? "bg-[var(--primary)] text-white" : "text-muted hover:bg-[var(--primary-soft)]"}`}>Penggunaan lahan</button>
            <button type="button" onClick={() => changeView("crops")} aria-pressed={view === "crops"} className={`min-h-9 rounded-full px-3 text-xs font-bold transition-colors ${view === "crops" ? "bg-[var(--primary)] text-white" : "text-muted hover:bg-[var(--primary-soft)]"}`}>Tanaman pangan</button>
          </div>
        </div>
        <p className="text-muted mt-2 text-xs">{view === "land" ? "Luas tercatat menurut penggunaan (hektare)." : "Luas tanaman pangan yang tercatat (hektare)."} Pilih batang untuk melihat rinciannya.</p>
        <ul className="mt-3 max-h-[390px] space-y-1 overflow-y-auto pr-1 sm:max-h-none sm:space-y-2" aria-label={view === "land" ? "Grafik horizontal penggunaan lahan" : "Grafik horizontal luas tanaman pangan"}>
          {items.map((item, index) => <li key={item.name}>
            <button type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`${item.name}: ${item.value.toLocaleString("id-ID")} hektare`} className={`group block w-full rounded-xl px-2 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${selected === index ? "bg-[var(--primary-soft)]/70" : "hover:bg-white/55 dark:hover:bg-white/5"}`}>
              <span className="flex items-center justify-between gap-3 text-xs"><span className={`truncate font-semibold transition-colors group-hover:text-[var(--primary)] ${selected === index ? "text-[var(--primary)]" : ""}`}>{item.name}</span><span className="shrink-0 font-bold tabular-nums">{item.value.toLocaleString("id-ID")} ha</span></span>
              <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-[var(--line)]/70"><span className={`block h-full rounded-full transition-[width,background-color] duration-500 ${selected === index ? "bg-[var(--primary)]" : "bg-[var(--accent)]"}`} style={{ width: `${Math.max(3, (item.value / maximum) * 100)}%` }} /></span>
            </button>
          </li>)}
        </ul>
        <p className="text-muted mt-3 text-[10px] leading-4">Sumber: Profil Kelurahan Taratara Tiga {PROFIL_2024.tahun}. Angka mengikuti isian dokumen; komponen penggunaan lahan tidak selalu sama dengan luas wilayah.</p>
      </div>

      <aside className="flex min-w-0 flex-col gap-3">
        <div className="rounded-[22px] border border-[var(--line)] bg-white/55 p-4 dark:bg-white/[.04] sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[var(--primary)]">Rincian terpilih</p>
          <h4 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl">{current.name}</h4>
          <p className="mt-2 flex items-baseline gap-2"><strong className="text-4xl font-extrabold tracking-tight text-[var(--primary)]">{current.value.toLocaleString("id-ID")}</strong><span className="text-sm font-semibold text-muted">hektare</span></p>
          <p className="text-muted mt-3 text-sm leading-6">{view === "land" ? `Area ini tercatat sebagai ${current.name.toLocaleLowerCase()} pada profil kelurahan.` : `Komoditas ${current.name.toLocaleLowerCase()} tercatat dalam data tanaman pangan kelurahan.`}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {summary.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/35 px-3 py-2.5 dark:bg-white/[.03] lg:py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Icon size={17} aria-hidden="true" /></span>
            <span className="min-w-0"><span className="text-muted block text-[11px]">{label}</span><strong className="text-sm font-extrabold">{value}</strong></span>
          </div>)}
        </div>
        <div className="flex items-start gap-2 rounded-2xl bg-[var(--primary-soft)]/55 p-3 text-xs leading-5"><ArrowDownRight size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden="true" /><p>Gunakan pilihan di atas grafik untuk membandingkan kondisi lahan dan komoditas pangan.</p></div>
      </aside>
    </div>
  </GlassCard>;
}

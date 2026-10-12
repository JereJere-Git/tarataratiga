"use client";

import { useState } from "react";
import { BarChart3, Ruler, Sprout } from "lucide-react";
import { GlassCard } from "@/components/shared/glass";
import { PROFIL_2024 } from "@/lib/profil-2024";

const land = [
  ...PROFIL_2024.wilayah.penggunaan.map(({ nama, hektare }) => ({ name: nama, value: hektare })),
  { name: "Hutan produksi terbatas", value: PROFIL_2024.wilayah.hutanProduksiTerbatasHa },
].sort((a, b) => b.value - a.value);
const crops = PROFIL_2024.tanamanPangan.map(({ nama, hektare }) => ({ name: nama, value: hektare }));

const overview: Record<string, { definition: string; benefit: string }> = {
  "Perkebunan": { definition: "Lahan untuk budidaya tanaman kebun, umumnya dikelola dalam jangka menengah hingga panjang.", benefit: "Hasil kebun dapat menjadi bahan pangan atau bahan baku, sekaligus sumber pendapatan warga." },
  "Hutan produksi terbatas": { definition: "Kawasan hutan dengan pemanfaatan hasil hutan yang dibatasi sesuai fungsi dan kelestariannya.", benefit: "Menjaga tutupan lahan dan tata air, dengan pemanfaatan hasil hutan secara terkendali." },
  "Persawahan": { definition: "Lahan basah yang dimanfaatkan untuk budidaya padi.", benefit: "Menghasilkan beras sebagai bahan pangan utama dan mendukung mata pencaharian petani." },
  "Permukiman": { definition: "Area tempat tinggal beserta lingkungan pendukung kehidupan warga.", benefit: "Menjadi ruang hunian dan pusat aktivitas sosial masyarakat." },
  "Pekarangan": { definition: "Lahan di sekitar rumah yang dapat dimanfaatkan untuk tanaman atau kegiatan rumah tangga.", benefit: "Mendukung kebutuhan pangan rumah tangga dan pemanfaatan ruang di sekitar rumah." },
  "Kuburan": { definition: "Area yang disediakan untuk pemakaman warga.", benefit: "Mendukung kebutuhan pemakaman serta ruang penghormatan bagi keluarga dan masyarakat." },
  "Taman": { definition: "Ruang terbuka yang ditata dengan tanaman dan elemen lingkungan.", benefit: "Menyediakan ruang hijau untuk kenyamanan dan kualitas lingkungan." },
  "Perkantoran": { definition: "Area yang digunakan untuk kegiatan administrasi dan pelayanan.", benefit: "Mendukung penyelenggaraan pemerintahan dan layanan kepada warga." },
  "Prasarana umum lainnya": { definition: "Lahan untuk prasarana yang menunjang kegiatan dan kebutuhan bersama.", benefit: "Mendukung akses, layanan, dan aktivitas warga di lingkungan kelurahan." },
  "Padi sawah": { definition: "Tanaman pangan yang dibudidayakan di lahan persawahan.", benefit: "Menghasilkan beras sebagai sumber pangan pokok." },
  "Jagung": { definition: "Tanaman pangan biji-bijian yang dapat ditanam untuk konsumsi maupun pakan.", benefit: "Menambah pilihan pangan dan dapat dimanfaatkan sebagai pakan ternak." },
  "Kangkung": { definition: "Sayuran daun yang dibudidayakan untuk konsumsi sehari-hari.", benefit: "Menambah pasokan sayuran segar dan berpotensi menjadi hasil jual warga." },
  "Talas": { definition: "Tanaman umbi yang bagian umbinya dapat diolah menjadi bahan pangan.", benefit: "Menjadi sumber pangan alternatif dan bahan olahan rumah tangga." },
  "Tomat": { definition: "Tanaman sayur-buah yang digunakan segar maupun sebagai bahan masakan.", benefit: "Menambah ragam pangan dan dapat dipasarkan sebagai hasil pertanian." },
  "Mentimun": { definition: "Tanaman sayur-buah yang umum dikonsumsi segar atau diolah.", benefit: "Menambah pasokan sayuran dan pilihan hasil pertanian untuk dijual." },
};

export function PotentialChart() {
  const [view, setView] = useState<"land" | "crops">("land");
  const [selected, setSelected] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const items = view === "land" ? land : crops;
  const visibleItems = showAll ? items : items.slice(0, 5);
  const current = items[selected] ?? items[0];
  const maximum = Math.max(...items.map((item) => item.value));
  const currentOverview = overview[current.name];

  function changeView(next: "land" | "crops") {
    setView(next);
    setSelected(0);
    setShowAll(false);
  }

  const summary = [
    { label: "Kategori lahan", value: `${land.length} jenis`, icon: BarChart3 },
    { label: "Tanaman pangan", value: `${crops.length} jenis`, icon: Sprout },
    { label: "Luas wilayah", value: `${PROFIL_2024.wilayah.luasHa.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`, icon: Ruler },
  ];

  return <GlassCard className="p-4 sm:p-6 lg:p-7">
        <div className="mb-4 grid grid-cols-3 gap-2" role="group" aria-label="Potensi dengan luasan terbesar">
          {land.slice(0, 3).map((item, index) => <button key={item.name} type="button" onClick={() => { setView("land"); setSelected(index); setShowAll(false); }} aria-pressed={view === "land" && selected === index} className="focus-ring rounded-2xl border border-[var(--line)] bg-[var(--primary-soft)]/45 p-3 text-left transition-colors hover:bg-[var(--primary-soft)] sm:px-4">
            <span className="text-muted block truncate text-[10px] font-semibold sm:text-xs">{item.name}</span>
            <strong className="mt-1 block text-base font-extrabold tabular-nums text-[var(--primary)] sm:text-lg">{item.value.toLocaleString("id-ID")} <span className="text-[10px] font-bold sm:text-xs">ha</span></strong>
          </button>)}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.12fr_.88fr] lg:gap-7">
      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--accent)]">Potensi kelurahan · {PROFIL_2024.tahun}</p><h3 className="mt-1 text-lg font-extrabold">Lahan dan tanaman pangan</h3></div>
          <div className="grid grid-cols-2 rounded-full border border-[var(--line)] bg-white/45 p-1 dark:bg-black/10" role="group" aria-label="Pilih data potensi">
            <button type="button" onClick={() => changeView("land")} aria-pressed={view === "land"} className={`min-h-9 rounded-full px-3 text-xs font-bold transition-colors ${view === "land" ? "bg-[var(--primary)] text-white" : "text-muted hover:bg-[var(--primary-soft)]"}`}>Penggunaan lahan</button>
            <button type="button" onClick={() => changeView("crops")} aria-pressed={view === "crops"} className={`min-h-9 rounded-full px-3 text-xs font-bold transition-colors ${view === "crops" ? "bg-[var(--primary)] text-white" : "text-muted hover:bg-[var(--primary-soft)]"}`}>Tanaman pangan</button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2"><p className="text-muted text-xs">{visibleItems.length} dari {items.length} {view === "land" ? "kategori lahan" : "jenis tanaman"} · hektare</p>{items.length > 5 && <button type="button" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll} className="focus-ring min-h-9 shrink-0 rounded-full px-3 text-xs font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)]">{showAll ? "Ringkas" : "Lihat semua"}</button>}</div>
        <ul className="mt-2 space-y-0.5" aria-label={view === "land" ? "Grafik horizontal penggunaan lahan" : "Grafik horizontal luas tanaman pangan"}>
          {visibleItems.map((item, index) => <li key={item.name}>
            <button type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`${item.name}: ${item.value.toLocaleString("id-ID")} hektare`} className={`group block w-full rounded-xl px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${selected === index ? "bg-[var(--primary-soft)]/70" : "hover:bg-white/55 dark:hover:bg-white/5"}`}>
              <span className="flex items-center justify-between gap-3 text-xs"><span className={`truncate font-semibold transition-colors group-hover:text-[var(--primary)] ${selected === index ? "text-[var(--primary)]" : ""}`}>{item.name}</span><span className="shrink-0 font-bold tabular-nums">{item.value.toLocaleString("id-ID")} ha</span></span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--line)]/70"><span className={`block h-full rounded-full transition-[width,background-color] duration-500 ${selected === index ? "bg-[var(--primary)]" : "bg-[var(--accent)]"}`} style={{ width: `${Math.max(3, (item.value / maximum) * 100)}%` }} /></span>
            </button>
          </li>)}
        </ul>
      </div>

      <aside className="flex min-w-0 flex-col gap-3">
        <div className="rounded-[22px] border border-[var(--line)] bg-white/55 p-4 dark:bg-white/[.04] sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[var(--primary)]">Rincian terpilih</p>
          <h4 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl">{current.name}</h4>
          <p className="mt-2 flex items-baseline gap-2"><strong className="text-4xl font-extrabold tracking-tight text-[var(--primary)]">{current.value.toLocaleString("id-ID")}</strong><span className="text-sm font-semibold text-muted">hektare</span></p>
          <p className="text-muted mt-2 text-sm leading-6">{view === "land" ? `Bagian dari penggunaan lahan yang dilaporkan.` : `Luas tanam yang dilaporkan.`}</p>
          <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs font-semibold text-[var(--primary)]">{Math.round((current.value / maximum) * 100)}% dari kategori terbesar</p>
        </div>
        <div className="rounded-[22px] border border-[var(--line)] bg-[var(--primary-soft)]/45 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[var(--primary)]">Wawasan potensi</p>
          <p className="mt-3 text-xs font-bold">Pengertian</p>
          <p className="mt-1.5 text-sm leading-6">{currentOverview.definition}</p>
          <p className="mt-3 text-xs font-bold text-[var(--primary)]">Hasil dan manfaat</p>
          <p className="text-muted mt-1 text-sm leading-6">{currentOverview.benefit}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {summary.map(({ label, value, icon: Icon }) => <div key={label} className="flex min-w-0 flex-col gap-1 rounded-2xl border border-[var(--line)] bg-white/35 px-2.5 py-2.5 dark:bg-white/[.03] lg:flex-row lg:items-center lg:gap-3 lg:px-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] lg:h-9 lg:w-9 lg:rounded-xl"><Icon size={15} aria-hidden="true" /></span>
            <span className="min-w-0"><span className="text-muted block text-[10px] leading-4 lg:text-[11px]">{label}</span><strong className="block truncate text-[11px] font-extrabold sm:text-xs">{value}</strong></span>
          </div>)}
        </div>
      </aside>
    </div>
    <p className="text-muted mt-4 border-t border-[var(--line)] pt-3 text-[10px] italic leading-4">Sumber: <em>Daftar Isian Potensi Desa dan Kelurahan Taratara Tiga</em>, Desember {PROFIL_2024.tahun}. Komponen penggunaan lahan ditampilkan sesuai isian dokumen dan tidak selalu sama dengan luas wilayah.</p>
  </GlassCard>;
}

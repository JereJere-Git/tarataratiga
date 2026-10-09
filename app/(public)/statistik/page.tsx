import type { Metadata } from "next";
import { Building2, Droplets, HeartPulse, Layers3, Ruler, Route, Sprout, Store, Users } from "lucide-react";
import { PROFIL_2024 } from "@/lib/profil-2024";
import { PotentialChart } from "@/components/shared/potential-chart";

export const metadata: Metadata = {
  title: "Statistik Kelurahan Taratara Tiga",
  description: "Data penduduk, wilayah, pertanian, dan sarana Kelurahan Taratara Tiga dari Profil Kelurahan 2024.",
};

const formatNumber = new Intl.NumberFormat("id-ID");
const formatDecimal = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const malePercent = (PROFIL_2024.penduduk.lakiLaki / PROFIL_2024.penduduk.total) * 100;
const cards = [
  { label: "Penduduk", value: formatNumber.format(PROFIL_2024.penduduk.total), unit: "jiwa", icon: Users },
  { label: "Kepala keluarga", value: formatNumber.format(PROFIL_2024.penduduk.keluarga), unit: "KK", icon: Building2 },
  { label: "Luas wilayah", value: formatDecimal.format(PROFIL_2024.wilayah.luasHa), unit: "ha", icon: Ruler },
  { label: "Lingkungan", value: formatNumber.format(PROFIL_2024.wilayah.lingkungan), unit: "lingkungan", icon: Layers3 },
];

const cardStyle = "rounded-[26px] border border-[var(--line)] bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,75,53,.06)] backdrop-blur-sm dark:bg-[#0a2d26]/80 sm:p-6";

export default function StatistikPage() {
  const maxJobCount = Math.max(...PROFIL_2024.pekerjaan.map((job) => job.jumlah));
  const facilities = PROFIL_2024.fasilitas;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-28 sm:px-6 md:pb-20">
      <header className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-gradient-to-br from-emerald-50 via-white/80 to-cyan-50 p-6 dark:from-emerald-950/60 dark:via-[#0a2d26] dark:to-cyan-950/40 sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[.13em] text-[var(--primary)] dark:bg-white/5">
            <Sprout size={14} aria-hidden="true" /> Profil kelurahan
          </p>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-.04em] sm:text-5xl">Taratara Tiga dalam angka</h1>
          <p className="text-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            Jelajahi ringkasan penduduk, wilayah, mata pencaharian, pertanian, dan fasilitas yang tersedia untuk warga.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-200" /> Pembaruan {PROFIL_2024.tahun}
          </div>
        </div>
      </header>

      <section aria-labelledby="ringkasan-heading" className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Ringkasan</p>
          <h2 id="ringkasan-heading" className="mt-1 text-xl font-extrabold sm:text-2xl">Gambaran wilayah</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, value, unit, icon: Icon }) => (
            <article key={label} className={cardStyle}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Icon size={20} aria-hidden="true" /></span>
              <p className="text-muted mt-5 text-sm font-semibold">{label}</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-extrabold tracking-tight">{value}</span><span className="text-muted text-sm font-semibold">{unit}</span></p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="potensi-heading" className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Pertanian dan wilayah</p>
          <h2 id="potensi-heading" className="mt-1 text-xl font-extrabold sm:text-2xl">Data potensi Taratara Tiga</h2>
          <p className="text-muted mt-2 text-sm leading-6">Bandingkan penggunaan lahan dan luas tanaman pangan. Pilih batang grafik untuk melihat nilai setiap kategori.</p>
        </div>
        <PotentialChart />
      </section>

      <section aria-labelledby="penduduk-heading" className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <article className={cardStyle}>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Kependudukan</p>
          <h2 id="penduduk-heading" className="mt-1 text-xl font-extrabold">Komposisi penduduk</h2>
          <p className="text-muted mt-2 text-sm leading-6">Jumlah {formatNumber.format(PROFIL_2024.penduduk.total)} jiwa, dirinci menurut jenis kelamin.</p>
          <div className="mt-6 space-y-4" role="img" aria-label={`Grafik jumlah penduduk: laki-laki ${formatNumber.format(PROFIL_2024.penduduk.lakiLaki)} jiwa (${formatDecimal.format(malePercent)} persen), perempuan ${formatNumber.format(PROFIL_2024.penduduk.perempuan)} jiwa (${formatDecimal.format(100 - malePercent)} persen).`}>
            {[
              { label: "Laki-laki", count: PROFIL_2024.penduduk.lakiLaki, percent: malePercent, color: "bg-emerald-700" },
              { label: "Perempuan", count: PROFIL_2024.penduduk.perempuan, percent: 100 - malePercent, color: "bg-teal-400" },
            ].map((item) => <div key={item.label}>
              <div className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold">{item.label}</span><span className="tabular-nums"><strong>{formatNumber.format(item.count)} jiwa</strong><span className="text-muted ml-2">{formatDecimal.format(item.percent)}%</span></span></div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--line)]/70"><div className={`h-full rounded-full ${item.color} transition-[width] duration-500`} style={{ width: `${item.percent}%` }} /></div>
            </div>)}
          </div>
          <p className="text-muted mt-4 text-[11px] italic leading-5">Sumber: <em>Daftar Isian Potensi Desa dan Kelurahan Taratara Tiga</em>, Desember {PROFIL_2024.tahun}.</p>
        </article>
        <article className={`${cardStyle} flex flex-col justify-center`}>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Keluarga</p>
          <h2 className="mt-1 text-xl font-extrabold">Rata-rata jumlah warga</h2>
          <p className="mt-2 text-muted text-sm leading-6">Perbandingan jumlah penduduk dan kepala keluarga yang dicatat dalam profil.</p>
          <p className="mt-5 text-4xl font-extrabold tracking-tight text-[var(--primary)]">{formatDecimal.format(PROFIL_2024.penduduk.total / PROFIL_2024.penduduk.keluarga)}<span className="ml-2 text-base">jiwa/KK</span></p>
          <p className="text-muted mt-2 text-xs">Hasil perhitungan: {formatNumber.format(PROFIL_2024.penduduk.total)} jiwa ÷ {formatNumber.format(PROFIL_2024.penduduk.keluarga)} KK.</p>
        </article>
      </section>

      <section aria-labelledby="pekerjaan-heading" className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className={cardStyle}>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Mata pencaharian</p>
          <h2 id="pekerjaan-heading" className="mt-1 text-xl font-extrabold">Pekerjaan yang tercatat</h2>
          <p className="text-muted mt-2 text-xs leading-5">Batang menunjukkan perbandingan jumlah pada tiap kategori pekerjaan.</p>
          <ul className="mt-4 space-y-3">
            {PROFIL_2024.pekerjaan.map((job) => <li key={job.nama}>
              <div className="flex justify-between gap-3 text-xs"><span>{job.nama}</span><strong>{formatNumber.format(job.jumlah)} orang</strong></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--line)]/70"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${(job.jumlah / maxJobCount) * 100}%` }} /></div>
            </li>)}
          </ul>
          <p className="text-muted mt-4 text-[11px] italic leading-5">Sumber: tabel pekerjaan dalam <em>Daftar Isian Potensi Desa dan Kelurahan Taratara Tiga</em>, Desember {PROFIL_2024.tahun}.</p>
        </article>

        <article className={cardStyle}>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Sarana kelurahan</p>
          <h2 className="mt-1 text-xl font-extrabold">Fasilitas dan infrastruktur</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><HeartPulse size={16} /> Kesehatan</p><p className="text-muted mt-2 text-sm leading-6">{facilities.puskesmasPembantu} Puskesmas Pembantu · {facilities.posyandu} Posyandu</p><p className="text-muted text-sm leading-6">{facilities.dokterUmum} dokter umum · {facilities.bidan} bidan · {facilities.perawat} perawat</p></div>
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><Droplets size={16} /> Air bersih</p><p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(facilities.sumurPompa)} sumur pompa · {formatNumber.format(facilities.sumurGali)} sumur gali · {formatNumber.format(facilities.mataAir)} mata air</p></div>
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><Route size={16} /> Jalan kelurahan</p><p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(facilities.jalanAspalMeter)} m aspal · {formatNumber.format(facilities.jalanBetonMeter)} m beton/semen</p></div>
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><Store size={16} /> Usaha tercatat</p><p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(facilities.kios)} toko/kios · {formatNumber.format(facilities.usahaPeternakan)} unit peternakan · {formatNumber.format(facilities.usahaPerikanan)} unit perikanan</p></div>
          </div>
          <p className="text-muted mt-4 text-[11px] italic leading-5">Sumber: bagian sarana dan prasarana dalam <em>Daftar Isian Potensi Desa dan Kelurahan Taratara Tiga</em>, Desember {PROFIL_2024.tahun}.</p>
        </article>
      </section>

      <section aria-label="Catatan sumber data" className={`${cardStyle} mt-6`}>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Sumber data</p>
        <p className="text-muted mt-2 text-sm italic leading-7">Data kependudukan, wilayah, mata pencaharian, dan fasilitas diolah dari <em>Daftar Isian Potensi Desa dan Kelurahan Taratara Tiga</em>, Desember {PROFIL_2024.tahun}. Isian yang kosong atau tidak terbaca tidak ditampilkan.</p>
      </section>
    </main>
  );
}

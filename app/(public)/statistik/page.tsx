import type { Metadata } from "next";
import Image from "next/image";
import { Building2, Droplets, ExternalLink, HeartPulse, Layers3, MapPinned, Ruler, Route, Sprout, Store, Users } from "lucide-react";
import { PROFIL_2024 } from "@/lib/profil-2024";
import { PotentialChart } from "@/components/shared/potential-chart";

export const metadata: Metadata = {
  title: "Statistik Kelurahan Taratara Tiga",
  description: "Data penduduk, wilayah, pertanian, dan sarana Kelurahan Taratara Tiga dari Profil Kelurahan 2024.",
};

const formatNumber = new Intl.NumberFormat("id-ID");
const formatDecimal = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const malePercent = (PROFIL_2024.penduduk.lakiLaki / PROFIL_2024.penduduk.total) * 100;
const femalePercent = 100 - malePercent;
const maxGenderPercent = Math.max(malePercent, femalePercent);
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
  const waterSources: { label: string; count: number; color: string }[] = [
    { label: "Sumur gali", count: facilities.sumurGali, color: "bg-sky-600" },
    { label: "Sumur pompa", count: facilities.sumurPompa, color: "bg-cyan-500" },
    { label: "Mata air", count: facilities.mataAir, color: "bg-teal-400" },
  ];
  const roadTotal = facilities.jalanAspalMeter + facilities.jalanBetonMeter;

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

      <section aria-labelledby="peta-administrasi-heading" className="mt-6 overflow-hidden rounded-[30px] border border-[var(--line)] bg-white/75 shadow-[0_16px_45px_rgba(15,75,53,.09)] backdrop-blur-md dark:bg-[#0a2d26]/75">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><MapPinned size={21} aria-hidden="true" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--primary)]">Peta wilayah</p><h2 id="peta-administrasi-heading" className="text-lg font-extrabold sm:text-xl">Peta Administrasi Kelurahan Taratara Tiga</h2></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/maps/peta-administrasi-taratara-tiga.webp" target="_blank" rel="noreferrer" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-3 text-xs font-bold text-white transition-colors hover:bg-emerald-800 sm:px-4 sm:text-sm"><ExternalLink size={15} />Lihat ukuran penuh</a>
          </div>
        </div>
        <div className="bg-slate-100/80 p-2 dark:bg-black/20 sm:p-3">
          <a href="/maps/peta-administrasi-taratara-tiga.webp" target="_blank" rel="noreferrer" aria-label="Buka peta administrasi dalam ukuran penuh" className="focus-ring relative mx-auto block aspect-[1.415] w-full max-h-[760px] overflow-hidden rounded-2xl bg-white">
            <Image src="/maps/peta-administrasi-taratara-tiga.webp" alt="Peta administrasi Kelurahan Taratara Tiga, termasuk batas lingkungan, jalan, jaringan sungai, dan peta inset." fill sizes="(max-width: 768px) 100vw, 1100px" className="object-contain" />
          </a>
        </div>
        <p className="text-muted px-4 py-3 text-xs italic sm:px-5">Sumber: Peta Administrasi Kelurahan Taratara Tiga.</p>
      </section>

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
          <div className="mt-6" role="img" aria-label={`Perbandingan penduduk: ${formatNumber.format(PROFIL_2024.penduduk.lakiLaki)} laki-laki di sisi kiri dan ${formatNumber.format(PROFIL_2024.penduduk.perempuan)} perempuan di sisi kanan.`}>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm font-bold">Laki-laki</p><p className="mt-1 text-xl font-extrabold tabular-nums">{formatNumber.format(PROFIL_2024.penduduk.lakiLaki)} <span className="text-xs font-semibold">jiwa</span></p><p className="text-muted text-xs">{formatDecimal.format(malePercent)}%</p></div>
              <div className="text-right"><p className="text-sm font-bold">Perempuan</p><p className="mt-1 text-xl font-extrabold tabular-nums">{formatNumber.format(PROFIL_2024.penduduk.perempuan)} <span className="text-xs font-semibold">jiwa</span></p><p className="text-muted text-xs">{formatDecimal.format(femalePercent)}%</p></div>
            </div>
            <div className="relative mt-4 grid grid-cols-2 overflow-hidden rounded-full bg-[var(--line)]/60" aria-hidden="true">
              <div className="flex h-5 justify-end"><span className="h-full rounded-l-full bg-emerald-700" style={{ width: `${(malePercent / maxGenderPercent) * 100}%` }} /></div>
              <div className="flex h-5 justify-start"><span className="h-full rounded-r-full bg-teal-400" style={{ width: `${(femalePercent / maxGenderPercent) * 100}%` }} /></div>
              <span className="absolute bottom-[-3px] left-1/2 top-[-3px] w-[3px] -translate-x-1/2 rounded-full bg-white shadow-sm dark:bg-emerald-950" />
            </div>
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
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><HeartPulse size={16} /> Kesehatan</p><ul className="text-muted mt-2 list-disc space-y-1 pl-4 text-sm leading-6 marker:text-[var(--primary)]"><li>{facilities.puskesmasPembantu} Puskesmas Pembantu</li><li>{facilities.posyandu} Posyandu</li><li>{facilities.dokterUmum} dokter umum</li><li>{facilities.bidan} bidan</li><li>{facilities.perawat} perawat</li></ul></div>
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><Droplets size={16} /> Air bersih</p><p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(facilities.sumurPompa)} sumur pompa · {formatNumber.format(facilities.sumurGali)} sumur gali · {formatNumber.format(facilities.mataAir)} mata air</p></div>
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><Route size={16} /> Jalan kelurahan</p><p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(facilities.jalanAspalMeter)} m aspal · {formatNumber.format(facilities.jalanBetonMeter)} m beton/semen</p></div>
            <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5"><p className="flex items-center gap-2 text-sm font-bold"><Store size={16} /> Usaha tercatat</p><ul className="text-muted mt-2 list-disc space-y-1 pl-4 text-sm leading-6 marker:text-[var(--primary)]"><li>{formatNumber.format(facilities.kios)} toko/kios</li><li>{formatNumber.format(facilities.usahaPeternakan)} unit peternakan</li><li>{formatNumber.format(facilities.usahaPerikanan)} unit perikanan</li></ul></div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4 dark:bg-white/[.03]">
              <h3 className="flex items-center gap-2 text-sm font-bold"><Droplets size={16} /> Sumber air</h3>
              <div className="mt-3 space-y-2" role="img" aria-label="Grafik jumlah sumur gali, sumur pompa, dan mata air.">
                {waterSources.map((item) => <div key={item.label}>
                  <div className="flex justify-between gap-2 text-xs"><span>{item.label}</span><strong>{formatNumber.format(item.count)}</strong></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--line)]/70"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.count / facilities.sumurGali) * 100}%` }} /></div>
                </div>)}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4 dark:bg-white/[.03]">
              <h3 className="flex items-center gap-2 text-sm font-bold"><Route size={16} /> Panjang jalan</h3>
              <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-[var(--line)]/70" role="img" aria-label={`Jalan aspal ${formatNumber.format(facilities.jalanAspalMeter)} meter; jalan beton atau semen ${formatNumber.format(facilities.jalanBetonMeter)} meter.`}>
                <span className="h-full bg-amber-500" style={{ width: `${(facilities.jalanAspalMeter / roadTotal) * 100}%` }} />
                <span className="h-full bg-emerald-600" style={{ width: `${(facilities.jalanBetonMeter / roadTotal) * 100}%` }} />
              </div>
              <div className="text-muted mt-3 space-y-1 text-xs"><p className="flex items-center justify-between gap-2"><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />Aspal</span><strong>{formatNumber.format(facilities.jalanAspalMeter)} m</strong></p><p className="flex items-center justify-between gap-2"><span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" />Beton/semen</span><strong>{formatNumber.format(facilities.jalanBetonMeter)} m</strong></p></div>
            </div>
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

import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Users, Ruler, Layers3, ChartNoAxesColumnIncreasing } from "lucide-react";

export const metadata: Metadata = {
  title: "Statistik Kelurahan Taratara Tiga",
  description: "Ringkasan data penduduk dan wilayah Kelurahan Taratara Tiga berdasarkan publikasi BPS Kota Tomohon.",
};

const data = {
  tahunData: 2024,
  penduduk: 2543,
  lakiLaki: 1310,
  perempuan: 1233,
  luas: 6.8,
  kepadatan: 373.97,
  lingkungan: 7,
  bagianKecamatan: 15.69,
  rasioJenisKelamin: 106.24,
};

const formatNumber = new Intl.NumberFormat("id-ID");
const formatDecimal = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const lakiLakiPercent = (data.lakiLaki / data.penduduk) * 100;
const profil2024 = {
  penduduk: 1610,
  lakiLaki: 833,
  perempuan: 777,
  keluarga: 483,
  luasHa: 743.21,
  pustu: 1,
  posyandu: 1,
  dokter: 1,
  bidan: 1,
  perawat: 1,
  sumurPompa: 18,
  sumurGali: 115,
  mataAir: 7,
  jalanAspalMeter: 2410,
  jalanBetonMeter: 367,
  kios: 13,
  usahaTernak: 8,
  usahaPerikanan: 1,
};

const cards = [
  { label: "Jumlah penduduk", value: formatNumber.format(data.penduduk), unit: "jiwa", icon: Users, note: "Data tahun 2024" },
  { label: "Luas wilayah", value: formatDecimal.format(data.luas), unit: "km²", icon: Ruler, note: "Luas daratan" },
  { label: "Kepadatan", value: formatDecimal.format(data.kepadatan), unit: "jiwa/km²", icon: ChartNoAxesColumnIncreasing, note: "Penduduk per luas wilayah" },
  { label: "Lingkungan", value: formatNumber.format(data.lingkungan), unit: "lingkungan", icon: Layers3, note: "Satuan lingkungan setempat" },
];

const cardStyle = "rounded-[26px] border border-[var(--line)] bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,75,53,.06)] backdrop-blur-sm dark:bg-[#0a2d26]/80 sm:p-6";

export default function StatistikPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-28 sm:px-6 md:pb-20">
      <header className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-gradient-to-br from-emerald-50 via-white/80 to-cyan-50 p-6 dark:from-emerald-950/60 dark:via-[#0a2d26] dark:to-cyan-950/40 sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[.13em] text-[var(--primary)] dark:bg-white/5">
            <MapPin size={14} aria-hidden="true" /> Profil wilayah
          </p>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-.04em] sm:text-5xl">Taratara Tiga dalam angka</h1>
          <p className="text-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            Ringkasan penduduk dan kondisi wilayah Kelurahan Taratara Tiga. Angka yang ditampilkan bersumber dari publikasi BPS Kota Tomohon, dengan periode data 2024.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-200" /> Data {data.tahunData}
          </div>
        </div>
      </header>

      <section aria-labelledby="ringkasan-heading" className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Ringkasan</p>
          <h2 id="ringkasan-heading" className="mt-1 text-xl font-extrabold sm:text-2xl">Gambaran wilayah</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, value, unit, icon: Icon, note }) => (
            <article key={label} className={cardStyle}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Icon size={20} aria-hidden="true" /></span>
                <span className="text-right text-xs font-semibold text-muted">{note}</span>
              </div>
              <p className="mt-5 text-sm font-semibold text-muted">{label}</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span className="text-3xl font-extrabold tracking-tight">{value}</span>
                <span className="text-sm font-semibold text-muted">{unit}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="penduduk-heading" className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <article className={cardStyle}>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Kependudukan</p>
          <h2 id="penduduk-heading" className="mt-1 text-xl font-extrabold">Komposisi penduduk</h2>
          <p className="text-muted mt-2 text-sm leading-6">Jumlah penduduk menurut jenis kelamin, tahun {data.tahunData}.</p>

          <div className="mt-6" role="img" aria-label={`Dari ${formatNumber.format(data.penduduk)} jiwa, laki-laki ${formatNumber.format(data.lakiLaki)} (${formatDecimal.format(lakiLakiPercent)} persen) dan perempuan ${formatNumber.format(data.perempuan)} (${formatDecimal.format(100 - lakiLakiPercent)} persen).`}>
            <div className="flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div className="h-full bg-emerald-700" style={{ width: `${lakiLakiPercent}%` }} />
              <div className="h-full bg-teal-300" style={{ width: `${100 - lakiLakiPercent}%` }} />
            </div>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50/80 p-4 dark:bg-emerald-950/40">
              <dt className="flex items-center gap-2 text-sm font-bold"><span className="h-3 w-3 rounded-full bg-emerald-700" /> Laki-laki</dt>
              <dd className="mt-2 text-2xl font-extrabold">{formatNumber.format(data.lakiLaki)} <span className="text-sm font-semibold text-muted">jiwa · {formatDecimal.format(lakiLakiPercent)}%</span></dd>
            </div>
            <div className="rounded-2xl bg-teal-50/80 p-4 dark:bg-teal-950/40">
              <dt className="flex items-center gap-2 text-sm font-bold"><span className="h-3 w-3 rounded-full bg-teal-300" /> Perempuan</dt>
              <dd className="mt-2 text-2xl font-extrabold">{formatNumber.format(data.perempuan)} <span className="text-sm font-semibold text-muted">jiwa · {formatDecimal.format(100 - lakiLakiPercent)}%</span></dd>
            </div>
          </dl>
        </article>

        <article className={`${cardStyle} flex flex-col justify-between`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Skala kecamatan</p>
            <h2 className="mt-1 text-xl font-extrabold">Bagian dari Tomohon Barat</h2>
            <p className="text-muted mt-2 text-sm leading-6">Penduduk Taratara Tiga merupakan bagian dari jumlah penduduk Kecamatan Tomohon Barat.</p>
            <p className="mt-6 text-4xl font-extrabold tracking-tight text-[var(--primary)]">{formatDecimal.format(data.bagianKecamatan)}<span className="text-2xl">%</span></p>
            <p className="mt-1 text-sm font-semibold">dari 16.204 penduduk kecamatan</p>
          </div>
          <p className="text-muted mt-6 rounded-2xl bg-slate-50/80 p-4 text-sm leading-6 dark:bg-white/5">
            Rasio jenis kelamin tercatat {formatDecimal.format(data.rasioJenisKelamin)}: sekitar 106 laki-laki untuk setiap 100 perempuan.
          </p>
        </article>
      </section>

      <section aria-labelledby="profil-heading" className="mt-10">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Data lokal</p>
          <h2 id="profil-heading" className="mt-1 text-xl font-extrabold sm:text-2xl">Catatan dari Profil Kelurahan 2024</h2>
          <p className="text-muted mt-2 max-w-3xl text-sm leading-6">Angka di bawah berasal dari formulir profil kelurahan bulan Desember 2024. Kami tampilkan terpisah dari publikasi BPS karena beberapa nilai berbeda.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <article className={`${cardStyle} lg:col-span-1`}>
            <h3 className="text-base font-extrabold">Rekap penduduk pada profil</h3>
            <p className="mt-4 text-3xl font-extrabold">{formatNumber.format(profil2024.penduduk)} <span className="text-sm font-semibold text-muted">jiwa</span></p>
            <p className="text-muted mt-1 text-sm">{formatNumber.format(profil2024.keluarga)} kepala keluarga</p>
            <dl className="mt-5 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
              <div className="flex justify-between gap-3"><dt>Laki-laki</dt><dd className="font-bold">{formatNumber.format(profil2024.lakiLaki)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Perempuan</dt><dd className="font-bold">{formatNumber.format(profil2024.perempuan)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Luas pada formulir profil</dt><dd className="font-bold">{formatDecimal.format(profil2024.luasHa)} ha</dd></div>
            </dl>
          </article>

          <article className={`${cardStyle} lg:col-span-2`}>
            <h3 className="text-base font-extrabold">Fasilitas dan infrastruktur</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5">
                <p className="text-sm font-bold">Kesehatan</p>
                <p className="text-muted mt-2 text-sm leading-6">{profil2024.pustu} Puskesmas Pembantu · {profil2024.posyandu} Posyandu</p>
                <p className="text-muted text-sm leading-6">{profil2024.dokter} dokter · {profil2024.bidan} bidan · {profil2024.perawat} perawat</p>
              </div>
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5">
                <p className="text-sm font-bold">Sumber air yang tercatat</p>
                <p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(profil2024.sumurPompa)} sumur pompa · {formatNumber.format(profil2024.sumurGali)} sumur gali · {formatNumber.format(profil2024.mataAir)} mata air</p>
              </div>
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5">
                <p className="text-sm font-bold">Jalan kelurahan</p>
                <p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(profil2024.jalanAspalMeter)} m jalan aspal · {formatNumber.format(profil2024.jalanBetonMeter)} m jalan beton/semen</p>
              </div>
              <div className="rounded-2xl bg-slate-50/80 p-4 dark:bg-white/5">
                <p className="text-sm font-bold">Usaha yang tercatat</p>
                <p className="text-muted mt-2 text-sm leading-6">{formatNumber.format(profil2024.kios)} toko/kios · {formatNumber.format(profil2024.usahaTernak)} unit usaha peternakan · {formatNumber.format(profil2024.usahaPerikanan)} unit usaha perikanan</p>
              </div>
            </div>
          </article>
        </div>

        <aside className="mt-4 rounded-[24px] border border-amber-300/70 bg-amber-50/80 p-5 dark:border-amber-700/50 dark:bg-amber-950/25">
          <h3 className="text-sm font-extrabold">Perlu rekonsiliasi angka</h3>
          <p className="mt-1 text-sm leading-6 text-amber-950/80 dark:text-amber-100/80">
            Untuk tahun 2024, formulir profil mencatat {formatNumber.format(profil2024.penduduk)} penduduk dan {formatDecimal.format(profil2024.luasHa)} ha, sedangkan BPS mencatat {formatNumber.format(data.penduduk)} penduduk dan {formatDecimal.format(data.luas)} km². Sumber dan cakupan kedua catatan berbeda; mohon verifikasi ke kelurahan sebelum memakai angka profil sebagai angka resmi.
          </p>
        </aside>
      </section>

      <section aria-label="Sejarah kelurahan" className={`${cardStyle} mt-6`}>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Sejarah wilayah</p>
        <p className="mt-2 text-sm leading-7">
          Menurut dokumen sejarah kelurahan, Taratara Tiga dimekarkan dari Taratara Dua pada 7 September 2009 berdasarkan Peraturan Daerah Kota Tomohon Nomor 12 Tahun 2009.
        </p>
      </section>

      <aside className="mt-6 rounded-[24px] border border-[var(--line)] bg-white/60 p-5 dark:bg-white/5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-sm font-extrabold">Sumber dan catatan data</p>
          <p className="text-muted mt-1 max-w-3xl text-xs leading-6">
            Diolah dari tabel 1.1, 2.1.1, dan 3.1 dalam <em>Kecamatan Tomohon Barat Dalam Angka 2025</em>. Publikasi dirilis BPS Kota Tomohon pada 26 September 2025; angka wilayah mengacu pada 2024 dan bersumber dari kantor kecamatan/kelurahan. Persentase dan kepadatan pada halaman ini mengikuti angka publikasi BPS.
          </p>
        </div>
        <a href="https://tomohonkota.bps.go.id/id/publication/2025/09/26/eaf1e289e3030b5c20d8b874/kecamatan-tomohon-barat-dalam-angka-2025.html" target="_blank" rel="noreferrer" className="focus-ring mt-4 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary-soft)] dark:bg-white/10 sm:mt-0">
          Buka publikasi BPS <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </aside>
    </main>
  );
}

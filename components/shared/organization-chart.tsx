import { Landmark } from "lucide-react";

const divisions = [
  { title: "Kasi. Pemerintahan dan Trantib", name: "Bernhard J. Pandey, S.Sos", assistant: "Pembantu Kasi. Pemerintahan dan Trantib" },
  { title: "Kasi. Pembangunan", name: null, assistant: "Pembantu Kasi. Pembangunan" },
  { title: "Kasi. Kesra", name: null, assistant: "Pembantu Kasi. Kesra" },
  { title: "Kasi. Keuangan", name: null, assistant: "Pembantu Kasi. Keuangan" },
];

const lingkungan = [
  { roman: "I", kepala: "Meigi L. Runtu", wakil: "Agustus Naflalia" },
  { roman: "II", kepala: "Silvan Mathias", wakil: "Meiritha Suot" },
  { roman: "III", kepala: "Jacob Sambeka", wakil: "Linda Pantow" },
  { roman: "IV", kepala: "Charlis J. Dagi", wakil: "Ramli Sambeka" },
  { roman: "V", kepala: "Agustinus H. Wewengkang", wakil: "Linda M. Linu" },
  { roman: "VI", kepala: "Bobby P. Morong", wakil: "Ismael O. Suot" },
  { roman: "VII", kepala: "Yulius Golung", wakil: "Joine Watulingas" },
];

const card = "rounded-xl border border-[var(--line)] bg-white/90 shadow-sm dark:bg-[#123d33]";

export function OrganizationChart() {
  return <section aria-labelledby="organization-title" className="mt-14 scroll-mt-28">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h2 id="organization-title" className="text-2xl font-extrabold sm:text-3xl">Struktur Pemerintahan Kelurahan Taratara Tiga</h2></div>
    </div>

    <div className="mt-6 overflow-x-auto rounded-[30px] border border-[var(--line)] bg-gradient-to-br from-white/80 via-emerald-50/65 to-cyan-50/75 p-5 shadow-[0_18px_50px_rgba(15,75,53,.08)] dark:from-[#0a2d26]/85 dark:via-emerald-950/35 dark:to-cyan-950/35 sm:p-8">
      <div className="mx-auto min-w-[1100px]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5">
          <article className={`${card} justify-self-end w-[225px] overflow-hidden`}><div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2 text-center text-[10px] font-extrabold uppercase tracking-wide text-white">Kelompok jabatan fungsional</div><p className="p-3 text-center text-xs text-muted">Kelompok jabatan</p></article>
          <article className="relative w-[280px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#075e4a] to-[#078466] p-5 text-white shadow-xl shadow-emerald-900/15">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/20"/><div className="absolute -right-1 -top-1 h-14 w-14 rounded-full border border-white/20"/>
            <div className="relative flex items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15"><Landmark size={22}/></span><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-emerald-100">Pimpinan kelurahan</p><h3 className="mt-1 text-lg font-extrabold">Lurah</h3><p className="mt-0.5 text-xs text-white/85">Rommy N. Loho, SH</p></div></div>
          </article>
          <article className={`${card} w-[225px] overflow-hidden`}><div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2 text-center text-[10px] font-extrabold uppercase tracking-wide text-white">Sekretariat</div><div className="p-3 text-center"><h3 className="text-sm font-extrabold">Seklur</h3><p className="mt-1 text-xs text-muted">Ruddy J. Lobo, SE</p></div></article>
        </div>

        <div className="mx-auto h-7 w-1/2 border-l-2 border-emerald-700/35" aria-hidden="true"/>
        <div className="relative grid grid-cols-4 gap-4 pt-6 before:absolute before:left-[12.5%] before:right-[12.5%] before:top-0 before:border-t-2 before:border-emerald-700/35">
          {divisions.map((division) => <div key={division.title} className="relative flex flex-col items-center before:absolute before:-top-6 before:left-1/2 before:h-6 before:border-l-2 before:border-emerald-700/35">
            <article className={`${card} min-h-[100px] w-full overflow-hidden`}><div className="min-h-12 bg-gradient-to-r from-emerald-700 to-emerald-600 px-3 py-2 text-center text-[11px] font-extrabold uppercase leading-4 text-white">{division.title}</div><p className="flex min-h-11 items-center justify-center px-2 py-2 text-center text-xs font-semibold">{division.name ?? <span className="text-muted">—</span>}</p></article>
            <div className="h-5 border-l-2 border-emerald-700/35" aria-hidden="true"/>
            <article className={`${card} min-h-[86px] w-full overflow-hidden`}><div className="min-h-12 bg-emerald-100/80 px-3 py-2 text-center text-[10px] font-bold uppercase leading-4 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-50">{division.assistant}</div><p className="flex min-h-9 items-center justify-center px-2 py-1.5 text-center text-[10px] text-muted">—</p></article>
          </div>)}
        </div>

        <div className="mx-auto h-8 w-1/2 border-l-2 border-emerald-700/35" aria-hidden="true"/>
        <div className="mx-auto w-fit rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-6 py-3 text-center text-xs font-extrabold uppercase leading-5 tracking-wide text-white shadow-md">Kepala Lingkungan dan Wakilnya</div>
        <div className="mx-auto h-7 w-1/2 border-l-2 border-emerald-700/35" aria-hidden="true"/>
        <div className="relative grid grid-cols-7 gap-2 pt-6 before:absolute before:left-[7.14%] before:right-[7.14%] before:top-0 before:border-t-2 before:border-emerald-700/35">
          {lingkungan.map((item) => <article key={item.roman} className="relative flex flex-col items-center before:absolute before:-top-6 before:left-1/2 before:h-6 before:border-l-2 before:border-emerald-700/35">
            <p className="mb-2 text-xl font-black tracking-wide text-[var(--primary)]" aria-label={`Lingkungan ${item.roman}`}>{item.roman}</p>
            <div className={`${card} w-full overflow-hidden`}><div className="bg-emerald-700 px-2 py-2 text-center text-[9px] font-extrabold uppercase leading-3.5 text-white">Kepala Lingkungan</div><p className="flex min-h-[48px] items-center justify-center px-2 py-2 text-center text-[11px] font-bold leading-4">{item.kepala}</p><div className="mx-3 border-t border-[var(--line)]"/><div className="bg-emerald-100/80 px-2 py-2 text-center text-[9px] font-bold uppercase leading-3.5 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-50">Wakil Kepala Lingkungan</div><p className="flex min-h-[48px] items-center justify-center px-2 py-2 text-center text-[11px] font-semibold leading-4">{item.wakil}</p></div>
          </article>)}
        </div>
      </div>
      <p className="text-muted mt-4 text-center text-[11px] sm:hidden">Geser bagan ke samping untuk melihat seluruh susunan.</p>
    </div>
  </section>;
}

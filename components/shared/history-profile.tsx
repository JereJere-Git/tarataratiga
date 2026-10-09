"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CalendarDays, Church, Mountain, Music2, Sprout, UsersRound } from "lucide-react";

const chapters = [
  { year: "1303", title: "Singgah di mata air Kemer", text: "Sejumlah Tonaas dari Sarongsong-Toumuung sedang menempuh perjalanan menuju pantai Tambala untuk membuat garam. Saat hari mulai gelap, mereka beristirahat di dekat mata air yang kini dikenal sebagai Kemer." },
  { year: "Nama Taratara", title: "Dari bunyi rawa menjadi nama kampung", text: "Di sekitar mata air tumbuh rumput berbunga yang mengeluarkan bunyi “taz-taz” ketika terinjak. Setelah mendengar burung manguni makasiow, para Tonaas mendirikan popo atau lawih, tempat berteduh sederhana. Cerita tutur ini kemudian menghubungkan bunyi Taza-Taza dengan nama Taratara yang disebut Hukum Tua Wilar." },
  { year: "1916–1946", title: "Pusat pemerintahan wilayah", text: "Pada masa Hukum Tua Wellem M. Pongoh, Taratara menjadi bagian Onder District Tombariri dan kantor Hukum Kedua berada di Taratara. Sejak 1946, wilayah ini masuk District Tomohon." },
  { year: "1978–2004", title: "Taratara berkembang", text: "Taratara dimekarkan menjadi Desa Taratara Satu dan Taratara Dua pada 1978. Setelah Kota Tomohon berdiri pada 2004, keduanya berubah status menjadi kelurahan." },
  { year: "7 September 2009", title: "Kelurahan Taratara Tiga berdiri", text: "Peraturan Daerah Kota Tomohon Nomor 12 Tahun 2009 menetapkan pemekaran Taratara. Kelurahan Taratara Tiga terbentuk dari Kelurahan Taratara Dua." },
];

const leaders = {
  tonaas: {
    label: "Tonaas yang dikenal dalam cerita Taratara",
    people: [
      ["Tonaas Tulong", "hingga 1630"],
      ["Tonaas Kalangi", "mulai 1630 · akhir masa tidak tercatat"],
      ["Tonaas Tambingon", "hingga 1650"],
      ["Tonaas Sembel", "mulai 1650 · akhir masa tidak tercatat"],
      ["Tonaas Lontoh", "hingga sekitar 1780"],
    ],
  },
  hukumTua: {
    label: "Hukum Tua Taratara",
    people: [
      ["Wilar", "1780–1810"], ["Roring", "1810–1815"], ["Kandow", "1815–1840"], ["Wati Roring", "1840–1850"],
      ["Daniel Wohon", "1850–1867"], ["Salmon Sorey", "1867–1874"], ["Barnabas P. Roring", "1874–1884"], ["Rumajar Kereh", "1884–1903"],
      ["Semuel M. Pongoh", "1903–1904"], ["Daud I. Kereh", "1904–1916"], ["Wellem M. Pongoh", "1916–1933"], ["Alpius W. Pongoh", "1933–1946"],
      ["Dien E.E. Lonta", "1946–1953"], ["I.W. Palandi", "1953 · pejabat"], ["Pieter Tangkuman", "1953–1959"], ["Jan A. Tamboto", "1959–1960 · pejabat"],
      ["Sembel G. Suot", "1960–1961"], ["Jan A. Tamboto", "1961–1964"], ["Piter Tangkuman", "1964–1978"],
    ],
  },
  tarataraTiga: {
    label: "Lurah Taratara Tiga",
    people: [
      ["John P. Lonta, S.Hut, M.AP", "2009–2018"],
      ["Jeffry P. Loho, SE", "2018–2021"],
      ["Rommy N. Loho, SH", "2021–sekarang · sesuai dokumen"],
    ],
  },
  tarataraDua: {
    label: "Pemimpin Taratara Dua",
    people: [
      ["Hanoch Z. Pandey", "1978–1982; 1982–2002"],
      ["Lambertus Lendeng", "1982 · pejabat"],
      ["Daniel Wohon Lonta", "2002–2005; lurah 2005–2009"],
      ["Jeffry P. Loho, SE", "2009–2017"],
      ["John P. Lonta, S.Hut, MAP", "2017–sekarang · sesuai dokumen"],
    ],
  },
  tarataraSatu: {
    label: "Pemimpin Taratara Satu",
    people: [
      ["Thomas Ramoh", "1978–1980 · pejabat"],
      ["Romaldus Turambi", "1980–1993"],
      ["Israel Lonta", "1993–2009"],
      ["Jeand Arc Mentang, SPd", "Lurah Taratara · 2009–2015"],
      ["Jeffry S. Mentang, S.Kep", "2015–sekarang · sesuai dokumen"],
    ],
  },
} as const;

type ProfileTab = "kisah" | "linimasa" | "pemimpin" | "budaya";
type LeaderGroup = keyof typeof leaders;

export function HistoryProfile() {
  const [tab, setTab] = useState<ProfileTab>("kisah");
  const [chapter, setChapter] = useState(0);
  const [leaderGroup, setLeaderGroup] = useState<LeaderGroup>("tarataraTiga");
  const tabs: { id: ProfileTab; label: string; icon: typeof BookOpen }[] = [
    { id: "kisah", label: "Kisah asal-usul", icon: BookOpen },
    { id: "linimasa", label: "Linimasa", icon: CalendarDays },
    { id: "pemimpin", label: "Para pemimpin", icon: UsersRound },
    { id: "budaya", label: "Budaya & potensi", icon: Music2 },
  ];

  return <div>
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex min-w-full gap-2 rounded-full border border-[var(--line)] bg-white/55 p-1.5 dark:bg-white/5 sm:min-w-0" role="tablist" aria-label="Jelajahi profil kelurahan">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} id={`profil-tab-${id}`} type="button" role="tab" aria-selected={tab === id} aria-controls="profil-panel" onClick={() => setTab(id)} className={`focus-ring flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-bold transition-colors sm:text-sm ${tab === id ? "bg-[var(--primary)] text-white shadow-md" : "text-muted hover:bg-white/70 dark:hover:bg-white/10"}`}><Icon size={15} />{label}</button>)}
      </div>
    </div>

    <div id="profil-panel" role="tabpanel" aria-labelledby={`profil-tab-${tab}`} className="mt-4 min-h-[390px]">
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {tab === "kisah" && <section className="relative overflow-hidden rounded-[30px] border border-[var(--line)] bg-gradient-to-br from-[#073d32] via-[#087f62] to-[#18a87d] p-6 text-white shadow-[0_24px_60px_rgba(7,61,50,.2)] sm:p-10">
            <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border border-white/15" /><div className="pointer-events-none absolute -right-2 -top-7 h-40 w-40 rounded-full border border-white/15" />
            <div className="relative grid gap-8 md:grid-cols-[.72fr_1.28fr] md:items-center">
              <div className="rounded-[26px] border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-7"><p className="text-xs font-bold uppercase tracking-[.17em] text-emerald-100">Cerita tutur</p><p className="mt-2 text-6xl font-extrabold tracking-[-.07em] sm:text-7xl">1303</p><p className="mt-2 text-sm text-white/75">awal kisah Taratara dalam naskah sejarah</p><div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-100"><Mountain size={16} /> Mata air Kemer · Tambala</div></div>
              <div><p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-100">Jejak sebuah nama</p><h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-.04em] sm:text-4xl">Dari bunyi “taz-taz” menjadi Taratara</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">Menurut kisah dalam dokumen sejarah, para Tonaas dari Sarongsong-Toumuung berhenti di dekat mata air Kemer saat perjalanan mencari garam di pantai Tambala. Mereka mendengar bunyi burung manguni makasiow, lalu mendirikan popo atau lawih untuk bermalam. Rumput berbunga di rawa sekitar mata air berbunyi “taz-taz” ketika terinjak. Cerita nama Taza-Taza itu kemudian berkembang menjadi Taratara, nama yang dikaitkan dengan Hukum Tua Wilar.</p><p className="mt-5 border-l-2 border-emerald-200/70 pl-4 text-sm italic leading-6 text-emerald-50">Sebuah tempat beristirahat menjadi awal cerita yang diwariskan lintas generasi.</p></div>
            </div>
          </section>}

          {tab === "linimasa" && <section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-[28px] border border-[var(--line)] bg-white/65 p-5 dark:bg-white/5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--accent)]">Pilih babak</p><h2 className="mt-1 text-2xl font-extrabold">Perjalanan waktu</h2><div className="mt-5 space-y-2" role="group" aria-label="Babak sejarah Taratara">{chapters.map((item, index) => <button key={item.year} type="button" aria-pressed={chapter === index} onClick={() => setChapter(index)} className={`focus-ring flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-left transition ${chapter === index ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--primary-soft)]"}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${chapter === index ? "bg-white/20" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>{String(index + 1).padStart(2, "0")}</span><span><span className="block text-xs font-extrabold">{item.year}</span><span className={`block text-[11px] ${chapter === index ? "text-white/75" : "text-muted"}`}>{item.title}</span></span></button>)}</div></div>
            <article className="relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 dark:from-emerald-950/50 dark:to-cyan-950/40 sm:p-9"><div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl"/><div className="relative"><p className="text-xs font-bold uppercase tracking-[.17em] text-[var(--primary)]">{chapters[chapter].year}</p><h3 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-[-.04em]">{chapters[chapter].title}</h3><p className="text-muted mt-5 max-w-2xl text-sm leading-7 sm:text-base">{chapters[chapter].text}</p></div><div className="relative mt-8 flex items-center justify-between"><span className="text-xs font-semibold text-muted">Babak {chapter + 1} dari {chapters.length}</span><div className="flex gap-2"><button type="button" onClick={() => setChapter((chapter + chapters.length - 1) % chapters.length)} className="focus-ring min-h-10 rounded-full border border-[var(--line)] px-4 text-xs font-bold">Sebelumnya</button><button type="button" onClick={() => setChapter((chapter + 1) % chapters.length)} className="focus-ring min-h-10 rounded-full bg-[var(--primary)] px-4 text-xs font-bold text-white">Berikutnya</button></div></div></article>
          </section>}

          {tab === "pemimpin" && <section className="rounded-[28px] border border-[var(--line)] bg-white/65 p-5 dark:bg-white/5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--accent)]">Tongkat kepemimpinan</p><h2 className="mt-1 text-2xl font-extrabold">Para pemimpin Taratara</h2><p className="text-muted mt-2 text-sm">Pilih masa atau wilayah untuk melihat daftar nama dan periode.</p></div><div className="flex gap-2 overflow-x-auto pb-1">{(Object.keys(leaders) as LeaderGroup[]).map((key) => <button key={key} type="button" aria-pressed={leaderGroup === key} onClick={() => setLeaderGroup(key)} className={`focus-ring min-h-10 shrink-0 rounded-full px-4 text-xs font-bold ${leaderGroup === key ? "bg-[var(--primary)] text-white" : "border border-[var(--line)]"}`}>{key === "tonaas" ? "Tonaas" : key === "hukumTua" ? "Hukum Tua" : key === "tarataraTiga" ? "Taratara Tiga" : key === "tarataraDua" ? "Taratara Dua" : "Taratara Satu"}</button>)}</div></div>
            <h3 className="mt-6 text-sm font-extrabold text-[var(--primary)]">{leaders[leaderGroup].label}</h3><ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{leaders[leaderGroup].people.map(([name, period], index) => <li key={`${name}-${period}`} className="flex gap-3 rounded-2xl bg-[var(--primary-soft)]/55 p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-extrabold text-white">{index + 1}</span><span><strong className="block text-sm">{name}</strong><span className="text-muted mt-1 block text-xs">{period}</span></span></li>)}</ol>
            <p className="text-muted mt-4 text-xs leading-5">Dokumen sejarah mencatat daftar beberapa pemimpin wilayah lain yang masa jabatannya bertumpang tindih; keterangan periode ditampilkan sebagaimana tertulis dalam sumber.</p>
          </section>}

          {tab === "budaya" && <section className="rounded-[28px] border border-[var(--line)] bg-white/65 p-5 dark:bg-white/5 sm:p-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--accent)]">Hidup bersama alam</p><h2 className="mt-1 text-2xl font-extrabold">Pertanian, mapalus, dan seni</h2><p className="text-muted mt-3 text-sm leading-7">Dokumen menggambarkan kawasan Taratara Raya sebagai wilayah pertanian dengan kebun kelapa dan cengkeh, sawah, ladang padi dan jagung, serta hortikultura. Hasil tani dipasarkan ke Pasar Tomohon. Catatan di bawah ini merujuk pada kawasan Taratara Raya dalam dokumen, bukan angka khusus Kelurahan Taratara Tiga.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><article className="rounded-2xl bg-[var(--primary-soft)]/60 p-5"><Sprout className="text-[var(--primary)]"/><h3 className="mt-3 font-extrabold">Pertanian</h3><p className="text-muted mt-2 text-xs leading-5">Kelapa, cengkeh, padi, jagung, dan tanaman hortikultura.</p></article><article className="rounded-2xl bg-[var(--primary-soft)]/60 p-5"><UsersRound className="text-[var(--primary)]"/><h3 className="mt-3 font-extrabold">Mapalus</h3><p className="text-muted mt-2 text-xs leading-5">Semangat kerja bersama dan gotong royong dalam kehidupan warga.</p></article><article className="rounded-2xl bg-[var(--primary-soft)]/60 p-5"><Music2 className="text-[var(--primary)]"/><h3 className="mt-3 font-extrabold">Seni & tradisi</h3><p className="text-muted mt-2 text-xs leading-5">Maengket, zumani, kolintang, musik bambu, dan kawasaran.</p></article><article className="rounded-2xl bg-[var(--primary-soft)]/60 p-5"><Church className="text-[var(--primary)]"/><h3 className="mt-3 font-extrabold">Kebersamaan</h3><p className="text-muted mt-2 text-xs leading-5">Kelompok sosial duka, sosial suka (mahmejaan), serta porsi.</p></article></div><p className="text-muted mt-4 text-[11px] leading-5">Dalam catatan sejarah 2017, sekitar 85% mata pencaharian masyarakat Taratara Raya disebut sebagai petani. Angka ini berskala kawasan Taratara Raya dan tidak digunakan sebagai persentase khusus Taratara Tiga.</p></section>}

        </motion.div>
      </AnimatePresence>
    </div>
  </div>;
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Home, Menu, X, MessageCircle, Newspaper, CalendarDays, MapPinned, ChevronDown, Images, FileText, Store, LayoutGrid, Map as MapIcon, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/shared/command-palette";

const links = [["Profil", "/#profil"], ["Layanan", "/#layanan"], ["Peta", "/peta"], ["Statistik", "/statistik"], ["Berita", "/berita"], ["Kontak", "/kontak"]] as const;

const informationLinks = [
  { label: "Agenda", description: "Jadwal kegiatan warga", href: "/agenda", icon: CalendarDays },
  { label: "Galeri", description: "Dokumentasi kegiatan", href: "/galeri", icon: Images },
  { label: "Dokumen", description: "Unduhan dan formulir", href: "/dokumen", icon: FileText },
  { label: "Lokasi Penting", description: "Daftar tempat penting", href: "/lokasi", icon: MapPinned },
  { label: "UMKM", description: "Informasi usaha warga", href: "/#keunggulan", icon: Store },
] as const;

export function FloatingNav() {
  const { scrollY } = useScroll();
  const padding = useTransform(scrollY, [0, 120], ["0.5rem", "0.25rem"]);
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const informationOpen = hoverOpen || pinned;
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const informationButtonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const informationActive = informationLinks.some((item) => isActive(item.href));

  function closeInformation() {
    setHoverOpen(false);
    setPinned(false);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setHoverOpen(false);
      setPinned(false);
      setOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setHoverOpen(false);
        setPinned(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setHoverOpen(false);
        setPinned(false);
        informationButtonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function moveInformationFocus(index: number) {
    const next = (index + informationLinks.length) % informationLinks.length;
    itemRefs.current[next]?.focus();
  }

  return <div ref={menuRef} className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-6xl -translate-x-1/2">
    <motion.nav style={{ padding }} className="glass-pill !overflow-visible flex w-full items-center justify-between px-4">
      <Link href="/" className="focus-ring flex min-h-11 items-center gap-3 rounded-full"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white"><Home size={18} /></span><span className="hidden text-sm font-bold sm:block">Kelurahan Taratara Tiga</span></Link>
      <div className="hidden items-center gap-1 md:flex">
        {links.map(([label, href]) => <Link key={label} href={href} className={`focus-ring rounded-full px-3 py-2 text-sm font-semibold hover:bg-white/50 ${isActive(href) ? "bg-[var(--primary)] text-white" : ""}`}>{label}</Link>)}

        {/* Hanya area ini (tombol + panel) yang merespons hover */}
        <div
          ref={infoRef}
          className="relative"
          onMouseEnter={() => setHoverOpen(true)}
          onMouseLeave={() => setHoverOpen(false)}
          onBlur={(event) => {
            if (event.relatedTarget && !infoRef.current?.contains(event.relatedTarget as Node)) closeInformation();
          }}
        >
          <button
            ref={informationButtonRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={informationOpen}
            onClick={() => setPinned((value) => !value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setPinned(true);
                requestAnimationFrame(() => itemRefs.current[0]?.focus());
              }
            }}
            className={`focus-ring flex min-h-10 items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold hover:bg-white/50 ${informationActive || informationOpen ? "bg-[var(--primary-soft)]" : ""}`}
          >
            <LayoutGrid size={15} />Lainnya<ChevronDown size={14} className={informationOpen ? "rotate-180" : ""} />
          </button>

          {informationOpen && (
            <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.16 }}
                role="menu"
                aria-label="Menu lainnya"
                className="w-[min(320px,calc(100vw-32px))] rounded-[24px] border border-[var(--line)] bg-white/95 p-2 text-[var(--foreground)] shadow-[0_18px_45px_rgba(21,82,45,.2)] dark:bg-[#102b1a]/95"
              >
                {informationLinks.map(({ label, description, href, icon: Icon }, index) => (
                  <Link
                    key={label}
                    ref={(element) => { itemRefs.current[index] = element; }}
                    href={href}
                    role="menuitem"
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") { event.preventDefault(); moveInformationFocus(index + 1); }
                      if (event.key === "ArrowUp") { event.preventDefault(); moveInformationFocus(index - 1); }
                      if (event.key === "Escape") { closeInformation(); informationButtonRef.current?.focus(); }
                    }}
                    onClick={closeInformation}
                    className="focus-ring flex items-start gap-3 rounded-2xl px-3 py-2.5 hover:bg-[var(--primary-soft)]"
                  >
                    <Icon size={17} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                    <span><span className="block text-sm font-bold">{label}</span><span className="text-xs text-muted">{description}</span></span>
                  </Link>
                ))}
              </motion.div>
            </div>
          )}
        </div>

        <CommandPalette /><Link href="/pengaduan" className="focus-ring ml-2 flex min-h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-4 text-sm font-bold text-white"><MessageCircle size={16} />Buat Pengaduan</Link>
      </div>
      <div className="flex items-center gap-2 md:hidden"><CommandPalette /><button className="focus-ring glass-pill flex h-11 w-11 items-center justify-center" aria-label={open ? "Tutup menu" : "Buka menu"} onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button></div>
      {open && <div className="glass-strong absolute left-0 right-0 top-[calc(100%+10px)] p-3 md:hidden">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)} className={`focus-ring block rounded-2xl px-4 py-3 font-semibold ${isActive(href) ? "bg-[var(--primary)] text-white" : ""}`}>{label}</Link>)}<details className="rounded-2xl px-4 py-2"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">Lainnya<ChevronDown size={16} /></summary>{informationLinks.map(({ label, href, icon: Icon }) => <Link key={label} href={href} onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-2 pl-3 text-sm font-semibold"><Icon size={16} />{label}</Link>)}</details><Link href="/pengaduan" className="mt-2 block rounded-2xl bg-[var(--primary)] px-4 py-3 font-bold text-white">Buat Pengaduan</Link></div>}
    </motion.nav>
  </div>;
}

export function BottomTabBar() {
  const pathname = usePathname();
  const tabs = [["Beranda", "/", Home], ["Layanan", "/#layanan", Menu], ["Peta", "/peta", MapIcon], ["Statistik", "/statistik", TrendingUp], ["Berita", "/berita", Newspaper]] as const;
  return <nav className="glass-pill fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 items-center justify-around p-2 md:hidden">{tabs.map(([label, href, Icon]) => <Link key={href} href={href} className={`focus-ring flex min-h-11 min-w-11 flex-col items-center justify-center rounded-full text-[10px] font-bold ${pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) ? "bg-[var(--primary)] text-white" : ""}`}><Icon size={17} /><span>{label}</span></Link>)}</nav>;
}
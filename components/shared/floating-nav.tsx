"use client";

import { Home, Menu, X, MessageCircle, MapPinned, Images, Store, Map as MapIcon, TrendingUp, UserRound, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { label: "Profil", href: "/#profil", icon: UserRound },
  { label: "Layanan", href: "/#layanan", icon: ClipboardList },
  { label: "Peta", href: "/peta", icon: MapIcon },
  { label: "Statistik", href: "/statistik", icon: TrendingUp },
  { label: "Galeri", href: "/#galeri", icon: Images },
  { label: "Fasilitas", href: "/#fasilitas", icon: MapPinned },
  { label: "UMKM", href: "/umkm", icon: Store },
  { label: "Kontak", href: "/#hubungi", icon: MessageCircle },
] as const;

export function FloatingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setOpen(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-6xl -translate-x-1/2">
    <nav className="glass-pill relative flex min-h-14 w-full items-center justify-between px-3 sm:px-4">
      <Link href="/" className="focus-ring flex min-h-11 min-w-0 items-center gap-2 rounded-full"><span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--line)] bg-white p-0.5"><Image src="/logo-tomohon.png" alt="Logo Tomohon" width={40} height={40} priority className="h-full w-full rounded-full object-cover" /></span><span className="truncate text-xs font-bold sm:text-sm">Kelurahan Taratara Tiga</span></Link>
      <div className="hidden items-center gap-0.5 xl:flex">
        {links.map(({ label, href }) => <Link key={label} href={href} className={`focus-ring rounded-full px-2.5 py-2 text-sm font-semibold hover:bg-white/50 ${isActive(href) ? "bg-[var(--primary)] text-white" : ""}`}>{label}</Link>)}
        <Link href="/#aspirasi" className="focus-ring ml-2 flex min-h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-4 text-sm font-bold text-white"><MessageCircle size={16} />Aspirasi</Link>
      </div>
      <div className="xl:hidden"><button className="focus-ring glass-pill flex h-10 w-10 items-center justify-center" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button></div>
    </nav>
    {open && <div id="mobile-navigation" className="glass-strong absolute left-0 right-0 top-[calc(100%+8px)] max-h-[calc(100dvh-100px)] w-full overflow-y-auto rounded-[24px] p-2.5 xl:hidden"><div className="flex flex-col gap-1">{links.map(({ label, href, icon: Icon }) => <Link key={label} href={href} onClick={() => setOpen(false)} className={`focus-ring flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${isActive(href) ? "bg-[var(--primary)] text-white" : "hover:bg-white/50"}`}><Icon size={16} className="shrink-0" />{label}</Link>)}</div><Link href="/#aspirasi" onClick={() => setOpen(false)} className="mt-2 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-3 text-sm font-bold text-white"><MessageCircle size={15} />Aspirasi</Link></div>}
  </div>;
}

export function BottomTabBar() {
  const pathname = usePathname();
  const tabs = [["Beranda", "/", Home], ["Layanan", "/#layanan", Menu], ["Peta", "/peta", MapIcon], ["Statistik", "/statistik", TrendingUp], ["Kontak", "/#hubungi", MessageCircle]] as const;
  return <nav className="glass-pill fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 items-center justify-around p-2 xl:hidden">{tabs.map(([label, href, Icon]) => <Link key={href} href={href} className={`focus-ring flex min-h-11 min-w-11 flex-col items-center justify-center rounded-full text-[10px] font-bold ${pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) ? "bg-[var(--primary)] text-white" : ""}`}><Icon size={17} /><span>{label}</span></Link>)}</nav>;
}

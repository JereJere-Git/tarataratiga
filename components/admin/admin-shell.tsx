"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Newspaper, ClipboardList, CalendarDays, Images, FileText, Users, Building2, MessageSquareWarning, UserCog, MapPinned, Store, Sprout, Menu, X, PanelLeftClose, PanelLeftOpen, LogOut, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/lib/supabase/admin";
import { CursorGlow } from "@/components/shared/cursor-glow";

const items = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Berita", "/admin/berita", Newspaper],
  ["Layanan", "/admin/layanan", ClipboardList],
  ["Agenda", "/admin/agenda", CalendarDays],
  ["Galeri", "/admin/galeri", Images],
  ["Dokumen", "/admin/dokumen", FileText],
  ["Pejabat", "/admin/pejabat", Users],
  ["Profil", "/admin/profil", Building2],
  ["Lokasi penting", "/admin/lokasi", MapPinned],
  ["UMKM", "/admin/umkm", Store],
  ["Potensi wilayah", "/admin/potensi", Sprout],
  ["Pengaduan", "/admin/pengaduan", MessageSquareWarning],
  ["Statistik", "/admin/statistik", TrendingUp],
] as const;

export function AdminShell({ children, profile }: { children: React.ReactNode; profile: { nama: string; peran: AdminRole } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();
  const navigation = profile.peran === "admin" ? [...items, ["Pengguna", "/admin/pengguna", UserCog] as const] : items;

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <CursorGlow />

      {/* Sidebar desktop: menempel di kiri, setinggi layar */}
      <aside
        className={cn(
          "glass !fixed inset-y-0 left-0 z-50 hidden h-[100dvh] flex-col !rounded-none !border-y-0 !border-l-0 p-3 transition-[width] duration-300 lg:flex",
          collapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          {!collapsed && <Link href="/admin" className="text-lg font-extrabold text-[var(--primary)]">Taratara<span className="text-[var(--accent)]">.Admin</span></Link>}
          <button className="focus-ring glass-pill flex h-10 w-10 items-center justify-center" onClick={() => setCollapsed((value) => !value)} aria-label="Ciutkan sidebar">{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {navigation.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-bold transition",
                pathname === href ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "hover:bg-white/50 dark:hover:bg-white/10",
                collapsed && "justify-center"
              )}
            >
              <Icon size={18} />
              <span className={cn(collapsed && "sr-only")}>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-3 flex items-center gap-2 border-t border-white/40 pt-4">
          <div className="glass-pill flex h-10 w-10 shrink-0 items-center justify-center font-extrabold">{profile.nama.charAt(0).toUpperCase()}</div>
          {!collapsed && <p className="truncate text-xs font-bold">{profile.nama}</p>}
        </div>
      </aside>

      {/* Kolom kanan: topbar + konten, bergeser sesuai lebar sidebar */}
      <div className={cn("min-h-screen transition-[padding] duration-300", collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]")}>
        <header className="glass !sticky top-0 z-40 mx-0 flex min-h-16 items-center justify-between gap-3 !rounded-none !border-x-0 !border-t-0 px-4 py-3 lg:px-6">
          <button className="focus-ring glass-pill flex h-11 w-11 items-center justify-center lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Buka menu"><Menu size={20} /></button>
          <div className="hidden sm:block"><p className="text-xs font-semibold text-muted">Panel administrasi</p><p className="font-extrabold">Halo, {profile.nama}</p></div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <button className="focus-ring glass-pill flex h-11 items-center gap-2 px-3 text-sm font-bold" onClick={signOut}><LogOut size={17} /><span className="hidden sm:inline">Keluar</span></button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1200px] px-4 py-4 lg:px-6 lg:py-6">{children}</main>
      </div>

      {/* Drawer ponsel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} className="glass h-[100dvh] w-[min(86vw,320px)] !rounded-none !border-y-0 !border-l-0 p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-7 flex items-center justify-between">
              <span className="text-lg font-extrabold text-[var(--primary)]">Taratara.Admin</span>
              <button
                className="focus-ring glass-pill flex h-10 w-10 items-center justify-center"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1">
              {navigation.map(([label, href, Icon]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-bold",
                    pathname === href ? "bg-[var(--primary)] text-white" : "hover:bg-white/50"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </div>
      )}
    </div>
  );
}
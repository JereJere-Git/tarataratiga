"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, ShieldCheck } from "lucide-react";
import { GlassButton, GlassCard } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      glassToast("Email atau kata sandi tidak cocok.");
      return;
    }
    router.replace(searchParams.get("next")?.startsWith("/admin") ? searchParams.get("next")! : "/admin");
    router.refresh();
  }

  return (
    <GlassCard className="relative z-10 w-full max-w-md rounded-[32px] p-7 sm:p-9">
      <div className="mb-8 flex items-center gap-3">
        <div className="glass-pill flex h-12 w-12 items-center justify-center text-[var(--primary)]"><ShieldCheck /></div>
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">Ruang staf</p><h1 className="text-2xl font-extrabold">Masuk ke Admin</h1></div>
      </div>
      {searchParams.get("error") === "unauthorized" && <p className="mb-4 rounded-2xl border border-red-300/60 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-800">Akun Anda belum memiliki peran admin atau editor.</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-bold">Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring mt-2 h-12 w-full rounded-2xl border border-white/60 bg-white/70 px-4 font-medium outline-none dark:bg-slate-950/40" /></label>
        <label className="block text-sm font-bold">Kata sandi<input required minLength={6} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="focus-ring mt-2 h-12 w-full rounded-2xl border border-white/60 bg-white/70 px-4 font-medium outline-none dark:bg-slate-950/40" /></label>
        <GlassButton type="submit" disabled={loading} className="w-full">{loading ? "Memeriksa..." : <><LogIn size={18} />Masuk aman</>}</GlassButton>
      </form>
      <p className="mt-6 text-center text-xs text-muted">Akses hanya untuk staf terdaftar.</p>
    </GlassCard>
  );
}

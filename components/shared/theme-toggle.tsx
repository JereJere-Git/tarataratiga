"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  if (!mounted) return <span className="glass-pill block h-11 w-11" aria-hidden="true" />;
  const dark = resolvedTheme === "dark";
  return <button className="focus-ring glass-pill flex h-11 w-11 items-center justify-center" aria-label={dark ? "Gunakan mode terang" : "Gunakan mode gelap"} onClick={() => setTheme(dark ? "light" : "dark")}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}

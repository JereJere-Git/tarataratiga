"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & { variant?: "default" | "strong" };

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  return <div className={cn(variant === "strong" ? "glass-strong" : "glass", className)} {...props}>{children}</div>;
}

type GlassButtonProps = HTMLMotionProps<"button"> & { variant?: "primary" | "secondary" };
export function GlassButton({ children, className, variant = "primary", ...props }: GlassButtonProps) {
  return <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className={cn("focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold", variant === "primary" ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "glass-pill text-[var(--foreground)]", className)} {...props}>{children}</motion.button>;
}

export function GlassChip({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
  return <span className={cn("glass-pill inline-flex min-h-8 items-center px-3 text-xs font-bold", className)} {...props}>{children}</span>;
}

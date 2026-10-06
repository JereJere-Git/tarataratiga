"use client";

import { motion, type MotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";

export function Reveal({ children, className, delay = 0, ...props }: PropsWithChildren<MotionProps & { delay?: number; className?: string; id?: string }>) {
  return <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay, type: "spring", stiffness: 300, damping: 28 }} className={className} {...props}>{children}</motion.div>;
}

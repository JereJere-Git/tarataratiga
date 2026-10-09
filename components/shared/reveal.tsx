"use client";

import { motion, type MotionProps } from "framer-motion";
import { useLayoutEffect, useRef, type PropsWithChildren } from "react";

export function Reveal({ children, className, delay = 0, ...props }: PropsWithChildren<MotionProps & { delay?: number; className?: string; id?: string }>) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const startsVisible = bounds.top < window.innerHeight && bounds.bottom > 0;
    if (startsVisible || !("IntersectionObserver" in window)) return;

    element.style.setProperty("--reveal-delay", `${delay}s`);
    element.classList.add("reveal-pending");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.remove("reveal-pending");
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -48px 0px", threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return <motion.div ref={ref} initial={false} className={`${className ?? ""} reveal-on-scroll`} {...props}>{children}</motion.div>;
}

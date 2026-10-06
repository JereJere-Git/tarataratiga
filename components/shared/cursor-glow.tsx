"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: -200, y: -200 });
  const currentRef = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const update = () => {
      frameRef.current = null;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.35;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.35;
      glow.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
    };
    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetRef.current = { x: event.clientX - 60, y: event.clientY - 60 };
      glow.style.opacity = "1";
      schedule();
    };
    const onPointerLeave = () => { glow.style.opacity = "0"; };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div ref={glowRef} aria-hidden="true" className="cursor-glow pointer-events-none fixed left-0 top-0 z-[60] h-[120px] w-[120px] rounded-full opacity-0 mix-blend-multiply transition-opacity duration-150" style={{ background: "radial-gradient(circle, rgba(255,255,255,.72) 0%, rgba(220,252,231,.32) 42%, transparent 72%)" }} />;
}

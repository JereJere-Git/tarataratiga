"use client";

import { toast as sonnerToast } from "sonner";

export function glassToast(message: string) {
  sonnerToast(message, { className: "glass-toast" });
}

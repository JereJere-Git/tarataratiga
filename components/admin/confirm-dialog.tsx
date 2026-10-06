"use client";

import { GlassButton } from "@/components/shared/glass";
import { GlassDialog } from "@/components/shared/glass-dialog";

export function ConfirmDialog({ open, title = "Konfirmasi tindakan", description, confirmLabel = "Lanjutkan", loading, onClose, onConfirm }: { open: boolean; title?: string; description: string; confirmLabel?: string; loading?: boolean; onClose: () => void; onConfirm: () => void }) {
  return <GlassDialog open={open} onClose={onClose} title={title}><p className="text-sm leading-6 text-muted">{description}</p><div className="mt-6 flex justify-end gap-3"><GlassButton variant="secondary" onClick={onClose}>Batal</GlassButton><GlassButton onClick={onConfirm} disabled={loading}>{loading ? "Memproses..." : confirmLabel}</GlassButton></div></GlassDialog>;
}

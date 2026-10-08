export type JamHari = { buka?: string; tutup?: string };

export const HARI = [
  ["senin", "Senin"], ["selasa", "Selasa"], ["rabu", "Rabu"], ["kamis", "Kamis"],
  ["jumat", "Jumat"], ["sabtu", "Sabtu"], ["minggu", "Minggu"],
] as const;

const fmt = (value: string) => value.replace(":", ".");

/** Contoh hasil: "Senin–Kamis 08.00–16.30 · Jumat 08.00–14.00 · Minggu tutup" */
export function ringkasJam(jam: Record<string, JamHari> | null | undefined): string {
  if (!jam) return "Jam pelayanan belum tersedia";
  const groups: { from: string; to: string; value: string | null }[] = [];
  for (const [key, label] of HARI) {
    const d = jam[key];
    const value = d?.buka && d?.tutup ? `${fmt(d.buka)}–${fmt(d.tutup)}` : null;
    const last = groups[groups.length - 1];
    if (last && last.value === value) last.to = label;
    else groups.push({ from: label, to: label, value });
  }
  return groups
    .map((g) => `${g.from === g.to ? g.from : `${g.from}–${g.to}`} ${g.value ?? "tutup"}`)
    .join(" · ");
}
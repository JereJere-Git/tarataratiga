/** Mengubah nomor (08xx, 628xx, +62 8xx) menjadi tautan wa.me. */
export function waLink(number: string | null | undefined, message?: string): string | null {
  if (!number) return null;
  let digits = number.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
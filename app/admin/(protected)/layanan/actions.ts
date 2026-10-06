"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const schema = z.object({
  id: z.string().uuid().optional(), nama: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), ringkasan: z.string().trim().max(1000),
  syarat: z.array(z.string().trim().min(1).max(240)).max(50), alur: z.array(z.string().trim().min(1).max(240)).max(50),
  biaya: z.string().trim().max(160), estimasi_waktu: z.string().trim().max(160), urutan: z.coerce.number().int().min(0), aktif: z.boolean(),
});
function list(value: FormDataEntryValue | null) { try { const parsed = JSON.parse(String(value ?? "[]")); return Array.isArray(parsed) ? parsed : []; } catch { return []; } }
export async function saveLayanan(formData: FormData) {
  const parsed = schema.safeParse({ id: formData.get("id") || undefined, nama: formData.get("nama"), slug: formData.get("slug"), ringkasan: formData.get("ringkasan") ?? "", syarat: list(formData.get("syarat")), alur: list(formData.get("alur")), biaya: formData.get("biaya") ?? "", estimasi_waktu: formData.get("estimasi_waktu") ?? "", urutan: formData.get("urutan"), aktif: formData.get("aktif") === "true" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data layanan tidak valid." };
  await requireStaff();
  const payload = { nama: parsed.data.nama, slug: parsed.data.slug, ringkasan: parsed.data.ringkasan || null, syarat: parsed.data.syarat, alur: parsed.data.alur, biaya: parsed.data.biaya || null, estimasi_waktu: parsed.data.estimasi_waktu || null, urutan: parsed.data.urutan, aktif: parsed.data.aktif };
  const supabase = await createClient();
  const query = parsed.data.id ? supabase.from("layanan").update(payload).eq("id", parsed.data.id) : supabase.from("layanan").insert(payload);
  const { error } = await query;
  if (error) return { error: error.code === "23505" ? "Slug layanan sudah digunakan." : error.message };
  revalidatePath("/admin/layanan"); revalidatePath("/layanan"); revalidatePath("/layanan/[slug]", "page"); revalidatePath("/");
  return { success: parsed.data.id ? "Layanan diperbarui." : "Layanan berhasil dibuat." };
}
export async function deleteLayanan(id: string) {
  if (!z.string().uuid().safeParse(id).success) return { error: "ID layanan tidak valid." };
  await requireStaff();
  const { error } = await (await createClient()).from("layanan").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/layanan"); revalidatePath("/layanan"); revalidatePath("/layanan/[slug]", "page"); revalidatePath("/");
  return { success: "Layanan dihapus." };
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const schema = z.object({ id: z.string().uuid().optional(), judul: z.string().trim().min(3).max(160), deskripsi: z.string().trim().max(5000).optional(), lokasi: z.string().trim().max(200).optional(), mulai: z.string().datetime({ offset: true }), selesai: z.string().datetime({ offset: true }).optional().or(z.literal("")) });
export async function saveAgenda(formData: FormData) {
  const parsed = schema.safeParse({ id: formData.get("id") || undefined, judul: formData.get("judul"), deskripsi: formData.get("deskripsi") || undefined, lokasi: formData.get("lokasi") || undefined, mulai: new Date(String(formData.get("mulai"))).toISOString(), selesai: formData.get("selesai") ? new Date(String(formData.get("selesai"))).toISOString() : "" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data agenda tidak valid." };
  await requireStaff();
  const supabase = await createClient();
  const payload = { judul: parsed.data.judul, deskripsi: parsed.data.deskripsi || null, lokasi: parsed.data.lokasi || null, mulai: parsed.data.mulai, selesai: parsed.data.selesai || null };
  const query = parsed.data.id ? supabase.from("agenda").update(payload).eq("id", parsed.data.id) : supabase.from("agenda").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/agenda"); revalidatePath("/agenda"); revalidatePath("/");
  return { success: parsed.data.id ? "Agenda diperbarui." : "Agenda berhasil dibuat." };
}
export async function deleteAgenda(id: string) {
  if (!z.string().uuid().safeParse(id).success) return { error: "ID agenda tidak valid." };
  await requireStaff();
  const { error } = await (await createClient()).from("agenda").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/agenda"); revalidatePath("/agenda"); revalidatePath("/");
  return { success: "Agenda dihapus." };
}

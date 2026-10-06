"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const schema = z.object({
  id: z.string().uuid().optional(),
  nama: z.string().trim().min(2).max(160),
  kategori: z.string().trim().min(2).max(80),
  deskripsi: z.string().trim().min(10).max(1600),
  lokasi: z.string().trim().max(240),
  urutan: z.coerce.number().int().min(0),
  aktif: z.boolean(),
});

export async function savePotensi(formData: FormData) {
  const parsed = schema.safeParse({
    id: formData.get("id") || undefined,
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    deskripsi: formData.get("deskripsi"),
    lokasi: formData.get("lokasi") ?? "",
    urutan: formData.get("urutan"),
    aktif: formData.get("aktif") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data potensi tidak valid." };
  await requireStaff();
  const { id, ...data } = parsed.data;
  const payload = { ...data, lokasi: data.lokasi || null };
  const supabase = await createClient();
  const query = id ? supabase.from("potensi").update(payload).eq("id", id) : supabase.from("potensi").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/potensi"); revalidatePath("/admin/potensi"); revalidatePath("/");
  return { success: id ? "Potensi diperbarui." : "Potensi berhasil ditambahkan." };
}

export async function deletePotensi(id: string) {
  if (!z.string().uuid().safeParse(id).success) return { error: "ID potensi tidak valid." };
  await requireStaff();
  const { error } = await (await createClient()).from("potensi").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/potensi"); revalidatePath("/admin/potensi"); revalidatePath("/");
  return { success: "Potensi dihapus." };
}

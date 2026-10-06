"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const schema = z.object({
  id: z.string().uuid().optional(),
  nama: z.string().trim().min(2).max(160),
  kategori: z.string().trim().min(2).max(80),
  deskripsi: z.string().trim().max(1200),
  alamat: z.string().trim().min(3).max(240),
  telepon: z.string().trim().max(50),
  whatsapp: z.string().trim().max(50),
  jam_operasional: z.string().trim().max(160),
  urutan: z.coerce.number().int().min(0),
  aktif: z.boolean(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    id: formData.get("id") || undefined,
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    deskripsi: formData.get("deskripsi") ?? "",
    alamat: formData.get("alamat"),
    telepon: formData.get("telepon") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    jam_operasional: formData.get("jam_operasional") ?? "",
    urutan: formData.get("urutan"),
    aktif: formData.get("aktif") === "true",
  });
}

export async function saveUmkm(formData: FormData) {
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data UMKM tidak valid." };
  await requireStaff();
  const { id, ...data } = parsed.data;
  const payload = { ...data, deskripsi: data.deskripsi || null, telepon: data.telepon || null, whatsapp: data.whatsapp || null, jam_operasional: data.jam_operasional || null };
  const supabase = await createClient();
  const query = id ? supabase.from("umkm").update(payload).eq("id", id) : supabase.from("umkm").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/umkm"); revalidatePath("/admin/umkm"); revalidatePath("/");
  return { success: id ? "UMKM diperbarui." : "UMKM berhasil ditambahkan." };
}

export async function deleteUmkm(id: string) {
  if (!z.string().uuid().safeParse(id).success) return { error: "ID UMKM tidak valid." };
  await requireStaff();
  const { error } = await (await createClient()).from("umkm").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/umkm"); revalidatePath("/admin/umkm"); revalidatePath("/");
  return { success: "UMKM dihapus." };
}

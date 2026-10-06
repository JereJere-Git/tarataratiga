"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const categories = ["ibadah", "kesehatan", "pendidikan", "pemerintahan", "keamanan", "fasilitas_umum", "lainnya"] as const;
const schema = z.object({
  id: z.string().uuid().optional(),
  nama: z.string().trim().min(2).max(160),
  kategori: z.enum(categories),
  alamat: z.string().trim().min(2).max(300),
  deskripsi: z.string().trim().max(1000),
  telepon: z.string().trim().max(40),
  jam_operasional: z.string().trim().max(160),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  urutan: z.coerce.number().int().min(0),
  aktif: z.boolean(),
});

export async function saveLokasi(formData: FormData) {
  const parsed = schema.safeParse({
    id: formData.get("id") || undefined,
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    alamat: formData.get("alamat"),
    deskripsi: formData.get("deskripsi") ?? "",
    telepon: formData.get("telepon") ?? "",
    jam_operasional: formData.get("jam_operasional") ?? "",
    lat: formData.get("lat"),
    lng: formData.get("lng"),
    urutan: formData.get("urutan"),
    aktif: formData.get("aktif") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data lokasi tidak valid." };
  await requireStaff();
  const supabase = await createClient();
  const payload = {
    nama: parsed.data.nama,
    kategori: parsed.data.kategori,
    alamat: parsed.data.alamat,
    deskripsi: parsed.data.deskripsi || null,
    telepon: parsed.data.telepon || null,
    jam_operasional: parsed.data.jam_operasional || null,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
    urutan: parsed.data.urutan,
    aktif: parsed.data.aktif,
  };
  const query = parsed.data.id
    ? supabase.from("lokasi_penting").update(payload).eq("id", parsed.data.id)
    : supabase.from("lokasi_penting").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/lokasi");
  revalidatePath("/lokasi");
  return { success: parsed.data.id ? "Lokasi diperbarui." : "Lokasi berhasil ditambahkan." };
}

export async function deleteLokasi(id: string) {
  if (!z.string().uuid().safeParse(id).success) return { error: "ID lokasi tidak valid." };
  await requireStaff();
  const { error } = await (await createClient()).from("lokasi_penting").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/lokasi");
  revalidatePath("/lokasi");
  return { success: "Lokasi dihapus." };
}

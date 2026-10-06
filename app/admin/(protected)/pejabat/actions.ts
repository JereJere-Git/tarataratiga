"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const schema = z.object({ id: z.string().uuid().optional(), nama: z.string().trim().min(2).max(120), jabatan: z.string().trim().min(2).max(120), foto_url: z.string().url().optional().or(z.literal("")), urutan: z.coerce.number().int().min(0) });
export async function savePejabat(formData: FormData) {
  const parsed = schema.safeParse({ id: formData.get("id") || undefined, nama: formData.get("nama"), jabatan: formData.get("jabatan"), foto_url: formData.get("foto_url") || "", urutan: formData.get("urutan") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data pejabat tidak valid." };
  await requireStaff();
  const payload = { nama: parsed.data.nama, jabatan: parsed.data.jabatan, foto_url: parsed.data.foto_url || null, urutan: parsed.data.urutan };
  const supabase = await createClient();
  const query = parsed.data.id ? supabase.from("pejabat").update(payload).eq("id", parsed.data.id) : supabase.from("pejabat").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/pejabat"); revalidatePath("/profil"); revalidatePath("/");
  return { success: parsed.data.id ? "Pejabat diperbarui." : "Pejabat ditambahkan." };
}
export async function deletePejabat(id: string) {
  if (!z.string().uuid().safeParse(id).success) return { error: "ID pejabat tidak valid." };
  await requireStaff();
  const { error } = await (await createClient()).from("pejabat").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/pejabat"); revalidatePath("/profil"); revalidatePath("/");
  return { success: "Pejabat dihapus." };
}

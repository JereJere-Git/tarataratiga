"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";
const schema = z.object({ id: z.string().uuid().optional(), judul: z.string().trim().min(2), album: z.string().trim().max(80).optional(), gambar_url: z.string().url() });
export async function saveGaleri(formData: FormData) { const parsed = schema.safeParse({ id: formData.get("id") || undefined, judul: formData.get("judul"), album: formData.get("album") || undefined, gambar_url: formData.get("gambar_url") }); if (!parsed.success) return { error: "Lengkapi judul dan unggah gambar." }; await requireStaff(); const supabase = await createClient(); const payload = { judul: parsed.data.judul, album: parsed.data.album || null, gambar_url: parsed.data.gambar_url }; const query = parsed.data.id ? supabase.from("galeri").update(payload).eq("id", parsed.data.id) : supabase.from("galeri").insert(payload); const { error } = await query; if (error) return { error: error.message }; revalidatePath("/admin/galeri"); revalidatePath("/galeri"); return { success: "Galeri tersimpan." }; }
export async function deleteGaleri(id: string) { await requireStaff(); const { error } = await (await createClient()).from("galeri").delete().eq("id", id); if (error) return { error: error.message }; revalidatePath("/admin/galeri"); revalidatePath("/galeri"); return { success: "Foto dihapus." }; }

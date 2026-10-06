"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const daySchema = z.object({ libur: z.boolean(), buka: z.string().regex(/^\d{2}:\d{2}$/).or(z.literal("")), tutup: z.string().regex(/^\d{2}:\d{2}$/).or(z.literal("")) });
const schema = z.object({
  id: z.string().uuid().optional(), sambutan: z.string().trim().max(5000), sejarah: z.string().trim().max(10000),
  visi: z.string().trim().max(5000), misi: z.string().trim().max(10000), alamat: z.string().trim().max(500),
  telepon: z.string().trim().max(50), whatsapp: z.string().trim().max(50), email: z.string().trim().email().or(z.literal("")),
  jam_pelayanan: z.record(z.string(), daySchema), zona_waktu: z.string().trim().min(1).max(80),
  lat: z.coerce.number().min(-90).max(90).nullable(), lng: z.coerce.number().min(-180).max(180).nullable(),
  jumlah_rt: z.coerce.number().int().min(0), jumlah_rw: z.coerce.number().int().min(0), jumlah_penduduk: z.coerce.number().int().min(0),
});

export async function saveProfil(formData: FormData) {
  const rawSchedule = String(formData.get("jam_pelayanan") ?? "{}");
  let jam_pelayanan: unknown;
  try { jam_pelayanan = JSON.parse(rawSchedule); } catch { return { error: "Jam pelayanan tidak valid." }; }
  const parsed = schema.safeParse({
    id: formData.get("id") || undefined, sambutan: formData.get("sambutan") ?? "", sejarah: formData.get("sejarah") ?? "",
    visi: formData.get("visi") ?? "", misi: formData.get("misi") ?? "", alamat: formData.get("alamat") ?? "",
    telepon: formData.get("telepon") ?? "", whatsapp: formData.get("whatsapp") ?? "", email: formData.get("email") ?? "",
    jam_pelayanan, zona_waktu: formData.get("zona_waktu") ?? "Asia/Makassar",
    lat: formData.get("lat") || null, lng: formData.get("lng") || null,
    jumlah_rt: formData.get("jumlah_rt"), jumlah_rw: formData.get("jumlah_rw"), jumlah_penduduk: formData.get("jumlah_penduduk"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data profil tidak valid." };
  await requireStaff();
  const supabase = await createClient();
  const payload = { sambutan: parsed.data.sambutan, sejarah: parsed.data.sejarah, visi: parsed.data.visi, misi: parsed.data.misi, alamat: parsed.data.alamat, telepon: parsed.data.telepon, whatsapp: parsed.data.whatsapp, email: parsed.data.email || null, jam_pelayanan: parsed.data.jam_pelayanan, zona_waktu: parsed.data.zona_waktu, lat: parsed.data.lat, lng: parsed.data.lng, jumlah_rt: parsed.data.jumlah_rt, jumlah_rw: parsed.data.jumlah_rw, jumlah_penduduk: parsed.data.jumlah_penduduk };
  const query = parsed.data.id ? supabase.from("profil_kelurahan").update(payload).eq("id", parsed.data.id) : supabase.from("profil_kelurahan").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/admin/profil"); revalidatePath("/"); revalidatePath("/profil"); revalidatePath("/kontak");
  return { success: "Profil kelurahan tersimpan." };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/supabase/admin";

const KELOMPOK = ["jenis_kelamin", "usia", "pekerjaan", "pendidikan", "agama", "lainnya"] as const;

const schema = z.object({
  id: z.string().uuid().optional(),
  kelompok: z.enum(KELOMPOK, { message: "Kelompok tidak valid." }),
  label: z.string().trim().min(1, "Label wajib diisi.").max(80, "Label maksimal 80 karakter."),
  nilai: z.string().trim().regex(/^\d+$/, "Nilai harus bilangan bulat, minimal 0.").transform(Number),
  periode: z.string().trim().min(1, "Periode wajib diisi.").max(20, "Periode maksimal 20 karakter."),
  urutan: z.string().trim().regex(/^\d{0,3}$/, "Urutan harus angka 0-999.").transform((value) => (value === "" ? 0 : Number(value))),
  aktif: z.boolean(),
});

function go(params: Record<string, string | undefined>): never {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
  redirect(`/admin/statistik?${query.toString()}`);
}

function refresh() {
  revalidatePath("/statistik");
  revalidatePath("/admin/statistik");
  revalidatePath("/");
}

export async function saveStatistik(formData: FormData): Promise<void> {
  const { supabase } = await requireStaff();
  const raw = {
    id: String(formData.get("id") ?? "") || undefined,
    kelompok: String(formData.get("kelompok") ?? ""),
    label: String(formData.get("label") ?? ""),
    nilai: String(formData.get("nilai") ?? ""),
    periode: String(formData.get("periode") ?? ""),
    urutan: String(formData.get("urutan") ?? ""),
    aktif: formData.get("aktif") === "on",
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    go({ error: parsed.error.issues[0]?.message ?? "Data tidak valid.", kelompok: raw.kelompok, periode: raw.periode, edit: raw.id });
  }
  const { id, ...values } = parsed.data;

  const { error } = id
    ? await supabase.from("statistik").update({ ...values, updated_at: new Date().toISOString() }).eq("id", id)
    : await supabase.from("statistik").insert(values);

  if (error) {
    console.error("saveStatistik:", error.message);
    go({
      error: error.code === "23505" ? "Data dengan kelompok, label, dan periode yang sama sudah ada." : "Gagal menyimpan data.",
      kelompok: values.kelompok,
      periode: values.periode,
      edit: id,
    });
  }
  refresh();
  go({ ok: id ? "Perubahan disimpan." : "Data ditambahkan.", kelompok: values.kelompok, periode: values.periode });
}

export async function deleteStatistik(formData: FormData): Promise<void> {
  const { supabase } = await requireStaff();
  const filters = {
    kelompok: String(formData.get("kelompok") ?? "") || undefined,
    periode: String(formData.get("periode") ?? "") || undefined,
  };
  const id = z.string().uuid().safeParse(String(formData.get("id") ?? ""));
  if (!id.success) go({ error: "ID data tidak valid.", ...filters });
  const { error } = await supabase.from("statistik").delete().eq("id", id.data);
  if (error) {
    console.error("deleteStatistik:", error.message);
    go({ error: "Gagal menghapus data.", ...filters });
  }
  refresh();
  go({ ok: "Data dihapus.", ...filters });
}

export async function copyPeriode(formData: FormData): Promise<void> {
  const { supabase } = await requireStaff();
  const dari = String(formData.get("dari") ?? "").trim();
  const ke = String(formData.get("ke") ?? "").trim();
  if (!dari || !ke || ke.length > 20) go({ error: "Isi periode asal dan periode tujuan." });
  if (dari === ke) go({ error: "Periode tujuan harus berbeda dari periode asal.", periode: dari });

  const { data, error } = await supabase.from("statistik").select("kelompok, label, nilai, urutan, aktif").eq("periode", dari);
  const source = data ?? [];
  if (error || source.length === 0) go({ error: "Tidak ada data pada periode asal.", periode: dari });

  const { error: insertError } = await supabase
    .from("statistik")
    .upsert(source.map((row) => ({ ...row, periode: ke })), { onConflict: "kelompok,label,periode", ignoreDuplicates: true });
  if (insertError) {
    console.error("copyPeriode:", insertError.message);
    go({ error: "Gagal menyalin data.", periode: dari });
  }
  refresh();
  go({ ok: `Data periode ${dari} disalin ke ${ke}. Silakan ubah nilainya.`, periode: ke });
}
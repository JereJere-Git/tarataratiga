"use server";

import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin";

const beritaSchema = z.object({
  id: z.string().uuid().optional(),
  judul: z.string().trim().min(3, "Judul minimal 3 karakter.").max(160),
  slug: z.string().trim().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung."),
  ringkasan: z.string().trim().max(300).optional(),
  isi: z.string().min(1, "Isi berita wajib diisi."),
  gambar_url: z.string().url().optional().or(z.literal("")),
  kategori: z.string().trim().max(80).optional(),
  status: z.enum(["draf", "terbit"]),
  terbit_pada: z.string().datetime({ offset: true }).optional().or(z.literal("")),
});
type ActionResult = { success?: string; error?: string };

const allowedTags = ["p", "h2", "h3", "strong", "em", "ul", "ol", "li", "a", "img", "blockquote", "br"];
const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "title"],
};

function sanitizeContent(value: string) {
  return sanitizeHtml(value, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https"],
    allowProtocolRelative: false,
  });
}

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = beritaSchema.safeParse({
    ...raw,
    ringkasan: raw.ringkasan || undefined,
    gambar_url: raw.gambar_url || "",
    kategori: raw.kategori || undefined,
    terbit_pada: raw.terbit_pada ? new Date(String(raw.terbit_pada)).toISOString() : "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data berita tidak valid." };
  if (parsed.data.status === "terbit" && !parsed.data.terbit_pada) return { error: "Berita terbit harus memiliki jadwal terbit." };
  return { data: parsed.data };
}

export async function saveBerita(formData: FormData): Promise<ActionResult> {
  const { data: user } = await (await createClient()).auth.getUser();
  if (!user.user) return { error: "Sesi login berakhir. Silakan masuk kembali." };
  await requireStaff();
  const parsed = parseForm(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const payload = {
    judul: parsed.data.judul,
    slug: parsed.data.slug,
    ringkasan: parsed.data.ringkasan || null,
    isi: sanitizeContent(parsed.data.isi),
    gambar_url: parsed.data.gambar_url || null,
    kategori: parsed.data.kategori || null,
    status: parsed.data.status,
    terbit_pada: parsed.data.status === "terbit" ? parsed.data.terbit_pada || null : null,
    penulis_id: user.user.id,
  };
  const query = parsed.data.id
    ? supabase.from("berita").update(payload).eq("id", parsed.data.id)
    : supabase.from("berita").insert(payload);
  const { error } = await query;
  if (error) return { error: error.code === "23505" ? "Slug sudah digunakan." : error.message };
  revalidatePath("/admin/berita");
  revalidatePath("/");
  return { success: parsed.data.id ? "Berita diperbarui." : "Berita berhasil dibuat." };
}

export async function deleteBerita(id: string): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(id).success) return { error: "ID berita tidak valid." };
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("berita").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/berita");
  revalidatePath("/");
  return { success: "Berita dihapus." };
}

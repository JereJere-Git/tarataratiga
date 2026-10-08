"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { complaintSchema } from "@/lib/validations/pengaduan";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getClientIp(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headerList.get("x-real-ip") || "127.0.0.1";
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export type ComplaintActionResult =
  | { success: true; nomorTiket: string }
  | { success: false; error: string };

export async function submitComplaint(formData: FormData): Promise<ComplaintActionResult> {
  const raw = {
    nama: String(formData.get("nama") ?? ""),
    kontak: String(formData.get("kontak") ?? ""),
    anonim: formData.get("anonim") === "true",
    kategori: String(formData.get("kategori") ?? ""),
    isi: String(formData.get("isi") ?? ""),
    turnstileToken: String(formData.get("turnstileToken") ?? ""),
    website: String(formData.get("website") ?? ""),
  };
  if (raw.website) return { success: false, error: "Data tidak valid." };
  const parsed = complaintSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  if (!parsed.data.anonim && (!parsed.data.nama || !parsed.data.kontak)) {
    return { success: false, error: "Nama dan kontak wajib diisi jika tidak anonim." };
  }

  const file = formData.get("lampiran");
  if (file instanceof File && file.size > 0 && (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)) {
    return { success: false, error: "Lampiran harus JPG, PNG, atau WebP dengan ukuran maksimal 5 MB." };
  }

  const headerList = await headers();
  const ip = getClientIp(headerList);
  if (!(await verifyTurnstile(parsed.data.turnstileToken ?? "", ip))) {
    return { success: false, error: "Verifikasi keamanan gagal. Silakan coba lagi." };
  }

  const supabase = await createClient();
  const { data: allowed, error: rateError } = await supabase.rpc("consume_pengaduan_rate_limit", {
    client_ip: ip,
    max_requests: 5,
    window_seconds: 3600,
  });
  if (rateError || allowed !== true) return { success: false, error: "Batas kiriman tercapai. Silakan coba lagi nanti." };

  const ticket = `pengaduan/${crypto.randomUUID()}`;
  let attachmentPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    attachmentPath = `${ticket}.${extension}`;
    const { error } = await supabase.storage.from("lampiran").upload(attachmentPath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return { success: false, error: "Lampiran gagal diunggah. Silakan coba lagi." };
  }

  const { data, error } = await supabase.from("pengaduan").insert({
    nama: parsed.data.anonim ? null : parsed.data.nama || null,
    kontak: parsed.data.anonim ? null : parsed.data.kontak || null,
    anonim: parsed.data.anonim,
    kategori: parsed.data.kategori,
    isi: parsed.data.isi,
    lampiran_url: attachmentPath,
  }).select("nomor_tiket").single();

  if (error || !data) {
    if (attachmentPath) await supabase.storage.from("lampiran").remove([attachmentPath]);
    return { success: false, error: "Pengaduan gagal disimpan. Silakan coba lagi." };
  }
  return { success: true, nomorTiket: data.nomor_tiket };
}

export async function checkComplaintStatus(ticket: string) {
  const parsed = z.string().trim().min(1).max(40).safeParse(ticket);
if (!parsed.success) {
  return { success: false as const, error: "Masukkan nomor tiket terlebih dahulu." };
}
  const value = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("cek_status_pengaduan", { nomor_tiket: value });
  if (error) return { success: false as const, error: "Status pengaduan tidak dapat dimuat." };
  return { success: true as const, data: data?.[0] ?? null };
}

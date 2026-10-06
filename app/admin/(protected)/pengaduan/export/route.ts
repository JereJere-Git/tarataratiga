import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/supabase/admin";

export async function GET() {
  const { supabase } = await requireStaff();
  const { data, error } = await supabase.from("pengaduan").select("nomor_tiket,nama,kontak,kategori,isi,status,balasan,created_at").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Gagal mengekspor data." }, { status: 500 });
  const fields = ["nomor_tiket", "nama", "kontak", "kategori", "isi", "status", "balasan", "created_at"];
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [fields.join(","), ...(data ?? []).map((row) => fields.map((field) => escape(row[field as keyof typeof row])).join(","))].join("\r\n");
  return new NextResponse(`\uFEFF${csv}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="pengaduan.csv"' } });
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/supabase/admin";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["baru", "diproses", "selesai"]),
  balasan: z.string().trim().max(5000),
});

export async function updateComplaint(input: unknown) {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Data pengaduan tidak valid." };
  const { supabase } = await requireStaff();
  const { error } = await supabase.from("pengaduan").update({
    status: parsed.data.status,
    balasan: parsed.data.balasan || null,
    dibalas_pada: parsed.data.balasan ? new Date().toISOString() : null,
  }).eq("id", parsed.data.id);
  if (error) return { success: false as const, error: "Pengaduan gagal diperbarui." };
  revalidatePath("/admin/pengaduan");
  revalidatePath(`/admin/pengaduan/${parsed.data.id}`);
  return { success: true as const };
}

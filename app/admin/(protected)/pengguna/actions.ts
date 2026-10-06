"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/supabase/admin";

const createSchema = z.object({ nama: z.string().trim().min(2).max(120), email: z.string().trim().email(), password: z.string().min(8), peran: z.enum(["admin", "editor"]) });
const roleSchema = z.object({ user_id: z.string().uuid(), peran: z.enum(["admin", "editor"]) });
async function refreshUsers() { revalidatePath("/admin/pengguna"); }

export async function createStaff(formData: FormData) {
  const parsed = createSchema.safeParse({ nama: formData.get("nama"), email: formData.get("email"), password: formData.get("password"), peran: formData.get("peran") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data pengguna tidak valid." };
  const { user } = await requireAdmin();
  const service = createServiceClient();
  const created = await service.auth.admin.createUser({ email: parsed.data.email, password: parsed.data.password, email_confirm: true, user_metadata: { nama: parsed.data.nama } });
  if (created.error || !created.data.user) return { error: created.error?.message ?? "Akun Auth tidak dapat dibuat." };
  const { error } = await service.from("admin_profiles").insert({ user_id: created.data.user.id, nama: parsed.data.nama, peran: parsed.data.peran });
  if (error) {
    await service.auth.admin.deleteUser(created.data.user.id);
    return { error: error.message };
  }
  await refreshUsers();
  return { success: `Staf ${parsed.data.nama} berhasil ditambahkan.`, actor: user.id };
}

export async function updateStaffRole(formData: FormData) {
  const parsed = roleSchema.safeParse({ user_id: formData.get("user_id"), peran: formData.get("peran") });
  if (!parsed.success) return { error: "Peran pengguna tidak valid." };
  const { user } = await requireAdmin();
  if (user.id === parsed.data.user_id && parsed.data.peran !== "admin") return { error: "Akun admin yang sedang digunakan tidak dapat diturunkan dari sini." };
  const { error } = await (await createClient()).from("admin_profiles").update({ peran: parsed.data.peran }).eq("user_id", parsed.data.user_id);
  if (error) return { error: error.message };
  await refreshUsers();
  return { success: "Peran pengguna diperbarui." };
}

export async function deactivateStaff(userId: string) {
  if (!z.string().uuid().safeParse(userId).success) return { error: "ID pengguna tidak valid." };
  const { user } = await requireAdmin();
  if (user.id === userId) return { error: "Anda tidak dapat menonaktifkan akun sendiri." };
  const { error } = await (await createClient()).from("admin_profiles").delete().eq("user_id", userId);
  if (error) return { error: error.message };
  await refreshUsers();
  return { success: "Akses staf dinonaktifkan." };
}

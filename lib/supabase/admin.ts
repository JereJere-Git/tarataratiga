import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "editor";

export async function requireStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("nama, peran")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "editor"].includes(profile.peran)) {
    redirect("/admin/login?error=unauthorized");
  }

  return { supabase, user, profile: profile as { nama: string; peran: AdminRole } };
}

export async function requireAdmin() {
  const result = await requireStaff();
  if (result.profile.peran !== "admin") redirect("/admin?error=forbidden");
  return result;
}

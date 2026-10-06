import { PageHeader } from "@/components/admin/page-header";
import { StaffManager } from "@/components/admin/staff-manager";
import { requireAdmin } from "@/lib/supabase/admin";
import { createServiceClient } from "@/lib/supabase/service";
export default async function UsersPage() {
  const { supabase } = await requireAdmin();
  const [{ data: profiles }, { data: authData }] = await Promise.all([
    supabase.from("admin_profiles").select("user_id, nama, peran, created_at").order("created_at"),
    createServiceClient().auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const emails = new Map((authData?.users ?? []).map((user) => [user.id, user.email ?? ""]));
  const rows = (profiles ?? []).map((profile) => ({ ...profile, email: emails.get(profile.user_id) ?? "" }));
  return <><PageHeader eyebrow="Akses panel" title="Pengguna" description="Khusus admin: tambah staf, atur peran, atau nonaktifkan akses." /><StaffManager rows={rows} /></>;
}

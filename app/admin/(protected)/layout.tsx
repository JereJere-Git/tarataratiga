import { requireStaff } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { profile } = await requireStaff();
  return <AdminShell profile={profile}>{children}</AdminShell>;
}

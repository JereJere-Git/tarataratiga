import { PageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/profile-form";
import { requireStaff } from "@/lib/supabase/admin";
export default async function AdminProfilePage() {
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("profil_kelurahan").select("id, sambutan, sejarah, visi, misi, alamat, telepon, whatsapp, email, jam_pelayanan, zona_waktu, lat, lng, jumlah_rt, jumlah_rw, jumlah_penduduk").maybeSingle();
  return <><PageHeader eyebrow="Konten publik" title="Profil kelurahan" description="Kelola informasi yang tampil di beranda, profil, dan kontak." /><ProfileForm initial={data ? { ...data, jam_pelayanan: (data.jam_pelayanan ?? {}) as Record<string, Partial<{ libur: boolean; buka: string; tutup: string }>> } : undefined} /></>;
}

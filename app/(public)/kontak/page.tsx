import { Baby, Clock3, Mail, MapPin, MessageCircle, Phone, Shield, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container, SectionHeading } from "@/components/shared/layout";
import { GlassCard, GlassButton } from "@/components/shared/glass";
import { waLink } from "@/lib/whatsapp";
import { jamTampilanPublik } from "@/lib/jam";
import { KONTAK_PEJABAT } from "@/lib/contact";

const HARI = [
  ["senin", "Senin"], ["selasa", "Selasa"], ["rabu", "Rabu"], ["kamis", "Kamis"],
  ["jumat", "Jumat"], ["sabtu", "Sabtu"], ["minggu", "Minggu"],
] as const;

type Jam = Record<string, { buka?: string; tutup?: string }>;

export default async function KontakPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profil_kelurahan").select("alamat, email, jam_pelayanan, zona_waktu, lat, lng").maybeSingle();
  const mapUrl = data?.lat && data?.lng ? `https://www.google.com/maps?q=${data.lat},${data.lng}&output=embed` : "";
  const jam = jamTampilanPublik((data?.jam_pelayanan ?? {}) as Jam);
  const contactIcons = [Shield, UserRound, Baby] as const;

  return <main className="pb-24 pt-28"><Container>
    <SectionHeading eyebrow="Hubungi kami" title="Kontak kelurahan" description="Kami siap membantu informasi dan kebutuhan pelayanan warga." />

    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {KONTAK_PEJABAT.map((contact, index) => {
        const telHref = `tel:${contact.nomor.replace(/\D/g, "")}`;
        const waHref = waLink(contact.nomor, `Halo, saya ingin menghubungi ${contact.jabatan} Kelurahan Taratara Tiga.`);
        const Icon = contactIcons[index];
        return <GlassCard key={contact.jabatan} className="flex min-w-0 flex-col p-5 sm:p-6">
          <span className="glass-pill flex h-11 w-11 items-center justify-center text-[var(--primary)]"><Icon size={20} /></span>
          <p className="text-muted mt-4 text-xs font-bold uppercase tracking-wider">{contact.jabatan}</p>
          <p className="mt-1 text-lg font-extrabold">{contact.nama}</p>
          <p className="text-muted mt-3 flex items-center gap-2 text-sm"><Phone size={15} />{contact.nomor}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={telHref}><GlassButton variant="secondary"><Phone size={15} />Telepon</GlassButton></a>
            {waHref && <a href={waHref} target="_blank" rel="noopener noreferrer"><GlassButton><MessageCircle size={15} />WhatsApp</GlassButton></a>}
          </div>
        </GlassCard>;
      })}
      <GlassCard className="flex min-w-0 items-start gap-3 p-5 sm:p-6 md:col-span-2 xl:col-span-3">
        <span className="glass-pill flex h-11 w-11 shrink-0 items-center justify-center text-[var(--primary)]"><Mail size={20} /></span>
        <div className="min-w-0"><p className="text-muted text-xs font-bold uppercase tracking-wider">Email kelurahan</p><p className="mt-1 break-words font-extrabold">{data?.email ?? "Belum tersedia"}</p></div>
      </GlassCard>
    </div>

    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <GlassCard variant="strong" className="p-6">
        <h2 className="text-xl font-extrabold">Jam pelayanan</h2>
        <div className="mt-5 space-y-3">
          {HARI.map(([key, label]) => {
            const hari = jam[key];
            return (
              <div key={key} className="flex justify-between border-b border-white/30 pb-3 text-sm">
                <span className="font-semibold">{label}</span>
                <span className="text-muted">{hari?.buka && hari?.tutup ? `${hari.buka} - ${hari.tutup}` : "Tutup"}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard variant="strong" className="overflow-hidden p-2">
        {mapUrl
          ? <iframe title="Peta lokasi Kelurahan Taratara Tiga" src={mapUrl} className="h-[320px] w-full rounded-3xl border-0" loading="lazy" />
          : <div className="flex h-[320px] items-center justify-center text-muted"><MapPin /> Lokasi belum tersedia</div>}
      </GlassCard>
    </div>

    <p className="mt-5 flex items-center gap-2 text-sm text-muted"><MapPin size={16} />{data?.alamat ?? "Alamat belum tersedia"} <Clock3 size={16} className="ml-3" />Zona waktu {data?.zona_waktu ?? "Asia/Makassar"}</p>
  </Container></main>;
}

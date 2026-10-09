import { Mail, MapPin, MessageCircle, Phone, Clock3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container, SectionHeading } from "@/components/shared/layout";
import { GlassCard, GlassButton } from "@/components/shared/glass";
import { waLink } from "@/lib/whatsapp";
import { jamTampilanPublik } from "@/lib/jam";
import { NOMOR_KONTAK_SEMENTARA } from "@/lib/contact";

const HARI = [
  ["senin", "Senin"], ["selasa", "Selasa"], ["rabu", "Rabu"], ["kamis", "Kamis"],
  ["jumat", "Jumat"], ["sabtu", "Sabtu"], ["minggu", "Minggu"],
] as const;

type Jam = Record<string, { buka?: string; tutup?: string }>;

export default async function KontakPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profil_kelurahan").select("alamat, telepon, whatsapp, email, jam_pelayanan, zona_waktu, lat, lng").maybeSingle();
  const mapUrl = data?.lat && data?.lng ? `https://www.google.com/maps?q=${data.lat},${data.lng}&output=embed` : "";
  const jam = jamTampilanPublik((data?.jam_pelayanan ?? {}) as Jam);
  const telepon = data?.telepon || NOMOR_KONTAK_SEMENTARA;
  const whatsapp = data?.whatsapp || NOMOR_KONTAK_SEMENTARA;
  const telHref = `tel:${telepon.replace(/[^\d+]/g, "")}`;
  const waHref = waLink(whatsapp, "Halo Kelurahan Taratara Tiga, saya ingin bertanya: ") ?? undefined;

  return <main className="pb-24 pt-28"><Container>
    <SectionHeading eyebrow="Hubungi kami" title="Kontak kelurahan" description="Kami siap membantu informasi dan kebutuhan pelayanan warga." />

    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <ContactCard icon={<Phone size={20} />} label="Telepon" value={telepon} href={telHref} />
      <ContactCard icon={<MessageCircle size={20} />} label="WhatsApp" value={whatsapp} href={waHref} />
      <ContactCard icon={<Mail size={20} />} label="Email" value={data?.email ?? "-"} href={data?.email ? `mailto:${data.email}` : undefined} />
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

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return <GlassCard className="p-5"><span className="glass-pill flex h-11 w-11 items-center justify-center text-[var(--primary)]">{icon}</span><p className="text-muted mt-5 text-xs font-bold uppercase tracking-wider">{label}</p><p className="mt-2 font-extrabold">{value}</p>{href && <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><GlassButton variant="secondary" className="mt-4">Hubungi</GlassButton></a>}</GlassCard>;
}

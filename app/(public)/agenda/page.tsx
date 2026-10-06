import { Container, SectionHeading } from "@/components/shared/layout";
import { createClient } from "@/lib/supabase/server";
import { AgendaClient } from "./agenda-client";

export default async function AgendaPage() {
  const { data } = await (await createClient()).from("agenda").select("id, judul, deskripsi, lokasi, mulai, selesai").order("mulai", { ascending: true });
  return <main className="py-28"><Container><SectionHeading eyebrow="Kegiatan kelurahan" title="Agenda" description="Jadwal kegiatan dan pelayanan yang dapat diikuti warga." /><div className="mt-8"><AgendaClient items={data ?? []} /></div></Container></main>;
}

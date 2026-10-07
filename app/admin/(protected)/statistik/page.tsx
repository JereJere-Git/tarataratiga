import Link from "next/link";
import { requireStaff } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { copyPeriode, deleteStatistik, saveStatistik } from "./actions";

const KELOMPOK: Record<string, string> = {
  jenis_kelamin: "Jenis kelamin",
  usia: "Kelompok usia",
  pekerjaan: "Pekerjaan",
  pendidikan: "Pendidikan",
  agama: "Agama",
  lainnya: "Lainnya",
};

type Row = { id: string; kelompok: string; label: string; nilai: number; periode: string; urutan: number; aktif: boolean };

function href(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
  const text = query.toString();
  return text ? `/admin/statistik?${text}` : "/admin/statistik";
}

const button = "focus-ring inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-6 text-sm font-bold text-white";
const ghost = "focus-ring inline-flex min-h-11 items-center rounded-full border border-[var(--line)] px-5 text-sm font-bold";

export default async function AdminStatistikPage({
  searchParams,
}: {
  searchParams: Promise<{ kelompok?: string; periode?: string; edit?: string; ok?: string; error?: string }>;
}) {
  const { supabase } = await requireStaff();
  const sp = await searchParams;

  const { data } = await supabase
    .from("statistik")
    .select("id, kelompok, label, nilai, periode, urutan, aktif")
    .order("periode", { ascending: false })
    .order("kelompok")
    .order("urutan")
    .order("label");

  const all = (data ?? []) as Row[];
  const periods = [...new Set(all.map((row) => row.periode))];
  const rows = all.filter((row) => (!sp.kelompok || row.kelompok === sp.kelompok) && (!sp.periode || row.periode === sp.periode));
  const editing = sp.edit ? all.find((row) => row.id === sp.edit) : undefined;
  const defaultPeriode = editing?.periode ?? sp.periode ?? periods[0] ?? String(new Date().getFullYear());
  const defaultKelompok = editing?.kelompok ?? sp.kelompok ?? "jenis_kelamin";

  return (
    <>
      <PageHeader
        eyebrow="Data wilayah"
        title="Statistik penduduk"
        description="Kelola angka yang tampil di halaman Statistik dan beranda."
        action={
          <Link href="/statistik" className="focus-ring glass-pill inline-flex min-h-11 items-center px-4 text-sm font-bold text-[var(--primary)]">
            Lihat halaman publik
          </Link>
        }
      />

      {sp.ok && <p role="status" className="mb-4 rounded-2xl bg-[var(--primary-soft)] p-3 text-sm font-semibold text-[var(--primary)]">{sp.ok}</p>}
      {sp.error && <p role="alert" className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{sp.error}</p>}

      <section className="glass-strong rounded-[28px] p-5">
        <h2 className="mb-4 text-lg font-extrabold">{editing ? "Ubah data" : "Tambah data"}</h2>
        <form key={editing?.id ?? "baru"} action={saveStatistik} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <label className="block text-sm font-bold">
            Kelompok
            <select name="kelompok" defaultValue={defaultKelompok} className="form-input">
              {Object.entries(KELOMPOK).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold">
            Label
            <input name="label" required maxLength={80} defaultValue={editing?.label} placeholder="mis. Laki-laki" className="form-input" />
          </label>
          <label className="block text-sm font-bold">
            Jumlah
            <input name="nilai" required inputMode="numeric" pattern="\d+" defaultValue={editing?.nilai} placeholder="0" className="form-input" />
          </label>
          <label className="block text-sm font-bold">
            Periode
            <input name="periode" required maxLength={20} list="daftar-periode" defaultValue={defaultPeriode} placeholder="mis. 2026" className="form-input" />
            <datalist id="daftar-periode">
              {periods.map((item) => <option key={item} value={item} />)}
            </datalist>
          </label>
          <label className="block text-sm font-bold">
            Urutan tampil
            <input name="urutan" inputMode="numeric" pattern="\d{0,3}" defaultValue={editing?.urutan ?? 0} className="form-input" />
          </label>
          <label className="flex items-end gap-2 pb-3 text-sm font-bold">
            <input type="checkbox" name="aktif" defaultChecked={editing ? editing.aktif : true} className="h-5 w-5" />
            Tampilkan di website
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">
            <button type="submit" className={button}>{editing ? "Simpan perubahan" : "Tambah data"}</button>
            {editing && <Link href={href({ kelompok: sp.kelompok, periode: sp.periode })} className={ghost}>Batal</Link>}
          </div>
        </form>
      </section>

      <section className="mt-6">
        <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
          <label className="text-sm font-bold">
            Kelompok
            <select name="kelompok" defaultValue={sp.kelompok ?? ""} className="form-input">
              <option value="">Semua</option>
              {Object.entries(KELOMPOK).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold">
            Periode
            <select name="periode" defaultValue={sp.periode ?? ""} className="form-input">
              <option value="">Semua</option>
              {periods.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <button type="submit" className={ghost}>Terapkan</button>
          <Link href="/admin/statistik" className="pb-3 text-sm font-bold text-[var(--primary)]">Reset</Link>
        </form>

        <div className="glass-strong overflow-x-auto rounded-[28px]">
          {rows.length === 0 ? (
            <p className="p-8 text-center text-sm font-semibold text-muted">Belum ada data. Tambahkan lewat formulir di atas.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-muted">
                  <th className="p-3 font-semibold">Kelompok</th>
                  <th className="p-3 font-semibold">Label</th>
                  <th className="p-3 font-semibold">Jumlah</th>
                  <th className="p-3 font-semibold">Periode</th>
                  <th className="p-3 font-semibold">Urutan</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[var(--line)]">
                    <td className="p-3">{KELOMPOK[row.kelompok] ?? row.kelompok}</td>
                    <td className="p-3 font-bold">{row.label}</td>
                    <td className="p-3">{row.nilai.toLocaleString("id-ID")}</td>
                    <td className="p-3">{row.periode}</td>
                    <td className="p-3">{row.urutan}</td>
                    <td className="p-3">{row.aktif ? "Tampil" : "Disembunyikan"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Link href={href({ edit: row.id, kelompok: sp.kelompok, periode: sp.periode })} className="font-bold text-[var(--primary)]">Ubah</Link>
                        <form action={deleteStatistik}>
                          <input type="hidden" name="id" value={row.id} />
                          <input type="hidden" name="kelompok" value={sp.kelompok ?? ""} />
                          <input type="hidden" name="periode" value={sp.periode ?? ""} />
                          <ConfirmSubmit message={`Hapus "${row.label}" periode ${row.periode}?`} className="font-bold text-red-600">Hapus</ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {periods.length > 0 && (
        <section className="glass-strong mt-6 rounded-[28px] p-5">
          <h2 className="text-lg font-extrabold">Salin ke periode baru</h2>
          <p className="mt-1 text-sm text-muted">Menggandakan semua baris sebuah periode (nilainya bisa diubah setelahnya). Baris yang sudah ada tidak ditimpa.</p>
          <form action={copyPeriode} className="mt-4 flex flex-wrap items-end gap-3">
            <label className="text-sm font-bold">
              Dari periode
              <select name="dari" required className="form-input">
                {periods.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold">
              Ke periode
              <input name="ke" required maxLength={20} placeholder="mis. 2027" className="form-input" />
            </label>
            <button type="submit" className={button}>Salin</button>
          </form>
        </section>
      )}
    </>
  );
}
"use client";

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { upsertMonografi, deleteMonografi, upsertEkonomi, deleteEkonomi } from "@/app/admin/(protected)/statistik/actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

// ─── Types ────────────────────────────────────────────────────────────────────
export type MonografiRow = { id: string; kategori: string; label: string; nilai: number; urutan: number };
export type EkonomiRow   = { id: string; sektor: string; jumlah: number; urutan: number };

const KATEGORI_OPTIONS = [
  { value: "kependudukan", label: "Kependudukan" },
  { value: "pendidikan",   label: "Pendidikan" },
  { value: "pekerjaan",    label: "Pekerjaan" },
  { value: "usia",         label: "Usia / Kelompok Umur" },
  { value: "agama",        label: "Agama" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`form-input ${className}`} {...props} />;
}

function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`form-input ${className}`} {...props}>
      {children}
    </select>
  );
}

// ─── Inline Row Form ──────────────────────────────────────────────────────────
function MonografiRowForm({
  initial, onDone,
}: {
  initial?: MonografiRow;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    startTransition(async () => {
      const result = await upsertMonografi(fd);
      if (result.error) { toast.error(result.error); return; }
      toast.success(result.success);
      onDone();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="glass-strong rounded-2xl p-4 space-y-3">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-muted">Kategori</label>
          <Select name="kategori" defaultValue={initial?.kategori ?? "kependudukan"} required>
            {KATEGORI_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </div>
        <div>
          <label className="text-xs font-bold text-muted">Label</label>
          <Input name="label" placeholder="contoh: Laki-laki" defaultValue={initial?.label} required />
        </div>
        <div>
          <label className="text-xs font-bold text-muted">Nilai (jiwa)</label>
          <Input name="nilai" type="number" min={0} placeholder="0" defaultValue={initial?.nilai} required />
        </div>
        <div>
          <label className="text-xs font-bold text-muted">Urutan</label>
          <Input name="urutan" type="number" min={0} placeholder="0" defaultValue={initial?.urutan ?? 0} />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="focus-ring flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
          {pending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          {initial ? "Simpan perubahan" : "Tambah data"}
        </button>
        <button type="button" onClick={onDone}
          className="focus-ring flex items-center gap-2 rounded-full glass-pill px-4 py-2 text-sm font-bold">
          <X size={15} /> Batal
        </button>
      </div>
    </form>
  );
}

function EkonomiRowForm({ initial, onDone }: { initial?: EkonomiRow; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    startTransition(async () => {
      const result = await upsertEkonomi(fd);
      if (result.error) { toast.error(result.error); return; }
      toast.success(result.success);
      onDone();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="glass-strong rounded-2xl p-4 space-y-3">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-muted">Nama Sektor / Pekerjaan</label>
          <Input name="sektor" placeholder="contoh: Pertanian" defaultValue={initial?.sektor} required />
        </div>
        <div>
          <label className="text-xs font-bold text-muted">Jumlah (orang)</label>
          <Input name="jumlah" type="number" min={0} placeholder="0" defaultValue={initial?.jumlah} required />
        </div>
        <div>
          <label className="text-xs font-bold text-muted">Urutan</label>
          <Input name="urutan" type="number" min={0} placeholder="0" defaultValue={initial?.urutan ?? 0} />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="focus-ring flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
          {pending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          {initial ? "Simpan perubahan" : "Tambah sektor"}
        </button>
        <button type="button" onClick={onDone}
          className="focus-ring flex items-center gap-2 rounded-full glass-pill px-4 py-2 text-sm font-bold">
          <X size={15} /> Batal
        </button>
      </div>
    </form>
  );
}

// ─── Monografi Table ──────────────────────────────────────────────────────────
function MonografiTable({ rows }: { rows: MonografiRow[] }) {
  const [editing, setEditing] = useState<string | null>(null); // id or "new"
  const [deleting, setDeleting] = useState<MonografiRow | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete(row: MonografiRow) {
    startTransition(async () => {
      const result = await deleteMonografi(row.id);
      if (result.error) { toast.error(result.error); return; }
      toast.success(result.success);
      setDeleting(null);
    });
  }

  const grouped = KATEGORI_OPTIONS.map(({ value, label }) => ({
    value, label,
    rows: rows.filter((r) => r.kategori === value).sort((a, b) => a.urutan - b.urutan),
  }));

  return (
    <div className="space-y-6">
      {grouped.map(({ value, label, rows: groupRows }) => (
        <div key={value}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-[var(--accent)]">{label}</h3>
          </div>
          <div className="glass-strong overflow-hidden rounded-2xl">
            {groupRows.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/30">
                    <th className="px-4 py-3 text-left font-bold text-muted">Label</th>
                    <th className="px-4 py-3 text-right font-bold text-muted">Nilai</th>
                    <th className="px-4 py-3 text-right font-bold text-muted">Urutan</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {groupRows.map((row) => (
                    <>
                      <tr key={row.id} className="border-b border-white/20 last:border-0">
                        <td className="px-4 py-3 font-semibold">{row.label}</td>
                        <td className="px-4 py-3 text-right">{row.nilai.toLocaleString("id-ID")}</td>
                        <td className="px-4 py-3 text-right text-muted">{row.urutan}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setEditing(editing === row.id ? null : row.id)}
                              className="focus-ring glass-pill flex h-8 w-8 items-center justify-center text-[var(--primary)]" title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleting(row)}
                              className="focus-ring glass-pill flex h-8 w-8 items-center justify-center text-red-500" title="Hapus">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {editing === row.id && (
                        <tr key={`${row.id}-edit`}>
                          <td colSpan={4} className="px-4 pb-4">
                            <MonografiRowForm initial={row} onDone={() => setEditing(null)} />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
            {groupRows.length === 0 && (
              <p className="px-4 py-4 text-sm text-muted">Belum ada data untuk kategori ini.</p>
            )}
          </div>

          {editing === `new-${value}` ? (
            <div className="mt-3">
              {/* inject default kategori via hidden field via form */}
              <MonografiRowForm
                initial={{ id: "", kategori: value, label: "", nilai: 0, urutan: groupRows.length }}
                onDone={() => setEditing(null)}
              />
            </div>
          ) : (
            <button onClick={() => setEditing(`new-${value}`)}
              className="focus-ring mt-3 flex items-center gap-2 rounded-full glass-pill px-4 py-2 text-sm font-bold text-[var(--primary)]">
              <Plus size={15} /> Tambah {label}
            </button>
          )}
        </div>
      ))}

      {deleting && (
        <ConfirmDialog
          open={!!deleting}
          title="Hapus data?"
          description={`Data "${deleting.label}" (${deleting.nilai.toLocaleString("id-ID")} jiwa) akan dihapus permanen.`}
          onConfirm={() => handleDelete(deleting)}
          onClose={() => setDeleting(null)}
          loading={pending}
        />
      )}
    </div>
  );
}

// ─── Ekonomi Table ────────────────────────────────────────────────────────────
function EkonomiTable({ rows }: { rows: EkonomiRow[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<EkonomiRow | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete(row: EkonomiRow) {
    startTransition(async () => {
      const result = await deleteEkonomi(row.id);
      if (result.error) { toast.error(result.error); return; }
      toast.success(result.success);
      setDeleting(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="glass-strong overflow-hidden rounded-2xl">
        {rows.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/30">
                <th className="px-4 py-3 text-left font-bold text-muted">Sektor / Pekerjaan</th>
                <th className="px-4 py-3 text-right font-bold text-muted">Jumlah</th>
                <th className="px-4 py-3 text-right font-bold text-muted">Urutan</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.sort((a, b) => a.urutan - b.urutan).map((row) => (
                <>
                  <tr key={row.id} className="border-b border-white/20 last:border-0">
                    <td className="px-4 py-3 font-semibold">{row.sektor}</td>
                    <td className="px-4 py-3 text-right">{row.jumlah.toLocaleString("id-ID")} orang</td>
                    <td className="px-4 py-3 text-right text-muted">{row.urutan}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(editing === row.id ? null : row.id)}
                          className="focus-ring glass-pill flex h-8 w-8 items-center justify-center text-[var(--primary)]" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleting(row)}
                          className="focus-ring glass-pill flex h-8 w-8 items-center justify-center text-red-500" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editing === row.id && (
                    <tr key={`${row.id}-edit`}>
                      <td colSpan={4} className="px-4 pb-4">
                        <EkonomiRowForm initial={row} onDone={() => setEditing(null)} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
        {rows.length === 0 && <p className="px-4 py-4 text-sm text-muted">Belum ada data sektor ekonomi.</p>}
      </div>

      {editing === "new" ? (
        <EkonomiRowForm onDone={() => setEditing(null)} />
      ) : (
        <button onClick={() => setEditing("new")}
          className="focus-ring flex items-center gap-2 rounded-full glass-pill px-4 py-2 text-sm font-bold text-[var(--primary)]">
          <Plus size={15} /> Tambah sektor
        </button>
      )}

      {deleting && (
        <ConfirmDialog
          open={!!deleting}
          title="Hapus sektor?"
          description={`Sektor "${deleting.sektor}" (${deleting.jumlah.toLocaleString("id-ID")} orang) akan dihapus permanen.`}
          onConfirm={() => handleDelete(deleting)}
          onClose={() => setDeleting(null)}
          loading={pending}
        />
      )}
    </div>
  );
}

// ─── Main Admin Form ──────────────────────────────────────────────────────────
export function StatistikForm({ monografi, ekonomi }: { monografi: MonografiRow[]; ekonomi: EkonomiRow[] }) {
  const [tab, setTab] = useState<"monografi" | "ekonomi">("monografi");

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-2">
        {(["monografi", "ekonomi"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`focus-ring rounded-full px-5 py-2.5 text-sm font-bold transition ${tab === t ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "glass-pill"}`}>
            {t === "monografi" ? "📋 Monografi" : "📈 Ekonomi"}
          </button>
        ))}
      </div>

      {tab === "monografi" && <MonografiTable rows={monografi} />}
      {tab === "ekonomi"   && <EkonomiTable rows={ekonomi} />}
    </div>
  );
}

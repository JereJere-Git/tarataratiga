# Pola modul Berita

1. `page.tsx` server component memuat data dan memvalidasi error query.
2. `berita-table.tsx` client component menangani pencarian, filter, aksi, dan dialog.
3. `DataTable` menjadi primitive tabel dengan sorting dan pagination.
4. `berita-form.tsx` menangani state form dan toast UX.
5. `rich-text-editor.tsx` membungkus Tiptap sebagai editor reusable.
6. `ImageUploader` mengunggah media melalui bucket Storage terkontrol.
7. `actions.ts` menjadi boundary Server Actions untuk mutasi.
8. Semua payload divalidasi Zod sebelum query Supabase.
9. HTML Tiptap disanitasi server-side memakai allowlist `sanitize-html`.
10. Modul berikutnya mengikuti route protected, pola action, dan validasi yang sama.

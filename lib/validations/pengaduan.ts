import { z } from "zod";

export const complaintSchema = z.object({
  nama: z.string().trim().max(120).optional(),
  kontak: z.string().trim().max(120).optional(),
  anonim: z.boolean(),
  kategori: z.string().trim().min(2, "Pilih kategori.").max(80),
  isi: z.string().trim().min(10, "Isi pengaduan minimal 10 karakter.").max(5000),
  turnstileToken: z.string().optional(),
});

export type ComplaintInput = z.infer<typeof complaintSchema>;

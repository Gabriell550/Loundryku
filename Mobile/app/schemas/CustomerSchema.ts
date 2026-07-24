import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter' }),
  phone: z
    .string()
    .min(10, { message: 'Nomor telepon minimal 10 digit' })
    .regex(/^[0-9]+$/, { message: 'Nomor telepon hanya boleh berisi angka' }),
  address: z.string().min(5, { message: 'Alamat lengkap minimal 5 karakter' }),
  type: z.enum(['Reguler', 'Prioritas', 'Bisnis'], {
    required_error: 'Silakan pilih tipe pelanggan',
  }),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
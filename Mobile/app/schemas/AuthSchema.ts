import { z } from 'zod';

export const loginSchema = z.object({
  // Ubah dari 'email' menjadi 'username' dan hapus validasi .email()
  username: z.string().min(1, { message: "Username wajib diisi" }), 
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
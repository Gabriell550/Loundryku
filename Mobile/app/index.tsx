import { Redirect } from 'expo-router';

/**
 * app/index.tsx
 *
 * Ini adalah entry point saat aplikasi pertama kali dibuka ("/").
 * Untuk sekarang, langsung arahkan ke halaman Login supaya bisa dicek tampilannya.
 *
 * Nanti setelah ada logic auth (cek token JWT tersimpan atau belum),
 * ganti isi file ini jadi seperti contoh di bawah:
 *
 *   import { Redirect } from 'expo-router';
 *   import { useAuth } from '../hooks/useAuth';
 *
 *   export default function Index() {
 *     const { isLoggedIn } = useAuth();
 *     return <Redirect href={isLoggedIn ? '/(tabs)' : '/(auth)/login'} />;
 *   }
 */
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
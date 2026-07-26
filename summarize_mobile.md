# Ringkasan Struktur Kode Direktori `Mobile`

Direktori `Mobile` ini berisi kode sumber untuk aplikasi seluler, kemungkinan besar dibangun menggunakan **React Native** dan **Expo**, dengan navigasi yang ditangani oleh **Expo Router**. Struktur ini dirancang untuk aplikasi yang modular dan mudah dikelola.

## Arsitektur

Aplikasi ini mengikuti arsitektur berbasis komponen dan halaman/layar, memanfaatkan `expo-router` untuk sistem perutean berbasis file. Ini mempromosikan pemisahan kekhawatiran, di mana setiap fitur atau bagian aplikasi memiliki direktori atau komponennya sendiri. Penggunaan TypeScript menunjukkan pendekatan yang kuat untuk mencegah kesalahan dan meningkatkan pemeliharaan kode.

## Struktur Folder

Berikut adalah rincian struktur folder utama dalam direktori `Mobile`:

-   **`Mobile/app`**: Ini adalah jantung aplikasi, berisi semua rute (layar/halaman) dan logika terkait.
    -   **`Mobile/app/(auth)`**: Kelompok rute untuk fungsionalitas autentikasi, seperti `login.tsx`. `_layout.tsx` di sini kemungkinan mengelola tata letak khusus untuk layar autentikasi (misalnya, tanpa header).
    -   **`Mobile/app/(tabs)`**: Kelompok rute untuk navigasi berbasis tab utama aplikasi. `_layout.tsx` di sini akan mendefinisikan struktur tab (misalnya, tab `index`, `customers`, `orders`, `profile`).
    -   **`Mobile/app/customers`**: Berisi layar yang terkait dengan manajemen pelanggan, seperti `add.tsx` untuk menambahkan pelanggan baru dan `[id].tsx` untuk detail pelanggan individual.
    -   **`Mobile/app/orders`**: Berisi layar yang terkait dengan manajemen pesanan, seperti `add.tsx` untuk menambahkan pesanan baru, `[id].tsx` untuk detail pesanan, dan `search.tsx` untuk fungsionalitas pencarian pesanan.
    -   **`Mobile/app/payments`**: Berisi layar yang terkait dengan pembayaran, seperti `[orderId].tsx` untuk pembayaran pesanan tertentu.
    -   **`Mobile/app/schemas`**: Direktori ini mungkin menyimpan skema validasi (misalnya, menggunakan Yup atau Zod) untuk input formulir atau struktur data API. Contoh: `AuthSchema.ts`, `CustomerSchema.ts`.
    -   **`Mobile/app/services`**: Berisi modul untuk berinteraksi dengan API backend dan menerapkan logika bisnis. Ini membantu menjaga komponen UI tetap bersih dan fokus pada presentasi. Contoh: `api.ts` (untuk konfigurasi API umum), `customerService.ts`, `orderService.ts`, dll.
    -   **`Mobile/app/types`**: Berisi definisi tipe TypeScript global atau spesifik untuk aplikasi.
    -   **`Mobile/app/_layout.tsx`**: Tata letak root untuk seluruh aplikasi, yang mungkin memuat font, menyiapkan `StatusBar`, dan mendefinisikan rute stack umum.
    -   **`Mobile/app/index.tsx`**: Kemungkinan adalah layar beranda atau halaman pendaratan utama aplikasi.
    -   **`Mobile/app/register.tsx`**: Layar untuk pendaftaran pengguna baru.
    -   **`Mobile/app/userManagement.tsx`**: Layar untuk manajemen pengguna.
-   **`Mobile/components`**: Menyimpan komponen UI yang dapat digunakan kembali di seluruh aplikasi.
    -   **`Mobile/components/ui`**: Komponen UI yang lebih generik atau mendasar. Contoh: `GlassCard.tsx`, `GlassInput.tsx`, `PillButton.tsx`.
    -   **`Mobile/components/SwipeableTabScreen.tsx`**: Komponen kustom untuk mengelola layar tab yang dapat digeser.
-   **`Mobile/constants`**: Menyimpan nilai konstanta yang digunakan di seluruh aplikasi, seperti konfigurasi API (`api.ts`) dan definisi tema (`theme.ts`).
-   **`Mobile/contexts`**: Berisi implementasi React Context API untuk manajemen state global atau berbagi data di antara komponen tanpa meneruskan prop secara manual. Contoh: `ToastContext.tsx` untuk menampilkan pesan toast.
-   **`Mobile/assets`**: Menyimpan aset statis seperti gambar dan ikon.
-   **`Mobile/types`**: Direktori tambahan untuk definisi tipe.
-   **`Mobile/node_modules`**: Direktori standar untuk dependensi proyek yang diinstal oleh manajer paket (npm/yarn).

## Komponen Kunci dan Pustaka yang Digunakan

Berdasarkan `_layout.tsx` dan struktur folder, beberapa komponen dan pustaka penting meliputi:

-   **`expo-router`**: Untuk perutean berbasis file dan navigasi aplikasi.
-   **`@expo-google-fonts`**: Untuk memuat dan menggunakan font kustom (Montserrat, Inter).
-   **`expo-secure-store`**: Untuk menyimpan data sensitif dengan aman di perangkat.
-   **`react-native` & `expo`**: Kerangka kerja dasar untuk membangun aplikasi seluler.
-   **`ToastProvider`**: (Dari `Mobile/contexts/ToastContext.tsx`) untuk menyediakan fungsionalitas pesan toast di seluruh aplikasi.
-   **Komponen UI Kustom**: `GlassCard`, `GlassInput`, `PillButton`, `SwipeableTabScreen` menunjukkan penggunaan komponen UI yang konsisten dan kemungkinan tema desain kustom.
-   **Form Management**: Kehadiran `Mobile/app/schemas` mengindikasikan penggunaan pustaka seperti `react-hook-form` atau yang serupa untuk validasi dan manajemen formulir.
-   **API Services**: Modul di `Mobile/app/services` menunjukkan bahwa aplikasi berinteraksi dengan API backend untuk mengambil dan mengirim data.

## Alur Aplikasi Utama (Contoh)

-   **Autentikasi**: Pengguna masuk melalui layar `Mobile/app/(auth)/login.tsx`.
-   **Navigasi Utama**: Setelah autentikasi berhasil, pengguna diarahkan ke layar berbasis tab yang ditentukan dalam `Mobile/app/(tabs)/_layout.tsx`, dengan tab untuk beranda, pelanggan, pesanan, dan profil.
-   **Manajemen Pelanggan**: Pengguna dapat menambah pelanggan baru melalui `Mobile/app/customers/add.tsx` dan melihat detail pelanggan di `Mobile/app/customers/[id].tsx`.
-   **Manajemen Pesanan**: Pengguna dapat menambah pesanan baru melalui `Mobile/app/orders/add.tsx` dan melihat detail pesanan di `Mobile/app/orders/[id].tsx`, serta mencari pesanan di `Mobile/app/orders/search.tsx`.
-   **Pembayaran**: Pengguna dapat memproses pembayaran untuk pesanan tertentu di `Mobile/app/payments/[orderId].tsx`.

Secara keseluruhan, struktur ini sangat terorganisir, menggunakan konvensi modern untuk pengembangan aplikasi React Native/Expo, yang mengarah pada codebase yang dapat diskalakan dan mudah dipelihara.

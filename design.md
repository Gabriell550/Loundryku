---
name: LaundriFlow
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#414755'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005ac4'
  primary: '#0058bf'
  on-primary: '#ffffff'
  primary-container: '#006fef'
  on-primary-container: '#fefcff'
  inverse-primary: '#aec6ff'
  secondary: '#00696e'
  on-secondary: '#ffffff'
  secondary-container: '#00f4fe'
  on-secondary-container: '#006c71'
  tertiary: '#894d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac6300'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004396'
  secondary-fixed: '#63f7ff'
  secondary-fixed-dim: '#00dce5'
  on-secondary-fixed: '#002021'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built to evoke the sensation of fresh linen and rhythmic efficiency[cite: 3]. It targets a modern, urban demographic that values time and transparency in service[cite: 3]. The brand personality is "Effortless Purity"—combining the high-tech reliability of a logistics platform with the soft, tactile comfort of a premium home service[cite: 3].

The visual style is a **Modern Glassmorphic** approach[cite: 3]. It utilizes deep background blurs, semi-transparent white overlays, and vibrant accent colors to create a sense of depth and cleanliness[cite: 3]. The interface should feel "airy" and "liquid," avoiding harsh lines in favor of organic, sweeping curves and soft-edged containers[cite: 3].

## Colors

The palette is anchored by **Ocean Blue**, representing water and reliability[cite: 3]. This is supported by a functional tri-color accent system that maps directly to the service workflow[cite: 3]:

*   **Ocean Blue (#0077FF):** Primary brand color used for navigation, primary actions, and general branding[cite: 3].
*   **Fluid Aqua (#00F5FF):** Dedicated to the "Washing" phase—vibrant and energetic[cite: 3].
*   **Warm Orange (#FF9500):** Dedicated to the "Ironing/Pressing" phase—evoking heat and care[cite: 3].
*   **Bright Green (#34C759):** Dedicated to "Completion" and "Ready for Pickup"—symbolizing a fresh start[cite: 3].

## App Flow & UI Screens (Digital Laundry Kasir)

Aplikasi Digital Laundry digunakan oleh kasir untuk melakukan pencatatan order laundry, pembayaran, pencetakan struk, serta proses pengambilan laundry[cite: 1]. Aplikasi ini tidak digunakan untuk mengelola proses pencucian laundry[cite: 1].

### 1. Splash Screen & Login
*   **Navigation Flow:** Splash Screen -> Login -> Dashboard[cite: 1].
*   **Authentication:** Kasir login menggunakan email dan password[cite: 2].
*   **Design Implementation:** Input fields for email and password follow the Glassmorphic style, being semi-transparent with a 1px "frosted" border and a high radius (min 16px)[cite: 3]. The primary Login button utilizes the "Pill" convention with a vibrant gradient (Ocean Blue to Fluid Aqua)[cite: 3].

### 2. Bottom Navigation
*   **Items:** The bottom navigation consists of Dashboard, Order, Customer, and Profile[cite: 1].

### 3. Dashboard
*   **Information Display:** Dashboard menampilkan Total Order Hari Ini, Pendapatan Hari Ini, Total Pelanggan, dan Recent Transaction[cite: 1, 2].
*   **Quick Menu:** Includes shortcuts for Tambah Order, Pelanggan, Pembayaran, dan Laporan[cite: 1].
*   **Design Implementation:** The summary metrics are displayed inside Cards utilizing the Level 1 Glassmorphic treatment (70% opacity + blur) with standard 24px corner radii[cite: 3]. Floating Sections are used to emphasize the depth[cite: 3].

### 4. Pelanggan (Customer)
*   **Navigation Flow:** Dashboard -> Pelanggan -> Cari Pelanggan -> Tambah Pelanggan -> Simpan -> Daftar Pelanggan[cite: 1].
*   **Functionality:** Kasir dapat menambah pelanggan, mengubah data pelanggan, menghapus pelanggan, dan mencari pelanggan[cite: 2].
*   **Design Implementation:** The search functionality uses rounded input fields[cite: 3]. The list of customers is presented on cards placed on a soft gradient canvas background[cite: 3].

### 5. Order Laundry & Pengambilan
*   **Order Creation Flow:** Dashboard -> Tambah Order -> Pilih / Tambah Pelanggan -> Pilih Layanan Laundry -> Input Berat -> Total dihitung otomatis -> Simpan Order[cite: 1].
*   **Pickup Flow:** Dashboard -> Cari Nomor Nota -> Lihat Detail Order -> Validasi Pembayaran -> Serahkan Laundry -> Transaksi Selesai[cite: 1].
*   **Functionality:** Kasir membuat order dan menghitung total pembayaran otomatis berdasarkan layanan dan berat[cite: 2]. Kasir juga dapat mencari transaksi berdasarkan Nomor Nota, Nama Pelanggan, atau Nomor Telepon[cite: 2].
*   **Design Implementation:** Service types are selected using Chips & Badges with low-opacity background fills of their respective accent colors[cite: 3]. The "Liquid Progress Bar" can visually indicate the flow from Order creation to Pengambilan[cite: 3].

### 6. Pembayaran (Payment)
*   **Navigation Flow:** Detail Order -> Pilih Metode Pembayaran -> Konfirmasi Pembayaran -> Status Lunas -> Cetak Struk[cite: 1].
*   **Functionality:** Metode pembayaran yang tersedia adalah Tunai dan QRIS GoPay[cite: 1, 2]. Jika pembayaran berhasil, status berubah dari UNPAID (Belum Bayar) menjadi PAID (Lunas)[cite: 2].
*   **Hardware Integration:** Mencetak struk menggunakan Thermal Printer setelah transaksi[cite: 2].
*   **Design Implementation:** 
    *   **UNPAID Status:** The status card uses a thickened 4px left border colored with Warm Orange to indicate action is required[cite: 3].
    *   **PAID Status:** The status card uses a thickened 4px left border colored with Bright Green to symbolize a completed transaction and a fresh start[cite: 3].
    *   Confirmation buttons use the Color-Tinted Soft Shadows to pop out as Level 2 elements[cite: 3].

### 7. Laporan (Report) & Pengaturan
*   **Reports:** Laporan tersedia dalam format Harian, Mingguan, dan Bulanan[cite: 2].
*   **Logout Flow:** Profile -> Logout -> Login[cite: 1].
# UI/UX Design Prompts: Aplikasi Manajemen & Monitoring History Laundry

Dokumen ini berisi kumpulan prompt *AI UI Generator* (seperti v0.dev, Stitch, atau Midjourney) untuk merancang antarmuka aplikasi Manajemen Laundry berbasis mobile. Desain ini memfasilitasi dua jenis pengguna (Customer dan Admin) dengan alur yang spesifik.

---

## A. Sisi Masuk (Entry Point & Otentikasi)

### 1. Halaman Loading & Pilih Peran (Splash & Role Selection)
**Prompt:** 
> Mobile app UI. A clean split-screen or modal showing two distinct role selection buttons after a brief splash screen featuring a minimalist 3D washing machine icon. Top text: 'Pilih Masuk Sebagai'. Button 1: 'Customer' (with a user icon, friendly blue). Button 2: 'Admin / Kasir' (with a store/badge icon, professional dark grey). Vibe: Clear, modern, frictionless entry point.

### 2. Halaman Daftar & Masuk Pelanggan (Register & Login Customer)
**Prompt:** 
> Mobile app UI, Register and Login Screen for Customer. Register form requires: Nama, No. HP, Alamat, Username, Password. Include a toggle or tab at the top to switch seamlessly between 'Sign Up' and 'Login'. Clean white background with soft blue accents and modern glassmorphism input fields. Vibe: Trustworthy, simple, mobile-first.

### 3. Halaman Masuk Admin (Admin Login)
**Prompt:** 
> Mobile app UI, Admin Login Screen. Strict and secure aesthetic. Inputs for Username and Password only. Minimalist design, dark mode or deep blue theme to visually differentiate it from the Customer app. A subtle text at the bottom: 'Hubungi Super Admin jika Anda lupa akses'. Vibe: Professional, secure, internal-tool.

---

## B. Sisi Pelanggan (Customer App Flow)

### 4. Halaman Beranda & Pelacakan (Customer Dashboard & Tracking)
**Prompt:** 
> Mobile app UI, Customer Dashboard. Welcome greeting with user's name ('Halo, Budi!') and a soft blue header. Main content is a 'Live Order Tracking' card showing 5 vertical or horizontal stages: Diterima -> Dicuci -> Dikeringkan -> Disetrika -> Selesai. Highlight the current active stage (e.g., 'Sedang Dicuci') with a vibrant glowing icon. Include a prominent 'Buat Pesanan Baru' primary button. Bottom navigation icons: Home, Riwayat, Profil.

### 5. Halaman Buat Pesanan Baru (Customer Create Order)
**Prompt:** 
> Mobile app UI, Customer Create Order Screen. Form layout. Section 1: Choose Service Type (Reguler, Express, Super Express) using selectable interactive chips. Section 2: Informational alert box stating 'Berat akhir dan total biaya akan ditimbang oleh Admin di outlet'. Section 3: Payment method info indicating 'Pembayaran dilakukan di outlet menggunakan QRIS statis'. A sticky, large 'Kirim Pesanan' button at the bottom.

### 6. Halaman Riwayat & Struk Digital (Order History & Receipt)
**Prompt:** 
> Mobile app UI, Customer Order History. List of completed orders showing Date, Service Type, Total Weight, and Total Cost. Clean cards with a subtle drop shadow. Clicking a card opens a modal/bottom sheet showing the Digital Receipt with detailed cost breakdown and a 'Tampilkan QRIS' button for payment reference.

---

## C. Sisi Admin / Kasir (Admin App Flow)

### 7. Halaman Beranda Admin (Admin Dashboard)
**Prompt:** 
> Mobile app UI, Admin Dashboard. Top header: 'Ringkasan Hari Ini' showing metrics for 'Pesanan Aktif' and 'Pendapatan (Rp)'. Below is a list of 'Pesanan Berjalan' (Active Orders) filtered by status tabs (Diterima, Dicuci, Selesai). A large, persistent floating action button (FAB) with a '+' icon at the bottom right to quickly input new walk-in orders. Vibe: Clean analytics, functional, high contrast.

### 8. Halaman Input Pesanan Baru (Admin Walk-in Order)
**Prompt:** 
> Mobile app UI, Admin Create Order Form. Input fields for: Cari/Tambah Customer (Name, HP), Select Service Type (Reguler, Express, Super Express), and a dedicated input field for 'Berat Aktual (kg)' with +/- stepper buttons. The screen features an auto-calculating 'Total Biaya' section at the bottom. Sticky bottom button: 'Simpan & Buat Pesanan'. 

### 9. Halaman Manajemen Status & Laporan (Status Update & Reports)
**Prompt:** 
> Mobile app UI, Admin Order Detail & Update Status. Shows customer order details. A visual vertical stepper where Admin can tap an action button to update the status to the next phase (e.g., tap 'Tandai Dicuci' to move from Diterima). Bottom navigation bar includes a 'Laporan' tab to view simple bar charts of weekly revenue and a transaction list filtered by date.
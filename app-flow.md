# 📱 App Flow
## Digital Laundry Kasir Mobile

Version : 1.0

---

# Tujuan Aplikasi

Aplikasi Digital Laundry digunakan oleh kasir untuk melakukan pencatatan order laundry, pembayaran, pencetakan struk, serta proses pengambilan laundry.

Aplikasi ini **tidak digunakan untuk mengelola proses pencucian laundry**.

---

# User Role

- Kasir

---

# Navigation Flow

Splash Screen

↓

Login

↓

Dashboard

├── Pelanggan
│      ├── Daftar Pelanggan
│      └── Tambah Pelanggan
│
├── Order Laundry
│      ├── Daftar Order
│      ├── Tambah Order
│      ├── Detail Order
│      ├── Pembayaran
│      └── Cetak Struk
│
├── Laporan
│
├── Pengaturan
│
└── Profile

---

# Login Flow

Splash Screen

↓

Login

↓

Dashboard

---

# Dashboard Flow

Dashboard menampilkan:

- Total Order Hari Ini
- Pendapatan Hari Ini
- Total Pelanggan
- Recent Transaction

Quick Menu

- Tambah Order
- Pelanggan
- Pembayaran
- Laporan

---

# Pelanggan Flow

Dashboard

↓

Pelanggan

↓

Cari Pelanggan

↓

Tambah Pelanggan (jika belum ada)

↓

Simpan

↓

Daftar Pelanggan

---

# Order Flow

Dashboard

↓

Tambah Order

↓

Pilih / Tambah Pelanggan

↓

Pilih Layanan Laundry

↓

Input Berat

↓

Total dihitung otomatis

↓

Simpan Order

↓

Pilih Metode Pembayaran

↓

Cetak Struk

↓

Dashboard

---

# Pembayaran Flow

Detail Order

↓

Pilih Metode Pembayaran

- Tunai
- QRIS GoPay

↓

Konfirmasi Pembayaran

↓

Status Pembayaran

Lunas

↓

Cetak Struk

---

# Pengambilan Laundry

Dashboard

↓

Cari Nomor Nota

↓

Lihat Detail Order

↓

Validasi Pembayaran

↓

Serahkan Laundry

↓

Transaksi Selesai

---

# Logout

Profile

↓

Logout

↓

Login

---

# Bottom Navigation

Dashboard

Order

Customer

Profile
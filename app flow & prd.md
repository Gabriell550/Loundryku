# App Flow & ERD: Aplikasi Manajemen Laundry

Dokumen ini memuat detail alur penggunaan aplikasi (App Flow) untuk sisi Pelanggan dan Admin, serta pemodelan data atau Entity Relationship Diagram (ERD) untuk sistem database.

---

## 1. App Flow (Alur Pengguna)

### A. Alur Pelanggan (Customer)
1. **Splash Screen:** Aplikasi menampilkan logo saat pertama kali dibuka.
2. **Pilih Peran:** Pengguna memilih opsi "Customer".
3. **Autentikasi:** Pengguna baru memilih "Sign Up" untuk mendaftar, atau "Login" jika sudah memiliki akun.
4. **Dashboard Utama:** Sistem menampilkan ringkasan pesanan aktif (jika ada) dan menu utama.
5. **Buat Pesanan:** Pelanggan memilih jenis layanan (Reguler, Express, Super Express). Sistem memberikan estimasi biaya sementara.
6. **Pelacakan (Tracking):** Pelanggan memantau status pesanan secara *real-time* (Diterima, Dicuci, Dikeringkan, Disetrika, Selesai).
7. **Notifikasi:** Sistem mengirim *push notification* ketika pesanan berstatus "Selesai".
8. **Pembayaran:** Pelanggan datang ke outlet, membayar via QR Code statis, dan mengambil pakaian.
9. **Riwayat:** Pesanan yang selesai otomatis masuk ke menu "Riwayat Transaksi".

### B. Alur Admin / Kasir
1. **Splash Screen:** Aplikasi menampilkan logo.
2. **Pilih Peran:** Pengguna memilih opsi "Admin / Kasir".
3. **Autentikasi:** Admin login menggunakan kredensial yang telah diberikan oleh sistem (tidak ada fitur daftar mandiri).
4. **Dashboard Utama:** Sistem menampilkan metrik pendapatan harian dan antrean pesanan berjalan.
5. **Input Pesanan (Walk-in):** Admin memasukkan data pelanggan yang datang langsung, menimbang berat aktual, dan menginputnya ke sistem untuk kalkulasi harga pasti.
6. **Manajemen Status:** Admin memperbarui status pengerjaan pakaian tahap demi tahap secara manual.
7. **Penyelesaian & Struk:** Saat pelanggan mengambil pakaian, admin mencetak struk digital/fisik sebagai bukti pembayaran.
8. **Laporan:** Admin mengakses menu "Laporan" untuk melihat rekapitulasi pendapatan berdasarkan filter tanggal.

---

## 2. Entity Relationship Diagram (ERD)

Berikut adalah struktur entitas dan relasi database yang digunakan dalam sistem ini.

### A. Struktur Entitas (Tabel)

| Nama Entitas | Deskripsi | Atribut Utama |
| :--- | :--- | :--- |
| **Admin** | Menyimpan data akun pengelola laundry. | `id_admin` (PK), `nama_admin`, `username`, `password`, `role` |
| **Customer** | Menyimpan data pelanggan. | `id_customer` (PK), `nama_customer`, `nomor_hp`, `alamat`, `username`, `password` |
| **Pesanan_Laundry** | Menyimpan data utama transaksi pesanan. | `id_pesanan` (PK), `id_customer` (FK), `tanggal_pesan`, `jenis_layanan`, `berat`, `total_biaya`, `estimasi_selesai` |
| **Status_Laundry** | Menyimpan riwayat perubahan status pengerjaan. | `id_status` (PK), `id_pesanan` (FK), `status`, `waktu_update`, `id_admin` (FK) |
| **History_Transaksi** | Menyimpan data pesanan yang telah lunas dan selesai. | `id_history` (PK), `id_pesanan` (FK), `tanggal_transaksi`, `total_bayar`, `metode_pembayaran` |

*(Catatan: PK = Primary Key, FK = Foreign Key)*

### B. Relasi Antar Entitas

* **Customer ke Pesanan_Laundry (1:N):** 
  Satu pelanggan (Customer) dapat memiliki banyak pesanan (Pesanan_Laundry) dari waktu ke waktu, tetapi satu pesanan spesifik hanya dimiliki oleh satu pelanggan.
* **Pesanan_Laundry ke Status_Laundry (1:N):** 
  Satu pesanan (Pesanan_Laundry) akan memiliki banyak riwayat pembaruan status (Status_Laundry) seperti Diterima, Dicuci, hingga Selesai.
* **Admin ke Status_Laundry (1:N):** 
  Satu admin dapat memperbarui banyak status pesanan (Status_Laundry). Relasi ini berguna untuk melacak admin mana yang melakukan pembaruan pada waktu tertentu.
* **Pesanan_Laundry ke History_Transaksi (1:1):** 
  Satu pesanan (Pesanan_Laundry) yang telah selesai akan menghasilkan tepat satu catatan riwayat pembayaran/transaksi (History_Transaksi).
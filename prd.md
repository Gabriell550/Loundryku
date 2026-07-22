# 📄 Product Requirement Document

# Digital Laundry Kasir

Version : 1.0

---

# 1. Overview

Digital Laundry Kasir merupakan aplikasi mobile berbasis Expo React Native yang digunakan oleh kasir untuk melakukan pencatatan order laundry secara digital.

Aplikasi berfokus pada proses penerimaan order, pembayaran, pencetakan struk, dan pencarian data transaksi.

---

# 2. Objective

- Digitalisasi pencatatan order laundry.
- Mempermudah pencarian data pelanggan.
- Mempercepat proses pembayaran.
- Menghasilkan laporan transaksi otomatis.
- Mengurangi penggunaan nota tulis.

---

# 3. Target User

- Kasir Laundry

---

# 4. Features

## Authentication

- Login
- Logout

---

## Dashboard

Menampilkan:

- Total Order Hari Ini
- Pendapatan Hari Ini
- Total Pelanggan
- Recent Transaction

---

## Customer

Kasir dapat:

- Menambah pelanggan
- Mengubah data pelanggan
- Menghapus pelanggan
- Mencari pelanggan
- Melihat riwayat transaksi

---

## Order Laundry

Kasir dapat:

- Membuat order
- Mengubah order
- Menghapus order
- Melihat detail order
- Menghitung total pembayaran otomatis

---

## Payment

Metode pembayaran:

- Tunai
- QRIS GoPay

Status pembayaran:

- Belum Bayar
- Lunas

---

## Thermal Printer

Cetak struk thermal setelah transaksi.

---

## Report

Laporan:

- Harian
- Mingguan
- Bulanan

---

# 5. Functional Requirement

## Login

Kasir login menggunakan email dan password.

---

## Dashboard

Menampilkan ringkasan transaksi.

---

## Customer

CRUD Customer.

---

## Order

CRUD Order.

Perhitungan harga otomatis berdasarkan layanan dan berat.

---

## Payment

Kasir melakukan pembayaran.

Jika pembayaran berhasil maka status pembayaran menjadi **Lunas**.

---

## Search Transaction

Kasir dapat mencari transaksi berdasarkan:

- Nomor Nota
- Nama Pelanggan
- Nomor Telepon

---

# 6. Non Functional Requirement

- Android
- Expo React Native
- Spring Boot REST API
- MongoDB
- JWT Authentication
- Thermal Printer Support

---

# 7. Tech Stack

Frontend

- Expo
- React Native
- Expo Router
- TypeScript

Backend

- Spring Boot

Database

- MongoDB

Authentication

- JWT

---

# 8. Database Collections

- users
- customers
- orders
- payments
- service_types

---

# 9. Payment Status

| Status | Deskripsi |
|---------|-----------|
| UNPAID | Belum dibayar |
| PAID | Sudah dibayar |

---

# 10. API Endpoint

## Authentication

POST /api/auth/login

POST /api/auth/logout

---

## Customer

GET /api/customers

POST /api/customers

PUT /api/customers/{id}

DELETE /api/customers/{id}

---

## Order

GET /api/orders

POST /api/orders

GET /api/orders/{id}

PUT /api/orders/{id}

DELETE /api/orders/{id}

---

## Payment

POST /api/payments

GET /api/payments

---

## Dashboard

GET /api/dashboard

---

## Report

GET /api/reports/daily

GET /api/reports/monthly

---

# 11. Future Development

- WhatsApp Notification
- QRIS Auto Verification
- Barcode / QR Code pada Nota
- Multi Branch
- Multi Cashier
- Sinkronisasi Cloud
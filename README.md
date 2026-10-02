# VORTEX ID - Gaming Account Store Platform

> **"Beli Aman, Main Nyaman."**

**VORTEX ID** adalah platform e-commerce dan marketplace khusus jual-beli akun gaming (Mobile Legends, Free Fire, Valorant, Genshin Impact, PUBG Mobile, dll) dengan sistem keamanan data terpadu, verifikasi QRIS otomatis, invoice resmi, dan Theme Customizer dinamis.

---

## 🚀 Fitur Utama

### 1. Customer Storefront
- **Katalog Akun Interaktif**: Pencarian real-time, filter kategori game, tier rank, status akun, rentang harga, dan sorting diskon.
- **Detail Akun Lengkap**: Showcase screenshot akun, rincian skin premium/limited, winrate, level, dan jaminan garansi anti-hackback.
- **Proteksi Kredensial**: Data kredensial login (username/password) disembunyikan secara publik dan hanya diserahkan secara privat setelah status pesanan menjadi `COMPLETED`.
- **Checkout Dinamis**: Perhitungan subtotal, diskon produk, dan validasi kupon voucher dihitung langsung oleh sistem.
- **QRIS Toko Resmi**: Scan QRIS nasional (BCA, GoPay, OVO, DANA, ShopeePay) dengan panduan langkah transfer.
- **Upload Bukti Bayar**: Unggah resi transfer langsung dari perangkat dengan validasi format dan ukuran file.
- **Pelacakan Status & Stepper**: Pantau status transaksi (`UNPAID` → `WAITING_VERIFICATION` → `PROCESSING` → `COMPLETED`).
- **Nota / Invoice Resmi**: Invoice otomatis dengan Order ID terstandar (`VX-YYYYMMDD-XXXX`), rincian harga, cap lunas, dan fitur cetak / ekspor PDF.
- **Riwayat Pesanan**: Pelanggan dapat melihat kembali semua transaksi dan mengambil data kredensial akun kapan saja.

### 2. Admin Dashboard
- **Ringkasan KPI & Analytics**: Pantau total revenue, jumlah order, produk ready stock, dan rasio konversi.
- **Grafik Omset 7 Hari**: Visualisasi omset harian dan volume transaksi.
- **Performa Produk Individual**: Data views, checkout, sales, revenue, dan conversion rate untuk setiap akun game.
- **Manajemen Produk**: Tambah akun baru, edit spesifikasi, duplikasi produk, ubah status (Available / Sold / Hidden), dan soft-delete (Archive).
- **Manajemen Transaksi**: Filter order harian/mingguan/bulanan, verifikasi transfer bukti bayar, serahkan kredensial akun, atau batalkan order dengan alasan tertulis.
- **Manajemen Kupon & Voucher**: Buat voucher diskon persentase atau nominal tetap dengan kuota dan batas kadaluarsa.
- **Theme Customizer**: Ubah nama toko, tagline, logo, banner, palet warna primary/secondary/background, border radius, gaya tombol (solid/gradient/glow), dan mode dark/light secara live.
- **Pengaturan QRIS & Kontak**: Ganti gambar barcode QRIS toko, aktifkan/nonaktifkan QRIS, serta atur nomor WhatsApp dan akun medsos toko.
- **Audit Log**: Jejak rekam lengkap setiap aksi administratif admin demi transparansi dan audit keamanan.

---

## 🛠️ Panduan Menjalankan Project

### 1. Environment Variables
Salin berkas `.env.example` menjadi `.env`:
```bash
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
PORT=3000
```

### 2. Menjalankan Development Server
```bash
npm run dev
```
Aplikasi full-stack akan berjalan di `http://localhost:3000`.

### 3. Build & Production
```bash
npm run build
npm start
```

---

## 🔑 Akun Demo & Akses Admin

Aplikasi dilengkapi dengan tombol simulasi cepat 1-klik di navigasi bar atas:
- **Akun Admin Demo**:
  - Email: `admin@vortex.id`
  - Akses: Panel Admin penuh (`/admin`)
- **Akun Pembeli Demo**:
  - Email: `reza@gamer.id`
  - Akses: Riwayat transaksi pelanggan

---

## 📂 Struktur Folder
```
├── server.ts                       # Backend Express API & Vite Middleware
├── src/
│   ├── assets/images/              # Asset visual banner, logo, showcase, & QRIS
│   ├── components/
│   │   ├── common/                 # Reusable ImageUploader, ConfirmModal, Toast
│   │   ├── layout/                 # Navbar (Top Bar Contract) & Footer
│   │   └── storefront/             # HeroSection, ProductCard, ProductFilterBar
│   ├── context/
│   │   ├── StoreContext.tsx        # Global store state & reactive actions
│   │   └── ToastContext.tsx        # Toast notifications
│   ├── data/
│   │   └── seedData.ts             # Initial demo products, vouchers, & settings
│   ├── pages/
│   │   ├── admin/                  # Dashboard, Products, Orders, Vouchers, Theme, QRIS
│   │   ├── HomePage.tsx            # Beranda & featured catalog
│   │   ├── ProductsPage.tsx        # Katalog penuh dengan filter
│   │   ├── ProductDetailPage.tsx   # Halaman detail akun & spesifikasi
│   │   ├── CheckoutPage.tsx        # Formulir checkout & QRIS toko
│   │   ├── OrderDetailPage.tsx     # Status order & serah terima kredensial
│   │   ├── InvoicePage.tsx         # Nota resmi printable/PDF
│   │   ├── OrdersHistoryPage.tsx   # Riwayat belanja pelanggan
│   │   ├── HowToOrderPage.tsx      # Panduan cara order
│   │   ├── FaqPage.tsx             # Pusat bantuan & FAQ
│   │   └── AuthModal.tsx           # Modal login / register
│   ├── services/
│   │   └── storeManager.ts         # Persistent data layer & audit logging
│   └── types/
│       └── index.ts                # TypeScript interfaces
```

---

## 🎨 Panduan Kustomisasi Branding & Operasional

### Cara Mengganti Branding & Nama Toko
1. Masuk ke **Admin Panel** (`/admin`) → Pilih menu **Tema & Tampilan**.
2. Masukkan nama toko baru di kolom **Nama Toko** (contoh: `CYBER STORE ID`).
3. Ubah tagline dan pilih palet warna yang diinginkan.
4. Klik **Terapkan Semua Perubahan Tema**. Seluruh nama di header, footer, dan invoice akan langsung berubah otomatis.

### Cara Mengganti Logo & Banner
1. Buka **Tema & Tampilan** di Admin Panel.
2. Di bagian **Logo Toko**, klik kotak uploader untuk memilih file logo baru (JPG/PNG).
3. Di bagian **Banner Hero Storefront**, upload banner visual beranda Anda.
4. Klik **Simpan**.

### Cara Mengganti Barcode QRIS Toko
1. Masuk ke **Admin Panel** → Pilih menu **Pengaturan QRIS**.
2. Klik kolom upload QRIS untuk mengganti file gambar barcode dengan QRIS merchant resmi Anda.
3. Sesuaikan teks instruksi pembayaran jika diperlukan, lalu klik **Simpan Pengaturan QRIS**.

### Cara Menambahkan Produk Akun Gaming
1. Masuk ke **Admin Panel** → Pilih **Kelola Produk** → Klik **Tambah Akun Baru**.
2. Isi nama akun, game, tier rank, level, total skin, dan deskripsi.
3. Masukkan harga dan skema diskon (opsional).
4. Upload screenshot showcase akun.
5. Masukkan data kredensial login (Metode login, Username, Password, Email Recovery).
6. Klik **Publikasikan Akun ke Toko**. Akun langsung muncul di etalase pembeli!

### Cara Mengelola & Memverifikasi Transaksi
1. Masuk ke **Admin Panel** → Pilih menu **Transaksi & Pesanan**.
2. Temukan pesanan dengan status `WAITING_VERIFICATION` (ada badge kuning berkedip).
3. Klik tombol **Detail (ikon mata)** untuk memeriksa screenshot bukti transfer yang dikirim pembeli.
4. Klik tombol **Verifikasi Sah & Selesaikan Order**.
5. Status transaksi seketika berubah menjadi `COMPLETED`, produk ditandai `SOLD`, dan kredensial akun otomatis terbuka untuk pembeli di halaman pesanannya.

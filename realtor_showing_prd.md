# Product Requirement Document (PRD): Realtor Showing Scheduler

**Document Status**: Draft | **Author**: Kriya Web Studio | **Target Launch**: Client Pitch Mockup

---

## 1. Executive Summary & Core Concept

Proyek ini bertujuan untuk membangun sebuah website profil bisnis pribadi bagi Agen Properti (*realtor*) di Bali. Website ini akan menampilkan portofolio listing properti aktif mereka dan dilengkapi dengan **Sistem Penjadwalan Inspeksi Properti (*Property Showing*)** otomatis. 

Tujuan utama dari sistem ini adalah mengurangi waktu koordinasi manual agen lewat chat WhatsApp dan menyaring calon pembeli palsu (*pre-qualification*) sebelum janjian temu dilakukan.

---

## 2. Scope of Features (MVP - Option 2 Admin Panel)

Aplikasi akan menggunakan sistem perutean berbasis parameter query (`?view=...`) untuk membedakan tampilan publik (untuk klien) dan dashboard admin (untuk realtor), tanpa memerlukan database backend yang kompleks untuk versi awal.

### A. Tampilan Klien (Public View)
1. **Property Showcase Grid**: 
   * Galeri properti yang dipasarkan lengkap dengan detail status (*Available, Under Offer, Rent/Sale*).
2. **Showing Booking Scheduler (`?view=book-showing&id=prop-id`)**:
   * Kalender interaktif pemilihan hari dan jam untuk inspeksi langsung (*property viewing*).
   * **Smart Pre-Screening Intake Form**:
     * Nama, Email, & Nomor WhatsApp.
     * Pertanyaan Filter: *Budget Range, Purchasing Timeline* (Kapan rencana transaksi), dan *Funding Status* (Cash / KPR).
3. **WhatsApp Booking Request**:
   * Mengirim ringkasan reservasi jadwal showing ke WhatsApp realtor beserta link persetujuan otomatis.

### B. Tampilan Admin Realtor (Realtor View - `?view=admin`)
Untuk memenuhi keputusan **Opsi 2 (Built-in Admin Panel)**, realtor akan dibekali panel kelola data properti lokal:
1. **Property List & Showings Dashboard**:
   * Melihat jadwal showing properti mendatang yang telah disetujui.
2. **Property Manager (Listing Updates)**:
   * **Tambah Properti Baru**: Form input foto (URL/Base64), Judul Properti, Harga, Wilayah (Canggu/Ubud/dll.), Jumlah Kamar Tidur/Kamar Mandi, dan Deskripsi.
   * **Edit Properti**: Mengubah detail properti atau mengubah status (misalnya menandai properti menjadi *Sold Out* atau *Under Offer*).
   * **Hapus Properti**: Menghapus properti dari katalog.
3. **Database LocalStorage**:
   * Semua data listing properti awal (mock data) dan data properti baru yang ditambahkan oleh agen akan disimpan dan dibaca secara reaktif dari `localStorage`.

---

## 3. Alur Kerja Booking & Update Properti

### A. Alur Pemesanan Jadwal (Showings Lifecycle)
1. Klien memilih properti ➔ memilih waktu kosong ➔ mengisi form filter ➔ menekan "Confirm Showing".
2. Sistem merumuskan template pesan WA:
   ```text
   Halo [Realtor Name]! Saya ingin janjian showing untuk properti [Property Title].
   Jadwal: [Hari, Tanggal, Jam]
   Nama: [Buyer Name]
   Budget: [Buyer Budget]
   
   Klik link ini untuk approve janjian:
   https://[domain-aktif]/?view=approve-showing&id=[bookingId]
   ```
3. Realtor membaca pesan di WA ➔ mengeklik tautan approval ➔ sistem mengubah status janjian menjadi `confirmed` dan memblokir slot waktu tersebut di kalender publik.

### B. Alur Pengelolaan Properti (Admin Mode)
1. Realtor membuka `https://[domain-aktif]/?view=admin-properties`.
2. Realtor memasukkan pin pengaman sederhana (misal: `1234`) untuk membuka akses.
3. Realtor menambah/mengedit properti lewat form input ➔ menekan "Save".
4. Halaman depan katalog otomatis ter-update mengikuti data terbaru dari `localStorage`.

---

## 4. Technical Stack

* **Frontend**: React + Vite (JS) untuk pengembangan cepat, modern, dan sangat responsif.
* **Styling**: Vanilla CSS dengan desain estetika *Clean Minimalist Luxury* (dominasi warna monokromatik hitam-putih, aksen abu-abu hangat, dan border tipis elegan khas agensi properti kelas atas).
* **Storage**: `localStorage` utility untuk pencatatan listing properti dinamis dan jadwal booking.

---

## 5. Roadmap Implementasi

1. **Langkah 1**: Inisialisasi folder proyek `D:\Masbroo_Studio\Pitch LP\realtorshowing`.
2. **Langkah 2**: Desain sistem & layout katalog properti publik (minimalis-elegan).
3. **Langkah 3**: Integrasi modal booking calendar dan form pre-screening.
4. **Langkah 4**: Pembuatan panel admin built-in (`?view=admin`) untuk menguji penambahan/pengeditan properti real-time.
5. **Langkah 5**: Build, commit, dan deploy ke GitHub & Vercel.

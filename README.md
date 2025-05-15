# TenderHub Client

TenderHubClient adalah aplikasi frontend berbasis React & Vite untuk platform manajemen tender/proyek yang memungkinkan klien dan vendor untuk berinteraksi secara efisien. Aplikasi ini mendukung sistem autentikasi, peran pengguna (admin, klien, vendor), serta fitur profil dan manajemen proyek.

## ✨ Tech Stack

* React
* Vite
* React Router
* Tailwind CSS
* ESLint

## 📆 Instalasi

1. Clone repositori:

```bash
git clone https://github.com/rhenaald/tenderhubclient.git
cd tenderhubclient
```

2. Install dependencies:

```bash
npm install
```

3. Jalankan server development:

```bash
npm run dev
```

## 🔐 Role-based Access

Aplikasi ini menggunakan sistem autentikasi dan pembatasan akses berdasarkan jenis pengguna:

* **Public**: Tidak perlu login
* **Private (client, vendor, admin)**: Hanya bisa diakses sesuai peran

## 📍 Route & Akses

| Route                    | Komponen              | Akses                     |
| ------------------------ | --------------------- | ------------------------- |
| `/`                      | `HomePage`            | Public                    |
| `/projects`              | `Projek`              | Public                    |
| `/projects/:id`          | `DetailProjek`        | Public                    |
| `/register`              | `Registration`        | Public                    |
| `/login`                 | `Login`               | Public                    |
| `/vendor/profile/:id`    | `VendorProfile`       | Public                    |
| `/client/profile/:id`    | `ClientProfile`       | Public                    |
| `/forbidden`             | `Forbidden`           | Public                    |
| `/profile-vendor`        | `ProfileVendor`       | Private (Vendor only)     |
| `/profile-client`        | `ProfileClient`       | Private (Client only)     |
| `/ProjectDetail/:id`     | `ProjectDetail`       | Private (Client only)     |
| `/dashboard`             | `Dashboard`           | Private (Admin only)      |
| `/Activity-projects/:id` | `ActiveProjectDetail` | Private (Client & Vendor) |
| `*`                      | `NotFound`            | Public                    |

## 🔐 Mekanisme Private Route

Akses ke route privat dikontrol oleh komponen `PrivateRoute`, yang memverifikasi:

* Apakah pengguna sudah login
* Apakah peran pengguna sesuai dengan izin yang diberikan di route

Jika gagal, pengguna diarahkan ke halaman `/login` atau `/forbidden`.

## 📁 Struktur Proyek

```
tenderhubclient/
├── src/
│   ├── components/
│   ├── pages/
│   ├── Authentication/
│   ├── api/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

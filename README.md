# Infokes Assessment

Frontend untuk assessment di Infokes.

## Tech Stack

- **Runtime & Package Manager**: Bun
- **Bahasa Pemrograman**: TypeScript
- **Framework**: Vue 3 dengan Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Development Server & Bundler**: Vite

## Konfigurasi env

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

## Instalasi

```bash
# Instal dependensi
bun install
```

## Menjalankan Aplikasi

```bash
# Mode pengembangan dengan hot-reload
bun run dev
```

Server akan berjalan di http://localhost:${VITE_PORT} (default: 5173)

## Struktur Proyek

```
frontend/
├── index.html         # Entry point HTML
├── package.json       # Konfigurasi proyek dan dependensi
├── tsconfig.json      # Konfigurasi TypeScript
├── vite.config.ts     # Konfigurasi Vite
└── src/
    ├── assets/        # Static assets seperti gambar
    ├── components/    # Komponen UI yang dapat digunakan kembali
    │   ├── FolderExplorer.vue  # Komponen untuk panel kiri (struktur folder)
    │   ├── FolderContent.vue   # Komponen untuk panel kanan (konten folder & file)
    │   ├── FolderItem.vue      # Komponen item folder individual
    │   ├── SearchBar.vue       # Komponen untuk fitur pencarian
    │   └── HelloWorld.vue      # Komponen contoh
    ├── stores/        # Pinia stores untuk manajemen state
    │   └── folderStore.ts  # Store untuk data folder
    ├── types/         # Type definitions TypeScript
    ├── views/         # Komponen untuk halaman/tampilan
    │   └── ExplorerView.vue # Tampilan utama Windows Explorer
    ├── App.vue        # Komponen root aplikasi
    ├── main.ts        # Entry point aplikasi
    ├── style.css      # Global CSS styles
    └── vite-env.d.ts  # Type definitions untuk Vite
```

## Fitur

- **Panel Split Horizontal**: Layout dibagi menjadi dua panel seperti Windows Explorer.
- **Panel Kiri**: Menampilkan struktur folder dengan kemampuan expand/collapse.
- **Panel Kanan**: Menampilkan subfolder dan file dari folder yang dipilih.
- **Folder Navigation**: Navigasi struktur folder dengan mengeklik folder.
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar.
- **Search Function**: Pencarian folder dan file berdasarkan nama.

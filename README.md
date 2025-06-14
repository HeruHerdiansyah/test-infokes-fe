# Infokes Assessment

Frontend untuk assessment di Infokes.

## Tech Stack

- **Runtime & Package Manager**: Bun
- **Bahasa Pemrograman**: TypeScript
- **Framework**: Vue 3 dengan Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Testing**: Vitest dengan Testing Library
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

## Menjalankan Test

```bash
# Menjalankan semua test
bun test

# Menjalankan unit test saja
bun test:unit

# Menjalankan integration test saja
bun test:integration
```

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
    ├── services/      # Service layer untuk logika bisnis
    │   ├── api/       # API clients untuk komunikasi dengan backend
    │   ├── interfaces/ # Interfaces untuk services dan API clients
    │   └── folderService.ts # Service untuk folder management
    ├── stores/        # Pinia stores untuk manajemen state
    │   └── folderStore.ts  # Store untuk data folder
    ├── test/          # Test files
    │   ├── setup.ts   # Konfigurasi global untuk test
    │   ├── unit/      # Unit test
    │   │   ├── components/ # Test untuk komponen UI
    │   │   ├── services/   # Test untuk services
    │   │   └── stores/     # Test untuk Pinia stores
    │   └── integration/    # Integration test
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

import { defineStore } from 'pinia';
import axios from 'axios';
import type { Folder, FolderStructure, FileItem, SearchResult } from '../types/folder';

// URL API backend dari .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function sortByName<T extends { name: string }>(arr: T[]): T[] {
  return arr.slice().sort((a, b) => a.name.localeCompare(b.name));
}

// Definisikan store untuk folder
export const useFolderStore = defineStore('folder', {
  state: () => ({
    folderStructure: [] as FolderStructure[], // Struktur folder lengkap
    currentFolderContent: [] as (Folder | FileItem)[], // Subfolder dan file dari folder yang dipilih
    selectedFolderId: null as number | null, // ID folder yang dipilih
    loading: false, // Status loading
    error: null as string | null, // Pesan error jika ada
    searchResults: null as SearchResult | null, // Hasil pencarian
    isSearching: false, // Apakah sedang dalam mode pencarian
    searchQuery: '', // Query pencarian yang terakhir digunakan
  }),

  actions: {
    // Mendapatkan struktur folder lengkap
    async fetchFolderStructure() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/folders/structure`);
        if (response.data.success) {
          // Urutkan folderStructure secara rekursif berdasarkan nama
          const sortStructure = (folders: FolderStructure[]): FolderStructure[] => {
            return sortByName(folders).map(folder => ({
              ...folder,
              subfolders: sortStructure(folder.subfolders || []),
              files: folder.files ? sortByName(folder.files) : []
            }));
          };
          this.folderStructure = sortStructure(response.data.data);
        } else {
          this.error = 'Gagal mendapatkan struktur folder';
        }
      } catch (error) {
        console.error('Error fetching folder structure:', error);
        this.error = 'Terjadi kesalahan saat mengambil struktur folder';
      } finally {
        this.loading = false;
      }
    },

    // Mendapatkan subfolder dan file dari folder tertentu
    async fetchSubfolders(folderId: number | null) {
      this.loading = true;
      this.error = null;
      this.selectedFolderId = folderId;
      this.isSearching = false; // Reset status pencarian ketika berpindah folder
      this.searchResults = null; // Reset hasil pencarian
      
      try {
        let folders: Folder[] = [];
        let files: FileItem[] = [];
        if (folderId !== null) {
          // Ambil subfolder dan file sekaligus dari endpoint baru
          const res = await axios.get(`${API_URL}/folders/${folderId}/all`);
          if (res.data.success) {
            folders = sortByName(res.data.data.subfolders || []);
            files = sortByName(res.data.data.files || []);
          } else {
            this.error = 'Gagal mendapatkan data folder';
          }
        } else {
          // Root: ambil subfolder root saja
          const url = `${API_URL}/folders/0/subfolder`;
          const response = await axios.get(url);
          if (response.data.success) {
            folders = sortByName(response.data.data);
          } else {
            this.error = 'Gagal mendapatkan subfolder';
          }
        }
        // Gabungkan: folder dulu, lalu file
        this.currentFolderContent = [...folders, ...files];
      } catch (error) {
        console.error('Error fetching subfolders/files:', error);
        this.error = 'Terjadi kesalahan saat mengambil subfolder/file';
      } finally {
        this.loading = false;
      }
    },

    // Mengatur folder yang dipilih
    setSelectedFolder(folderId: number | null) {
      this.selectedFolderId = folderId;
      this.fetchSubfolders(folderId);
    },

    // Pencarian folder dan file
    async searchFolderAndFiles(query: string) {
      if (!query || query.trim() === '') {
        this.isSearching = false;
        this.searchResults = null;
        return;
      }

      this.searchQuery = query;
      this.loading = true;
      this.error = null;
      this.isSearching = true;
      
      try {
        const response = await axios.get(`${API_URL}/folders/search?q=${encodeURIComponent(query)}`);
        if (response.data.success) {
          const { folders, files } = response.data.data;
          this.searchResults = {
            folders: sortByName(folders || []),
            files: sortByName(files || [])
          };
          this.currentFolderContent = [...this.searchResults.folders, ...this.searchResults.files];
        } else {
          this.error = 'Gagal melakukan pencarian';
          this.searchResults = null;
        }
      } catch (error) {
        console.error('Error saat melakukan pencarian:', error);
        this.error = 'Terjadi kesalahan saat melakukan pencarian';
        this.searchResults = null;
      } finally {
        this.loading = false;
      }
    },

    // Reset pencarian
    resetSearch() {
      this.isSearching = false;
      this.searchResults = null;
      this.searchQuery = '';
      // Kembalikan tampilan ke folder yang sedang aktif
      if (this.selectedFolderId !== null) {
        this.fetchSubfolders(this.selectedFolderId);
      }
    }
  },
}); 
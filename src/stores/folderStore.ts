import { defineStore } from 'pinia';
import folderService from '../services/folderService';
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
        this.folderStructure = await folderService.getFolderStructure();
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
        const content = await folderService.getFolderContentById(folderId);
        // Gabungkan: folder dulu, lalu file
        this.currentFolderContent = [...content.folders, ...content.files];
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
        this.searchResults = await folderService.searchFolderAndFiles(query);
        if (this.searchResults) {
          this.currentFolderContent = [...this.searchResults.folders, ...this.searchResults.files];
        } else {
          this.searchResults = null;
          this.currentFolderContent = [];
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
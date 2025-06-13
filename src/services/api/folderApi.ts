import axios from 'axios';
import type { Folder, FileItem, SearchResult } from '../../types/folder';
import type { IFolderApi } from '../interfaces/IFolderApi';

// URL API backend dari .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class FolderApi implements IFolderApi {
  // Mendapatkan struktur folder lengkap
  async getFolderStructure() {
    try {
      const response = await axios.get(`${API_URL}/folders/structure`);
      return response.data;
    } catch (error) {
      console.error('Error fetching folder structure:', error);
      throw error;
    }
  }

  // Mendapatkan subfolder dan file untuk folder tertentu
  async getFolderContentById(folderId: number | null) {
    try {
      if (folderId !== null) {
        const response = await axios.get(`${API_URL}/folders/${folderId}/all`);
        return response.data;
      } else {
        // Root: ambil subfolder root saja
        const response = await axios.get(`${API_URL}/folders/0/subfolder`);
        return {
          success: response.data.success,
          data: {
            subfolders: response.data.data,
            files: []
          }
        };
      }
    } catch (error) {
      console.error('Error fetching folder content:', error);
      throw error;
    }
  }

  // Pencarian folder dan file
  async searchFolderAndFiles(query: string) {
    try {
      const response = await axios.get(`${API_URL}/folders/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching folders and files:', error);
      throw error;
    }
  }
}

export default new FolderApi(); 
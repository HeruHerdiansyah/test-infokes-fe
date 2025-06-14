import folderApi from './api/folderApi';
import type { Folder, FileItem, FolderStructure, SearchResult } from '../types/folder';
import type { IFolderService } from './interfaces/IFolderService';
import type { IFolderApi } from './interfaces/IFolderApi';

// Helper untuk mengurutkan array berdasarkan nama
function sortByName<T extends { name: string }>(arr: T[]): T[] {
  return arr.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export class FolderService implements IFolderService {
  private folderApi: IFolderApi;

  constructor(folderApi: IFolderApi) {
    this.folderApi = folderApi;
  }

  // Mendapatkan struktur folder lengkap
  async getFolderStructure(): Promise<FolderStructure[]> {
    const response = await this.folderApi.getFolderStructure();
    if (response.success) {
      // Urutkan folderStructure secara rekursif berdasarkan nama
      const sortStructure = (folders: FolderStructure[]): FolderStructure[] => {
        return sortByName(folders).map(folder => ({
          ...folder,
          subfolders: sortStructure(folder.subfolders || []),
          files: folder.files ? sortByName(folder.files) : []
        }));
      };
      return sortStructure(response.data);
    } else {
      throw new Error('Gagal mendapatkan struktur folder');
    }
  }

  // Mendapatkan konten folder (subfolder dan file)
  async getFolderContentById(folderId: number | null): Promise<{folders: Folder[], files: FileItem[]}> {
    const response = await this.folderApi.getFolderContentById(folderId);
    if (response.success) {
      // Pastikan data memiliki format yang benar dengan memastikan struktur objek yang diperlukan
      const folders = (response.data.subfolders || []).map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId
      })) as Folder[];
      
      const files = (response.data.files || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        folderId: file.folderId,
        size: file.size
      })) as FileItem[];
      
      return {
        folders: sortByName(folders),
        files: sortByName(files)
      };
    } else {
      throw new Error('Gagal mendapatkan konten folder');
    }
  }

  // Pencarian folder dan file
  async searchFolderAndFiles(query: string): Promise<SearchResult | null> {
    if (!query || query.trim() === '') {
      return null;
    }
    
    const response = await this.folderApi.searchFolderAndFiles(query);
    if (response.success) {
      // Pastikan data memiliki format yang benar
      const folders = (response.data.folders || []).map((folder: any) => ({
        id: folder.id, 
        name: folder.name,
        parentId: folder.parentId
      })) as Folder[];
      
      const files = (response.data.files || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        folderId: file.folderId,
        size: file.size
      })) as FileItem[];
      
      return {
        folders: sortByName(folders),
        files: sortByName(files)
      };
    } else {
      throw new Error('Gagal melakukan pencarian');
    }
  }
}

// Export instance dengan API yang sudah diinjeksi
export default new FolderService(folderApi); 
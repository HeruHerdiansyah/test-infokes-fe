import type { Folder, FileItem, FolderStructure, SearchResult } from '../../types/folder';

/**
 * Interface untuk API folder
 */
export interface IFolderApi {
  /**
   * Mendapatkan struktur folder lengkap
   */
  getFolderStructure(): Promise<{ success: boolean, data: FolderStructure[] }>;
  
  /**
   * Mendapatkan subfolder dan file untuk folder tertentu
   * @param folderId ID folder
   */
  getFolderContentById(folderId: number | null): Promise<{
    success: boolean,
    data: {
      subfolders: Folder[],
      files: FileItem[]
    }
  }>;
  
  /**
   * Pencarian folder dan file
   * @param query Kata kunci pencarian
   */
  searchFolderAndFiles(query: string): Promise<{
    success: boolean,
    data: {
      folders: Folder[],
      files: FileItem[]
    }
  }>;
} 
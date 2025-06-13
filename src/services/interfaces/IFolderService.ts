import type { Folder, FileItem, FolderStructure, SearchResult } from '../../types/folder';

/**
 * Interface untuk service folder di frontend
 */
export interface IFolderService {
  /**
   * Mendapatkan struktur folder lengkap
   */
  getFolderStructure(): Promise<FolderStructure[]>;
  
  /**
   * Mendapatkan konten folder (subfolder dan file)
   * @param folderId ID folder
   */
  getFolderContentById(folderId: number | null): Promise<{
    folders: Folder[],
    files: FileItem[]
  }>;
  
  /**
   * Pencarian folder dan file
   * @param query Kata kunci pencarian
   */
  searchFolderAndFiles(query: string): Promise<SearchResult | null>;
} 
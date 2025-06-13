// Tipe dasar untuk folder
export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
}

// Tipe untuk file
export interface FileItem {
  id: number;
  name: string;
  folderId: number;
  size?: number;
}

// Tipe untuk struktur folder hierarki
export interface FolderStructure extends Folder {
  subfolders: FolderStructure[];
  files?: FileItem[];
} 
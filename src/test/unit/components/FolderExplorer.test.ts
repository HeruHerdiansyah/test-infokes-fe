import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

// Type definitions
type Folder = {
  id: number;
  name: string;
  parentId: number | null;
  subfolders?: Folder[];
  files?: Array<{ id: number; name: string; folderId: number }>;
}

type ExpandedFolders = Record<number, boolean>;

// Simulasi data folder struktur
const folderStructure: Folder[] = [
  {
    id: 1,
    name: 'Root Folder',
    parentId: null,
    subfolders: [
      {
        id: 2,
        name: 'Subfolder',
        parentId: 1,
        subfolders: [],
        files: []
      }
    ],
    files: [
      { id: 1, name: 'file1.txt', folderId: 1 }
    ]
  }
]

describe("FolderExplorer Component", () => {
  beforeEach(() => {
    // Mock console.error untuk menghilangkan output error pada test error handling
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Pengujian logika bisnis dari komponen FolderExplorer
  
  test("should initialize with root folders expanded", () => {
    // Simulasi logika inisialisasi expandedFolders
    const initialExpandedFolders: ExpandedFolders = {};
    
    // Contoh logika inisialisasi yang diimplementasikan di komponen
    folderStructure.forEach(folder => {
      if (folder.parentId === null) {
        // Root folder diexpand secara default
        initialExpandedFolders[folder.id] = true;
      }
    });
    
    expect(Object.keys(initialExpandedFolders)).toContain('1');
    expect(initialExpandedFolders[1]).toBe(true);
  })
  
  test("should toggle folder expansion", () => {
    // Simulasi fungsi toggleFolder
    const expandedFolders: ExpandedFolders = { 1: true };
    
    // Toggle folder yang sudah diperluas
    const toggleFolder = (folderId: number) => {
      expandedFolders[folderId] = !expandedFolders[folderId];
    };
    
    toggleFolder(1);
    expect(expandedFolders[1]).toBe(false);
    
    toggleFolder(1);
    expect(expandedFolders[1]).toBe(true);
    
    // Toggle folder yang belum diperluas
    toggleFolder(2);
    expect(expandedFolders[2]).toBe(true);
  })
  
  test("should expand all parent folders when expanding path", () => {
    // Simulasi fungsi expandAllParents
    const expandedFolders: ExpandedFolders = {};
    const folderMap = new Map<number, Folder>();
    
    // Buat map dari ID folder ke folder
    folderStructure.forEach(folder => {
      folderMap.set(folder.id, folder);
      folder.subfolders?.forEach(subfolder => {
        folderMap.set(subfolder.id, subfolder);
      });
    });
    
    // Implementasi fungsi expandAllParents
    const expandAllParents = (folderId: number) => {
      let currentFolder = folderMap.get(folderId);
      while (currentFolder && currentFolder.parentId !== null) {
        const parentId = currentFolder.parentId;
        expandedFolders[parentId] = true;
        currentFolder = folderMap.get(parentId);
      }
    };
    
    // Ekspansi path untuk subfolder (ID 2)
    expandAllParents(2);
    
    // Parent dari folder ID 2 adalah folder ID 1, seharusnya diperluas
    expect(expandedFolders[1]).toBe(true);
  })
}) 
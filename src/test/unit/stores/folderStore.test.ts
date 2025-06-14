import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

// Model data yang mirip dengan API
interface Folder {
  id: number;
  name: string;
  parentId: number | null;
}

interface File {
  id: number;
  name: string;
  folderId: number;
}

// Simulasi store folder sederhana
class FolderStore {
  folders: Folder[] = [];
  files: File[] = [];
  currentFolderId: number | null = null;
  
  constructor() {
    // Initialize with sample data
    this.resetStore();
  }
  
  resetStore() {
    this.folders = [
      { id: 1, name: 'Root', parentId: null },
      { id: 2, name: 'Documents', parentId: 1 },
      { id: 3, name: 'Images', parentId: 1 }
    ];
    
    this.files = [
      { id: 1, name: 'readme.txt', folderId: 1 },
      { id: 2, name: 'document.docx', folderId: 2 },
      { id: 3, name: 'photo.jpg', folderId: 3 }
    ];
    
    this.currentFolderId = 1; // Start at root
  }
  
  // Mendapatkan folder saat ini
  getCurrentFolder(): Folder | undefined {
    return this.folders.find(f => f.id === this.currentFolderId);
  }
  
  // Mendapatkan subfolders dari folder saat ini
  getSubFolders(): Folder[] {
    return this.folders.filter(f => f.parentId === this.currentFolderId);
  }
  
  // Mendapatkan file dalam folder saat ini
  getFiles(): File[] {
    return this.files.filter(f => f.folderId === this.currentFolderId);
  }
  
  // Mendapatkan folder berdasarkan ID
  getFolderById(id: number): Folder | undefined {
    return this.folders.find(f => f.id === id);
  }
  
  // Berpindah ke folder tertentu
  navigateToFolder(folderId: number | null) {
    const folderExists = folderId === null || this.folders.some(f => f.id === folderId);
    if (folderExists) {
      this.currentFolderId = folderId;
      return true;
    }
    return false;
  }
  
  // Pencarian folder dan file
  search(query: string): { folders: Folder[], files: File[] } {
    if (!query) {
      return { folders: [], files: [] };
    }
    
    const lowerQuery = query.toLowerCase();
    const matchingFolders = this.folders.filter(f => 
      f.name.toLowerCase().includes(lowerQuery)
    );
    
    const matchingFiles = this.files.filter(f => 
      f.name.toLowerCase().includes(lowerQuery)
    );
    
    return { folders: matchingFolders, files: matchingFiles };
  }
}

describe('FolderStore', () => {
  let store: FolderStore;
  
  beforeEach(() => {
    // Mock console.error untuk menghilangkan output error pada test error handling
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    store = new FolderStore();
    store.resetStore();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  test('should initialize with root folder as current', () => {
    expect(store.currentFolderId).toBe(1);
    const currentFolder = store.getCurrentFolder();
    expect(currentFolder?.name).toBe('Root');
    expect(currentFolder?.parentId).toBeNull();
  });
  
  test('should get subfolders correctly', () => {
    const subfolders = store.getSubFolders();
    expect(subfolders).toHaveLength(2);
    expect(subfolders[0].name).toBe('Documents');
    expect(subfolders[1].name).toBe('Images');
  });
  
  test('should get files correctly', () => {
    const files = store.getFiles();
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('readme.txt');
    
    // Navigate to Documents folder
    store.navigateToFolder(2);
    const docFiles = store.getFiles();
    expect(docFiles).toHaveLength(1);
    expect(docFiles[0].name).toBe('document.docx');
  });
  
  test('should navigate to folder correctly', () => {
    // Start at root
    expect(store.getCurrentFolder()?.name).toBe('Root');
    
    // Navigate to Documents
    expect(store.navigateToFolder(2)).toBe(true);
    expect(store.currentFolderId).toBe(2);
    expect(store.getCurrentFolder()?.name).toBe('Documents');
    
    // Navigate to non-existent folder
    expect(store.navigateToFolder(999)).toBe(false);
    expect(store.currentFolderId).toBe(2); // Shouldn't change
  });
  
  test('should search folders and files correctly', () => {
    // Search for 'doc'
    const docResults = store.search('doc');
    expect(docResults.folders).toHaveLength(1);
    expect(docResults.folders[0].name).toBe('Documents');
    expect(docResults.files).toHaveLength(1);
    expect(docResults.files[0].name).toBe('document.docx');
    
    // Search for 'photo'
    const photoResults = store.search('photo');
    expect(photoResults.folders).toHaveLength(0);
    expect(photoResults.files).toHaveLength(1);
    expect(photoResults.files[0].name).toBe('photo.jpg');
    
    // Empty search
    const emptyResults = store.search('');
    expect(emptyResults.folders).toHaveLength(0);
    expect(emptyResults.files).toHaveLength(0);
  });
}); 
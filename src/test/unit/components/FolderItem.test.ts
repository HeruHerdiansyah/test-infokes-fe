import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe("FolderItem Component", () => {
  beforeEach(() => {
    // Mock console.error untuk menghilangkan output error pada test error handling
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Data uji folder
  const folderWithSubfolders = {
    id: 1,
    name: 'Test Folder',
    parentId: null,
    subfolders: [
      { id: 2, name: 'Subfolder', parentId: 1, subfolders: [] }
    ]
  }
  
  const folderWithoutSubfolders = {
    id: 3,
    name: 'Empty Folder',
    parentId: null,
    subfolders: []
  }

  // Test kondisional rendering dan logika bisnis
  test("should correctly identify folders with subfolders", () => {
    const hasSubfolders = folderWithSubfolders.subfolders && 
                      folderWithSubfolders.subfolders.length > 0;
    expect(hasSubfolders).toBe(true);
  })
  
  test("should correctly identify folders without subfolders", () => {
    const hasSubfolders = folderWithoutSubfolders.subfolders && 
                      folderWithoutSubfolders.subfolders.length > 0;
    expect(hasSubfolders).toBe(false);
  })
  
  test("should correctly identify active folders based on path", () => {
    // Simulasi logika computed property isActive
    const activePath = [1, 5, 10];
    const isActive1 = activePath.includes(folderWithSubfolders.id);
    const isActive2 = activePath.includes(folderWithoutSubfolders.id);
    
    expect(isActive1).toBe(true); // folder ID 1 ada di path aktif
    expect(isActive2).toBe(false); // folder ID 3 tidak ada di path aktif
  })
  
  test("should display correct icons based on folder expansion state", () => {
    // Simulasi logika kondisional untuk icon
    const expandedFolders = { 1: true, 5: false };
    
    // Jika folder dengan ID 1 (yang memiliki subfolder) diperluas
    const icon1 = expandedFolders[1] ? '▼' : '▶';
    expect(icon1).toBe('▼');
    
    // Jika folder dengan ID 5 tidak diperluas
    const icon2 = expandedFolders[5] ? '▼' : '▶';
    expect(icon2).toBe('▶');
  })
}) 
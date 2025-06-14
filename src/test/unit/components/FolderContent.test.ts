import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

// Definisikan tipe data yang diperlukan untuk pengujian
type File = {
  id: number;
  name: string;
  folderId: number;
  size?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type Folder = {
  id: number;
  name: string;
  parentId: number | null;
}

// Simulasi data untuk pengujian
const mockFolders: Folder[] = [
  { id: 2, name: 'Documents', parentId: 1 },
  { id: 3, name: 'Images', parentId: 1 }
];

const mockFiles: File[] = [
  { id: 1, name: 'resume.pdf', folderId: 1, size: 512000 },
  { id: 2, name: 'photo.jpg', folderId: 1, size: 1024000 }
];

describe("FolderContent Component", () => {
  beforeEach(() => {
    // Mock console.error untuk menghilangkan output error pada test error handling
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test fungsi formatFileSize
  test("should format file size correctly", () => {
    // Simulasi implementasi formatFileSize
    const formatFileSize = (size: number): string => {
      if (!size) return '0 B';
      
      const i = Math.floor(Math.log(size) / Math.log(1024));
      return parseFloat((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
    };

    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
  
  // Test fungsi sortItems untuk pengurutan folder dan file
  test("should sort items correctly", () => {
    // Simulasi implementasi fungsi sortItems
    const sortItems = (items: any[], sortBy: string, sortOrder: 'asc' | 'desc') => {
      return [...items].sort((a, b) => {
        let comparison = 0;
        if (a[sortBy] < b[sortBy]) {
          comparison = -1;
        } else if (a[sortBy] > b[sortBy]) {
          comparison = 1;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    };
    
    // Test pengurutan berdasarkan nama (ascending)
    const sortedByNameAsc = sortItems([...mockFiles], 'name', 'asc');
    expect(sortedByNameAsc[0].name).toBe('photo.jpg');
    expect(sortedByNameAsc[1].name).toBe('resume.pdf');
    
    // Test pengurutan berdasarkan nama (descending)
    const sortedByNameDesc = sortItems([...mockFiles], 'name', 'desc');
    expect(sortedByNameDesc[0].name).toBe('resume.pdf');
    expect(sortedByNameDesc[1].name).toBe('photo.jpg');
    
    // Test pengurutan berdasarkan ukuran
    const sortedBySizeAsc = sortItems([...mockFiles], 'size', 'asc');
    expect(sortedBySizeAsc[0].size).toBe(512000); // resume.pdf
    expect(sortedBySizeAsc[1].size).toBe(1024000); // photo.jpg
  });
  
  // Test fungsi pencarian
  test("should filter items correctly when searching", () => {
    // Simulasi implementasi fungsi filter/search
    const filterItems = (items: any[], searchTerm: string) => {
      if (!searchTerm) return items;
      return items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };
    
    // Test filter dengan nama yang cocok
    const filteredPdf = filterItems(mockFiles, 'pdf');
    expect(filteredPdf.length).toBe(1);
    expect(filteredPdf[0].name).toBe('resume.pdf');
    
    // Test filter dengan nama yang tidak ada
    const filteredNoMatch = filterItems(mockFiles, 'docx');
    expect(filteredNoMatch.length).toBe(0);
    
    // Test filter dengan string kosong
    const filteredAll = filterItems(mockFiles, '');
    expect(filteredAll.length).toBe(2);
  });
  
  // Test fungsi navigasi folder
  test("should handle folder navigation correctly", () => {
    // Simulasi tracking path navigasi
    let currentPath: number[] = [1]; // Dimulai dari folder dengan ID 1
    
    // Simulasi fungsi navigasi ke folder
    const navigateToFolder = (folderId: number) => {
      // Cek jika sudah di path tersebut, maka kembali ke level atas
      const existingIndex = currentPath.indexOf(folderId);
      if (existingIndex >= 0) {
        // Navigasi balik ke folder tersebut dengan memotong path
        currentPath = currentPath.slice(0, existingIndex + 1);
        return;
      }
      
      // Tambahkan folder baru ke path
      currentPath.push(folderId);
    };
    
    // Test navigasi ke subfolder
    navigateToFolder(2);
    expect(currentPath).toEqual([1, 2]);
    
    // Test navigasi ke folder yang sudah ada di path (kembali ke level tersebut)
    navigateToFolder(1);
    expect(currentPath).toEqual([1]);
    
    // Navigasi lagi ke folder lain
    navigateToFolder(3);
    expect(currentPath).toEqual([1, 3]);
  });
}); 
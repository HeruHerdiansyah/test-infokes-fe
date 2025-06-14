import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { FolderService } from '../../../services/folderService';
import type { IFolderApi } from '../../../services/interfaces/IFolderApi';
import type { Folder, FileItem, FolderStructure } from '../../../types/folder';

// Mock untuk IFolderApi
const mockFolderApi = {
  getFolderStructure: vi.fn(),
  getFolderContentById: vi.fn(),
  searchFolderAndFiles: vi.fn()
} as unknown as IFolderApi;

// Data mock untuk testing
const mockFolders: Folder[] = [
  { id: 2, name: 'Documents', parentId: 1 },
  { id: 3, name: 'Images', parentId: 1 },
  { id: 1, name: 'Root', parentId: null }
];

const mockFiles: FileItem[] = [
  { id: 1, name: 'readme.txt', folderId: 1 },
  { id: 2, name: 'document.docx', folderId: 2 },
  { id: 3, name: 'photo.jpg', folderId: 3 }
];

const mockFolderStructure: FolderStructure[] = [
  {
    id: 1,
    name: 'Root',
    parentId: null,
    subfolders: [
      {
        id: 2,
        name: 'Documents',
        parentId: 1,
        subfolders: [],
        files: [{ id: 2, name: 'document.docx', folderId: 2 }]
      },
      {
        id: 3,
        name: 'Images',
        parentId: 1,
        subfolders: [],
        files: [{ id: 3, name: 'photo.jpg', folderId: 3 }]
      }
    ],
    files: [{ id: 1, name: 'readme.txt', folderId: 1 }]
  }
];

describe('FolderService', () => {
  let folderService: FolderService;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error untuk menghilangkan output error pada test error handling
    vi.spyOn(console, 'error').mockImplementation(() => {});
    folderService = new FolderService(mockFolderApi);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should get folder structure correctly', async () => {
    // Setup mock
    (mockFolderApi.getFolderStructure as any).mockResolvedValue({
      success: true,
      data: mockFolderStructure
    });

    // Execute
    const result = await folderService.getFolderStructure();

    // Verify
    expect(mockFolderApi.getFolderStructure).toHaveBeenCalled();
    expect(result).toEqual(mockFolderStructure);
  });

  test('should throw error when folder structure fetch fails', async () => {
    // Setup mock
    (mockFolderApi.getFolderStructure as any).mockResolvedValue({
      success: false,
      data: []
    });

    // Execute & verify
    await expect(folderService.getFolderStructure()).rejects.toThrow('Gagal mendapatkan struktur folder');
  });

  test('should get folder content by ID correctly', async () => {
    // Setup mock
    (mockFolderApi.getFolderContentById as any).mockResolvedValue({
      success: true,
      data: {
        subfolders: [
          { id: 2, name: 'Documents', parentId: 1 },
          { id: 3, name: 'Images', parentId: 1 }
        ],
        files: [
          { id: 1, name: 'readme.txt', folderId: 1 }
        ]
      }
    });

    // Execute
    const result = await folderService.getFolderContentById(1);

    // Verify
    expect(mockFolderApi.getFolderContentById).toHaveBeenCalledWith(1);
    expect(result.folders).toHaveLength(2);
    expect(result.files).toHaveLength(1);
    // Verify sorting
    expect(result.folders[0].name).toBe('Documents');
    expect(result.folders[1].name).toBe('Images');
  });

  test('should throw error when folder content fetch fails', async () => {
    // Setup mock
    (mockFolderApi.getFolderContentById as any).mockResolvedValue({
      success: false,
      data: { subfolders: [], files: [] }
    });

    // Execute & verify
    await expect(folderService.getFolderContentById(1)).rejects.toThrow('Gagal mendapatkan konten folder');
  });

  test('should search folders and files correctly', async () => {
    // Setup mock
    (mockFolderApi.searchFolderAndFiles as any).mockResolvedValue({
      success: true,
      data: {
        folders: [{ id: 2, name: 'Documents', parentId: 1 }],
        files: [{ id: 2, name: 'document.docx', folderId: 2 }]
      }
    });

    // Execute
    const result = await folderService.searchFolderAndFiles('doc');

    // Verify
    expect(mockFolderApi.searchFolderAndFiles).toHaveBeenCalledWith('doc');
    expect(result?.folders).toHaveLength(1);
    expect(result?.files).toHaveLength(1);
    expect(result?.folders[0].name).toBe('Documents');
    expect(result?.files[0].name).toBe('document.docx');
  });

  test('should return null for empty search query', async () => {
    // Execute
    const result = await folderService.searchFolderAndFiles('');

    // Verify
    expect(mockFolderApi.searchFolderAndFiles).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('should throw error when search fails', async () => {
    // Setup mock
    (mockFolderApi.searchFolderAndFiles as any).mockResolvedValue({
      success: false,
      data: { folders: [], files: [] }
    });

    // Execute & verify
    await expect(folderService.searchFolderAndFiles('query')).rejects.toThrow('Gagal melakukan pencarian');
  });
}); 
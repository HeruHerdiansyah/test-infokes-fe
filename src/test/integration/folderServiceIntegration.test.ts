import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import folderService from '../../services/folderService';
import type { FolderStructure, Folder, FileItem } from '../../types/folder';

// Setup manual mock untuk axios saat berjalan dengan Bun
const originalAxios = { ...axios };
const mockAxiosGet = vi.fn();
axios.get = mockAxiosGet;

// Data sample untuk test
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
        files: []
      }
    ],
    files: []
  }
];

const mockFolderContent = {
  subfolders: [
    { id: 2, name: 'Documents', parentId: 1 },
    { id: 3, name: 'Images', parentId: 1 }
  ],
  files: [
    { id: 1, name: 'readme.txt', folderId: 1 }
  ]
};

const mockSearchResults = {
  folders: [{ id: 2, name: 'Documents', parentId: 1 }],
  files: [{ id: 2, name: 'document.docx', folderId: 2 }]
};

describe('FolderService Integration Tests', () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
    // Mock console.error untuk menghilangkan output error pada test error handling
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should fetch and transform folder structure correctly', async () => {
    // Setup mock
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockFolderStructure
      }
    });

    // Execute
    const result = await folderService.getFolderStructure();

    // Verify
    expect(mockAxiosGet).toHaveBeenCalledWith(expect.stringContaining('/folders/structure'));
    expect(result).toEqual(mockFolderStructure);
    expect(result[0].name).toBe('Root');
    expect(result[0].subfolders).toHaveLength(1);
  });

  test('should handle error in getFolderStructure', async () => {
    // Setup mock
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        success: false,
        data: []
      }
    });

    // Execute & verify
    await expect(folderService.getFolderStructure()).rejects.toThrow('Gagal mendapatkan struktur folder');
  });

  test('should fetch and transform folder content correctly', async () => {
    // Setup mock
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockFolderContent
      }
    });

    // Execute
    const result = await folderService.getFolderContentById(1);

    // Verify
    expect(mockAxiosGet).toHaveBeenCalledWith(expect.stringContaining('/folders/1/all'));
    expect(result.folders).toHaveLength(2);
    expect(result.files).toHaveLength(1);
    // Verify folders are sorted by name
    expect(result.folders[0].name).toBe('Documents');
    expect(result.folders[1].name).toBe('Images');
  });

  test('should handle error in getFolderContentById', async () => {
    // Setup mock
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        success: false,
        data: { subfolders: [], files: [] }
      }
    });

    // Execute & verify
    await expect(folderService.getFolderContentById(1)).rejects.toThrow('Gagal mendapatkan konten folder');
  });

  test('should handle root folder request differently', async () => {
    // Setup mock
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          { id: 2, name: 'Documents', parentId: 1 }
        ]
      }
    });

    // Execute
    const result = await folderService.getFolderContentById(null);

    // Verify
    expect(mockAxiosGet).toHaveBeenCalledWith(expect.stringContaining('/folders/0/subfolder'));
    expect(result.folders).toHaveLength(1);
    expect(result.files).toHaveLength(0);
  });

  test('should search folders and files correctly', async () => {
    // Setup mock
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockSearchResults
      }
    });

    // Execute
    const result = await folderService.searchFolderAndFiles('doc');

    // Verify
    expect(mockAxiosGet).toHaveBeenCalledWith(expect.stringContaining('/folders/search?q=doc'));
    expect(result?.folders).toHaveLength(1);
    expect(result?.files).toHaveLength(1);
    expect(result?.folders[0].name).toBe('Documents');
  });

  test('should return null for empty search query', async () => {
    // Execute
    const result = await folderService.searchFolderAndFiles('');

    // Verify
    expect(mockAxiosGet).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('should handle API error in searchFolderAndFiles', async () => {
    // Setup mock
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        success: false,
        data: { folders: [], files: [] }
      }
    });

    // Execute & verify
    await expect(folderService.searchFolderAndFiles('query')).rejects.toThrow('Gagal melakukan pencarian');
  });

  test('should handle network errors', async () => {
    // Setup mock
    mockAxiosGet.mockRejectedValueOnce(new Error('Network Error'));

    // Execute & verify
    await expect(folderService.getFolderStructure()).rejects.toThrow();
  });
}); 
import { beforeEach, afterEach, vi } from 'vitest';

// Inisialisasi mock sebelum semua test
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Pastikan fungsi vi.mock tersedia di tingkat global
Object.defineProperty(global, 'vi', { 
  value: vi,
  writable: true,
  configurable: true
});

// Inisialisasi global mocks
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
})); 
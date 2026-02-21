import { vi } from 'vitest';

export default {
  get: vi.fn(() => Promise.resolve({ data: { produtos: [] } })),
  post: vi.fn(() => Promise.resolve({ data: {} })),
  put: vi.fn(() => Promise.resolve({ data: {} })),
  patch: vi.fn(() => Promise.resolve({ data: {} })),
  delete: vi.fn(() => Promise.resolve({ data: {} })),
};

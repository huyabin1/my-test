import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storage } from '@utils/storage';

describe('storage utilities', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('setItem and getItem', () => {
    it('should store and retrieve data', () => {
      storage.setItem('test', { value: 123 });
      const result = storage.getItem('test');
      expect(result).toEqual({ value: 123 });
    });

    it('should return null for non-existent keys', () => {
      const result = storage.getItem('non-existent');
      expect(result).toBeNull();
    });

    it('should handle complex objects', () => {
      const obj = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
      storage.setItem('complex', obj);
      expect(storage.getItem('complex')).toEqual(obj);
    });
  });

  describe('removeItem', () => {
    it('should remove stored data', () => {
      storage.setItem('test', 'value');
      storage.removeItem('test');
      expect(storage.getItem('test')).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all stored data', () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      storage.clear();
      expect(storage.getItem('key1')).toBeNull();
      expect(storage.getItem('key2')).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle getItem errors gracefully', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Simulate error by making getItem fail
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      const result = storage.getItem('test');
      expect(result).toBeNull();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});

/**
 * Storage utilities for persisting state
 */

export const storage = {
  getItem: (key: string) => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : null;
    } catch {
      console.error(`Failed to get item from storage: ${key}`);
      return null;
    }
  },

  setItem: (key: string, value: any) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      console.error(`Failed to set item in storage: ${key}`);
    }
  },

  removeItem: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch {
      console.error(`Failed to remove item from storage: ${key}`);
    }
  },

  clear: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch {
      console.error('Failed to clear storage');
    }
  },
};

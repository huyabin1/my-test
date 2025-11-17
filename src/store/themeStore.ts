import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeStore>(
  persist(
    (set, get) => ({
      theme: 'system',

      setTheme: (theme) => {
        set({ theme });
        const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
        applyTheme(effectiveTheme);
      },

      getEffectiveTheme: () => {
        const theme = get().theme;
        return theme === 'system' ? getSystemTheme() : theme;
      },
    }),
    {
      name: 'theme-store',
    }
  )
);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof window !== 'undefined') {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
  }
}

// Initialize theme on store creation
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme-store');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      const effectiveTheme = state.theme === 'system' ? getSystemTheme() : state.theme;
      applyTheme(effectiveTheme);
    } catch {
      // Ignore parse errors
    }
  } else {
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
  }
}

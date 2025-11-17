import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '@store/themeStore';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'system' });
  });

  describe('theme selection', () => {
    it('should set theme to light', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('light');
      expect(useThemeStore.getState().theme).toBe('light');
    });

    it('should set theme to dark', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');
      expect(useThemeStore.getState().theme).toBe('dark');
    });

    it('should set theme to system', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('system');
      expect(useThemeStore.getState().theme).toBe('system');
    });
  });

  describe('effective theme', () => {
    it('should return effective theme when set to light', () => {
      const { setTheme, getEffectiveTheme } = useThemeStore.getState();
      setTheme('light');
      expect(getEffectiveTheme()).toBe('light');
    });

    it('should return effective theme when set to dark', () => {
      const { setTheme, getEffectiveTheme } = useThemeStore.getState();
      setTheme('dark');
      expect(getEffectiveTheme()).toBe('dark');
    });

    it('should return system theme when set to system', () => {
      const { setTheme, getEffectiveTheme } = useThemeStore.getState();
      setTheme('system');
      const effective = getEffectiveTheme();
      expect(['light', 'dark']).toContain(effective);
    });
  });
});

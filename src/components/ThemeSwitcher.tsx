import { useThemeStore } from '@store/themeStore';
import { Tooltip } from './Tooltip';
import '@styles/theme-switcher.scss';

export function ThemeSwitcher() {
  const { theme, setTheme, getEffectiveTheme } = useThemeStore();
  const effectiveTheme = getEffectiveTheme();

  return (
    <div className="theme-switcher" role="toolbar" aria-label="Theme options">
      <Tooltip content="Light theme">
        <button
          className={`theme-switcher__btn ${theme === 'light' || (theme === 'system' && effectiveTheme === 'light') ? 'active' : ''}`}
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
          data-testid="theme-light"
        >
          ☀️
        </button>
      </Tooltip>

      <Tooltip content="Dark theme">
        <button
          className={`theme-switcher__btn ${theme === 'dark' || (theme === 'system' && effectiveTheme === 'dark') ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
          data-testid="theme-dark"
        >
          🌙
        </button>
      </Tooltip>

      <Tooltip content="System theme">
        <button
          className={`theme-switcher__btn ${theme === 'system' ? 'active' : ''}`}
          onClick={() => setTheme('system')}
          aria-pressed={theme === 'system'}
          data-testid="theme-system"
        >
          💻
        </button>
      </Tooltip>
    </div>
  );
}

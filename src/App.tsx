import { useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { StatusBar } from './components/StatusBar';
import { Toast } from './components/Toast';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useThemeStore } from './store/themeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import '@styles/global.scss';
import '@styles/app.scss';

function App() {
  const { getEffectiveTheme } = useThemeStore();

  // Setup keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Set initial theme
    const theme = getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }, [getEffectiveTheme]);

  return (
    <div className="app" data-testid="app">
      <header className="app__header">
        <h1 className="app__title">Drawing Canvas</h1>
        <ThemeSwitcher />
      </header>

      <Toolbar />

      <main className="app__main">
        <Canvas />
      </main>

      <StatusBar />

      <Toast />
    </div>
  );
}

export default App;

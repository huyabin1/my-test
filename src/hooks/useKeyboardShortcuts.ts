import { useEffect } from 'react';
import { useDrawingStore } from '@store/drawingStore';

export const useKeyboardShortcuts = () => {
  const { setMode, toggleSnapMode, undo, redo, canUndo, canRedo } = useDrawingStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z
      if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }

      // Draw mode: D
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setMode('draw');
      }

      // Select mode: S
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setMode('select');
      }

      // Edit mode: E
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setMode('edit');
      }

      // Toggle Snap: G
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        toggleSnapMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode, toggleSnapMode, undo, redo, canUndo, canRedo]);
};

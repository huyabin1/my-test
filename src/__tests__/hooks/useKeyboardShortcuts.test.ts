import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useDrawingStore } from '@store/drawingStore';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    useDrawingStore.setState({
      mode: 'draw',
      snapMode: false,
      viewMode: 'normal',
      zoom: 1,
      panX: 0,
      panY: 0,
      strokeWidth: 2,
      strokeColor: '#000000',
      fillColor: '#ffffff',
      history: ['', 'state1', 'state2'],
      historyIndex: 2,
      isDirty: false,
    });
  });

  it('should setup keyboard listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    renderHook(() => useKeyboardShortcuts());
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it('should cleanup keyboard listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyboardShortcuts());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should undo on Ctrl+Z', () => {
    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    expect(useDrawingStore.getState().historyIndex).toBe(1);
  });

  it('should set draw mode on D key', () => {
    useDrawingStore.setState({ mode: 'select' });
    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 'd',
      bubbles: true,
    });
    window.dispatchEvent(event);
    expect(useDrawingStore.getState().mode).toBe('draw');
  });

  it('should set select mode on S key', () => {
    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 's',
      bubbles: true,
    });
    window.dispatchEvent(event);
    expect(useDrawingStore.getState().mode).toBe('select');
  });

  it('should set edit mode on E key', () => {
    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 'e',
      bubbles: true,
    });
    window.dispatchEvent(event);
    expect(useDrawingStore.getState().mode).toBe('edit');
  });

  it('should toggle snap mode on G key', () => {
    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 'g',
      bubbles: true,
    });
    window.dispatchEvent(event);
    expect(useDrawingStore.getState().snapMode).toBe(true);
  });

  it('should prevent default key behavior', () => {
    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should handle uppercase keys', () => {
    useDrawingStore.setState({ mode: 'draw' });
    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 'S',
      bubbles: true,
    });
    window.dispatchEvent(event);
    expect(useDrawingStore.getState().mode).toBe('select');
  });

  it('should handle Cmd+Z on Mac', () => {
    const userAgentGetter = vi.spyOn(navigator, 'platform', 'get');
    userAgentGetter.mockReturnValue('MacIntel');

    renderHook(() => useKeyboardShortcuts());
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    expect(useDrawingStore.getState().historyIndex).toBe(1);

    userAgentGetter.mockRestore();
  });
});

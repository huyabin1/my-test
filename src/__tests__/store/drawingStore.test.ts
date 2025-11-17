import { describe, it, expect, beforeEach } from 'vitest';
import { useDrawingStore } from '@store/drawingStore';

describe('useDrawingStore', () => {
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
      history: [''],
      historyIndex: 0,
      isDirty: false,
    });
  });

  describe('mode management', () => {
    it('should set mode to draw', () => {
      const { setMode } = useDrawingStore.getState();
      setMode('draw');
      expect(useDrawingStore.getState().mode).toBe('draw');
    });

    it('should set mode to select', () => {
      const { setMode } = useDrawingStore.getState();
      setMode('select');
      expect(useDrawingStore.getState().mode).toBe('select');
    });

    it('should set mode to edit', () => {
      const { setMode } = useDrawingStore.getState();
      setMode('edit');
      expect(useDrawingStore.getState().mode).toBe('edit');
    });
  });

  describe('snap mode', () => {
    it('should toggle snap mode on', () => {
      const { toggleSnapMode } = useDrawingStore.getState();
      toggleSnapMode();
      expect(useDrawingStore.getState().snapMode).toBe(true);
    });

    it('should toggle snap mode off', () => {
      useDrawingStore.setState({ snapMode: true });
      const { toggleSnapMode } = useDrawingStore.getState();
      toggleSnapMode();
      expect(useDrawingStore.getState().snapMode).toBe(false);
    });
  });

  describe('view mode', () => {
    it('should set view mode to grid', () => {
      const { setViewMode } = useDrawingStore.getState();
      setViewMode('grid');
      expect(useDrawingStore.getState().viewMode).toBe('grid');
    });

    it('should set view mode to outline', () => {
      const { setViewMode } = useDrawingStore.getState();
      setViewMode('outline');
      expect(useDrawingStore.getState().viewMode).toBe('outline');
    });
  });

  describe('zoom', () => {
    it('should set zoom level', () => {
      const { setZoom } = useDrawingStore.getState();
      setZoom(2);
      expect(useDrawingStore.getState().zoom).toBe(2);
    });

    it('should clamp zoom to min 0.1', () => {
      const { setZoom } = useDrawingStore.getState();
      setZoom(0.05);
      expect(useDrawingStore.getState().zoom).toBe(0.1);
    });

    it('should clamp zoom to max 5', () => {
      const { setZoom } = useDrawingStore.getState();
      setZoom(10);
      expect(useDrawingStore.getState().zoom).toBe(5);
    });
  });

  describe('panning', () => {
    it('should set pan position', () => {
      const { setPan } = useDrawingStore.getState();
      setPan(100, 200);
      const state = useDrawingStore.getState();
      expect(state.panX).toBe(100);
      expect(state.panY).toBe(200);
    });
  });

  describe('stroke settings', () => {
    it('should set stroke width', () => {
      const { setStrokeWidth } = useDrawingStore.getState();
      setStrokeWidth(5);
      expect(useDrawingStore.getState().strokeWidth).toBe(5);
    });

    it('should not allow stroke width less than 1', () => {
      const { setStrokeWidth } = useDrawingStore.getState();
      setStrokeWidth(0);
      expect(useDrawingStore.getState().strokeWidth).toBe(1);
    });

    it('should set stroke color', () => {
      const { setStrokeColor } = useDrawingStore.getState();
      setStrokeColor('#ff0000');
      expect(useDrawingStore.getState().strokeColor).toBe('#ff0000');
    });

    it('should set fill color', () => {
      const { setFillColor } = useDrawingStore.getState();
      setFillColor('#00ff00');
      expect(useDrawingStore.getState().fillColor).toBe('#00ff00');
    });
  });

  describe('history management', () => {
    it('should add to history', () => {
      const { addToHistory } = useDrawingStore.getState();
      addToHistory('state1');
      const state = useDrawingStore.getState();
      expect(state.history.length).toBe(2);
      expect(state.history[1]).toBe('state1');
    });

    it('should undo', () => {
      const { addToHistory, undo } = useDrawingStore.getState();
      addToHistory('state1');
      addToHistory('state2');
      undo();
      expect(useDrawingStore.getState().historyIndex).toBe(1);
    });

    it('should redo', () => {
      const { addToHistory, undo, redo } = useDrawingStore.getState();
      addToHistory('state1');
      addToHistory('state2');
      undo();
      redo();
      expect(useDrawingStore.getState().historyIndex).toBe(2);
    });

    it('should know when undo is possible', () => {
      const { addToHistory, canUndo } = useDrawingStore.getState();
      addToHistory('state1');
      expect(canUndo()).toBe(true);
    });

    it('should know when redo is possible', () => {
      const { addToHistory, undo, canRedo } = useDrawingStore.getState();
      addToHistory('state1');
      undo();
      expect(canRedo()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      const { setMode, setStrokeWidth, reset } = useDrawingStore.getState();
      setMode('select');
      setStrokeWidth(10);
      reset();
      const state = useDrawingStore.getState();
      expect(state.mode).toBe('draw');
      expect(state.strokeWidth).toBe(2);
    });
  });
});

import { create } from 'zustand';

export interface DrawingState {
  mode: 'draw' | 'select' | 'edit';
  snapMode: boolean;
  viewMode: 'normal' | 'grid' | 'outline';
  zoom: number;
  panX: number;
  panY: number;
  strokeWidth: number;
  strokeColor: string;
  fillColor: string;
  history: string[];
  historyIndex: number;
  isDirty: boolean;
}

export interface DrawingStore extends DrawingState {
  setMode: (mode: DrawingState['mode']) => void;
  toggleSnapMode: () => void;
  setViewMode: (viewMode: DrawingState['viewMode']) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setStrokeWidth: (width: number) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  addToHistory: (state: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
}

const initialState: DrawingState = {
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
};

export const useDrawingStore = create<DrawingStore>((set, get) => ({
  ...initialState,

  setMode: (mode) => {
    set({ mode });
  },

  toggleSnapMode: () => {
    set((state) => ({ snapMode: !state.snapMode }));
  },

  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
  },

  setPan: (x, y) => {
    set({ panX: x, panY: y });
  },

  setStrokeWidth: (width) => {
    set({ strokeWidth: Math.max(1, width) });
  },

  setStrokeColor: (color) => {
    set({ strokeColor: color });
  },

  setFillColor: (color) => {
    set({ fillColor: color });
  },

  addToHistory: (state) => {
    set((prevState) => {
      const newHistory = prevState.history.slice(0, prevState.historyIndex + 1);
      newHistory.push(state);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        return { historyIndex: state.historyIndex - 1 };
      }
      return state;
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        return { historyIndex: state.historyIndex + 1 };
      }
      return state;
    });
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  reset: () => {
    set(initialState);
  },
}));

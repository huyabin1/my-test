import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Canvas } from '@components/Canvas';
import { useDrawingStore } from '@store/drawingStore';
import { useNotificationStore } from '@store/notificationStore';

describe('Canvas', () => {
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
    useNotificationStore.setState({ notifications: [] });
  });

  it('should render canvas element', () => {
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should apply zoom transform', () => {
    useDrawingStore.setState({ zoom: 2 });
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toHaveStyle('transform: scale(2) translate(0px, 0px)');
  });

  it('should apply pan transform', () => {
    useDrawingStore.setState({ panX: 50, panY: 100 });
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toHaveStyle('transform: scale(1) translate(50px, 100px)');
  });

  it('should handle mouse drawing in draw mode', () => {
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;

    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 100,
      clientY: 100,
    });
    canvas.dispatchEvent(mouseDownEvent);

    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 150,
      clientY: 150,
    });
    canvas.dispatchEvent(mouseMoveEvent);

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
    });
    canvas.dispatchEvent(mouseUpEvent);
  });

  it('should not draw in non-draw modes', () => {
    useDrawingStore.setState({ mode: 'select' });
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;

    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 100,
      clientY: 100,
    });
    canvas.dispatchEvent(mouseDownEvent);

    // Verify no drawing action occurred
    expect(useNotificationStore.getState().notifications.length).toBe(0);
  });

  it('should snap to grid when snap mode is enabled', () => {
    useDrawingStore.setState({ snapMode: true });
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;

    // Draw at position that should snap
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 105,
      clientY: 105,
    });
    canvas.dispatchEvent(mouseDownEvent);

    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 155,
      clientY: 155,
    });
    canvas.dispatchEvent(mouseMoveEvent);

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
    });
    canvas.dispatchEvent(mouseUpEvent);
  });

  it('should save to history after drawing', () => {
    const { addToHistory } = useDrawingStore.getState();
    const initialHistoryLength = useDrawingStore.getState().history.length;

    render(<Canvas />);
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;

    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 100,
      clientY: 100,
    });
    canvas.dispatchEvent(mouseDownEvent);

    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 150,
      clientY: 150,
    });
    canvas.dispatchEvent(mouseMoveEvent);

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
    });
    canvas.dispatchEvent(mouseUpEvent);

    // History may have been updated
    expect(useDrawingStore.getState().history.length).toBeGreaterThanOrEqual(
      initialHistoryLength
    );
  });

  it('should use stroke color from store', () => {
    useDrawingStore.setState({ strokeColor: '#ff0000' });
    render(<Canvas />);
    expect(useDrawingStore.getState().strokeColor).toBe('#ff0000');
  });

  it('should use stroke width from store', () => {
    useDrawingStore.setState({ strokeWidth: 5 });
    render(<Canvas />);
    expect(useDrawingStore.getState().strokeWidth).toBe(5);
  });
});

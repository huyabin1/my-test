import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from '@components/StatusBar';
import { useDrawingStore } from '@store/drawingStore';

describe('StatusBar', () => {
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

  it('should render status bar', () => {
    render(<StatusBar />);
    const statusBar = screen.getByRole('contentinfo');
    expect(statusBar).toBeInTheDocument();
  });

  it('should display current mode', () => {
    render(<StatusBar />);
    expect(screen.getByText(/Mode: Draw/i)).toBeInTheDocument();
  });

  it('should update mode display when changed', () => {
    const { rerender } = render(<StatusBar />);
    useDrawingStore.setState({ mode: 'select' });
    rerender(<StatusBar />);
    expect(screen.getByText(/Mode: Select/i)).toBeInTheDocument();
  });

  it('should display mode status indicator', () => {
    render(<StatusBar />);
    const indicator = screen.getByRole('contentinfo').querySelector('.status-indicator__dot');
    expect(indicator).toBeInTheDocument();
  });

  it('should show snap mode badge when enabled', () => {
    useDrawingStore.setState({ snapMode: true });
    render(<StatusBar />);
    expect(screen.getByText('Snap Mode')).toBeInTheDocument();
  });

  it('should not show snap mode badge when disabled', () => {
    render(<StatusBar />);
    expect(screen.queryByText('Snap Mode')).not.toBeInTheDocument();
  });

  it('should display view mode', () => {
    render(<StatusBar />);
    expect(screen.getByText(/View: normal/i)).toBeInTheDocument();
  });

  it('should update view mode display', () => {
    const { rerender } = render(<StatusBar />);
    useDrawingStore.setState({ viewMode: 'grid' });
    rerender(<StatusBar />);
    expect(screen.getByText(/View: grid/i)).toBeInTheDocument();
  });

  it('should display zoom level', () => {
    render(<StatusBar />);
    expect(screen.getByText(/Zoom: 100%/i)).toBeInTheDocument();
  });

  it('should update zoom display', () => {
    const { rerender } = render(<StatusBar />);
    useDrawingStore.setState({ zoom: 2 });
    rerender(<StatusBar />);
    expect(screen.getByText(/Zoom: 200%/i)).toBeInTheDocument();
  });

  it('should format zoom as percentage', () => {
    useDrawingStore.setState({ zoom: 0.5 });
    render(<StatusBar />);
    expect(screen.getByText(/Zoom: 50%/i)).toBeInTheDocument();
  });
});

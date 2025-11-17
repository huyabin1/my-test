import { useEffect, useRef, useState } from 'react';
import { useDrawingStore } from '@store/drawingStore';
import { useNotificationStore } from '@store/notificationStore';
import '@styles/canvas.scss';

interface DrawPoint {
  x: number;
  y: number;
}

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<DrawPoint | null>(null);

  const {
    mode,
    strokeWidth,
    strokeColor,
    fillColor,
    zoom,
    panX,
    panY,
    snapMode,
    addToHistory,
  } = useDrawingStore();

  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Clear and draw background
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if needed
    drawGrid(ctx, canvas.width, canvas.height);
  }, [fillColor]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const snapToGrid = (point: DrawPoint): DrawPoint => {
    if (!snapMode) return point;
    const gridSize = 10;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point: DrawPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setLastPoint(snapToGrid(point));
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentPoint: DrawPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const snappedPoint = snapToGrid(currentPoint);

    if (lastPoint) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(snappedPoint.x, snappedPoint.y);
      ctx.stroke();
    }

    setLastPoint(snappedPoint);
  };

  const handleMouseUp = () => {
    if (isDrawing && mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        addToHistory(canvas.toDataURL());
        addNotification({
          type: 'info',
          title: 'Drawing saved',
          duration: 2000,
        });
      }
    }
    setIsDrawing(false);
    setLastPoint(null);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="canvas"
        style={{
          transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-testid="canvas"
      />
    </div>
  );
}

import { useDrawingStore } from '@store/drawingStore';
import '@styles/status-bar.scss';

export function StatusBar() {
  const { mode, snapMode, viewMode, zoom } = useDrawingStore();

  return (
    <div className="status-bar" role="contentinfo">
      <div className="status-bar__section">
        <div className="status-indicator">
          <span className={`status-indicator__dot status-${mode === 'draw' ? 'active' : 'idle'}`} />
          <span>Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
        </div>
      </div>

      <div className="status-bar__section">
        {snapMode && (
          <div className="badge badge-info">Snap Mode</div>
        )}
        <div className="badge badge-secondary">View: {viewMode}</div>
      </div>

      <div className="status-bar__section">
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}

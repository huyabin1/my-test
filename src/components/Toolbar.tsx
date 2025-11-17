import { useDrawingStore } from '@store/drawingStore';
import { useNotificationStore } from '@store/notificationStore';
import { Tooltip } from './Tooltip';
import '@styles/toolbar.scss';

export function Toolbar() {
  const {
    mode,
    setMode,
    snapMode,
    toggleSnapMode,
    viewMode,
    setViewMode,
    strokeWidth,
    setStrokeWidth,
    strokeColor,
    setStrokeColor,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useDrawingStore();

  const { addNotification } = useNotificationStore();

  const handleExport = () => {
    addNotification({
      type: 'success',
      title: 'Export',
      message: 'Canvas exported successfully',
      duration: 3000,
    });
  };

  return (
    <div className="toolbar" role="toolbar" aria-label="Drawing tools">
      <div className="toolbar__section">
        <div className="toolbar__group">
          <Tooltip content="Draw mode">
            <button
              className={`btn btn-secondary ${mode === 'draw' ? 'active' : ''}`}
              onClick={() => {
                setMode('draw');
                addNotification({
                  type: 'info',
                  title: 'Draw mode enabled',
                  duration: 1500,
                });
              }}
              aria-pressed={mode === 'draw'}
              data-testid="mode-draw"
            >
              ✏️
            </button>
          </Tooltip>

          <Tooltip content="Select mode">
            <button
              className={`btn btn-secondary ${mode === 'select' ? 'active' : ''}`}
              onClick={() => setMode('select')}
              aria-pressed={mode === 'select'}
              data-testid="mode-select"
            >
              ⬚
            </button>
          </Tooltip>

          <Tooltip content="Edit mode">
            <button
              className={`btn btn-secondary ${mode === 'edit' ? 'active' : ''}`}
              onClick={() => setMode('edit')}
              aria-pressed={mode === 'edit'}
              data-testid="mode-edit"
            >
              ✎
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="toolbar__section">
        <div className="toolbar__group">
          <label className="toolbar__label">
            Stroke Width:
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="toolbar__slider"
              data-testid="stroke-width"
            />
            <span>{strokeWidth}px</span>
          </label>
        </div>

        <div className="toolbar__group">
          <label className="toolbar__label">
            Color:
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="toolbar__color"
              data-testid="stroke-color"
            />
          </label>
        </div>
      </div>

      <div className="toolbar__section">
        <div className="toolbar__group">
          <Tooltip content="Toggle snap to grid">
            <button
              className={`btn btn-secondary ${snapMode ? 'active' : ''}`}
              onClick={toggleSnapMode}
              aria-pressed={snapMode}
              data-testid="snap-mode"
            >
              🔒
            </button>
          </Tooltip>

          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="btn btn-secondary"
            data-testid="view-mode"
          >
            <option value="normal">Normal</option>
            <option value="grid">Grid</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      </div>

      <div className="toolbar__section">
        <div className="toolbar__group">
          <Tooltip content="Undo (Ctrl+Z)">
            <button
              className="btn btn-secondary"
              onClick={undo}
              disabled={!canUndo()}
              data-testid="undo"
            >
              ↶
            </button>
          </Tooltip>

          <Tooltip content="Redo (Ctrl+Y)">
            <button
              className="btn btn-secondary"
              onClick={redo}
              disabled={!canRedo()}
              data-testid="redo"
            >
              ↷
            </button>
          </Tooltip>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleExport}
          data-testid="export"
        >
          Export
        </button>
      </div>
    </div>
  );
}

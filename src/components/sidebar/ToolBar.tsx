import { useStore } from '../../store/useStore';
import type { CameraPreset } from '../scene/CameraController';

interface ToolBarProps {
  mode: 'translate' | 'rotate';
  onModeChange: (mode: 'translate' | 'rotate') => void;
  cameraPreset: CameraPreset;
  onCameraChange: (preset: CameraPreset) => void;
}

export default function ToolBar({ mode, onModeChange, cameraPreset, onCameraChange }: ToolBarProps) {
  const selectedId = useStore((s) => s.selectedId);
  const removeFurniture = useStore((s) => s.removeFurniture);

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>도구</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <button
          className={`preset-btn ${mode === 'translate' ? 'active' : ''}`}
          onClick={() => onModeChange('translate')}
        >
          이동 (G)
        </button>
        <button
          className={`preset-btn ${mode === 'rotate' ? 'active' : ''}`}
          onClick={() => onModeChange('rotate')}
        >
          회전 (R)
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <button
          className={`preset-btn ${cameraPreset === 'perspective' ? 'active' : ''}`}
          onClick={() => onCameraChange('perspective')}
        >
          3D 뷰
        </button>
        <button
          className={`preset-btn ${cameraPreset === 'top' ? 'active' : ''}`}
          onClick={() => onCameraChange('top')}
        >
          탑 뷰
        </button>
      </div>
      {selectedId && (
        <button
          className="preset-btn"
          style={{ width: '100%', color: '#ff6b6b' }}
          onClick={() => removeFurniture(selectedId)}
        >
          삭제 (Del)
        </button>
      )}
    </section>
  );
}

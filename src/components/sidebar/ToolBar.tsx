import { useStore } from '../../store/useStore';
import type { CameraPreset } from '../scene/CameraController';

interface ToolBarProps {
  mode: 'translate' | 'rotate';
  onModeChange: (mode: 'translate' | 'rotate') => void;
  cameraPreset: CameraPreset;
  onCameraChange: (preset: CameraPreset) => void;
}

export default function ToolBar({ mode, onModeChange, cameraPreset, onCameraChange }: ToolBarProps) {
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const removeFurniture = useStore((s) => s.removeFurniture);
  const save = useStore((s) => s.save);
  const load = useStore((s) => s.load);

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
      {selectedFurnitureId && (
        <button
          className="preset-btn"
          style={{ width: '100%', color: '#ff6b6b', marginBottom: 10 }}
          onClick={() => removeFurniture(selectedFurnitureId)}
        >
          삭제 (Del)
        </button>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="preset-btn" style={{ flex: 1 }} onClick={save}>
          저장
        </button>
        <button className="preset-btn" style={{ flex: 1 }} onClick={load}>
          불러오기
        </button>
      </div>
    </section>
  );
}

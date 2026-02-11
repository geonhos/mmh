import { useRef } from 'react';
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
  const snapEnabled = useStore((s) => s.snapEnabled);
  const setSnapEnabled = useStore((s) => s.setSnapEnabled);
  const exportToFile = useStore((s) => s.exportToFile);
  const importFromFile = useStore((s) => s.importFromFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <button
          className={`preset-btn ${snapEnabled ? 'active' : ''}`}
          style={{ flex: 1 }}
          onClick={() => setSnapEnabled(!snapEnabled)}
        >
          스냅 {snapEnabled ? 'ON' : 'OFF'}
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
        <button className="preset-btn" style={{ flex: 1 }} onClick={exportToFile}>
          저장
        </button>
        <button className="preset-btn" style={{ flex: 1 }} onClick={() => fileInputRef.current?.click()}>
          불러오기
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => importFromFile(reader.result as string);
            reader.readAsText(file);
            e.target.value = '';
          }}
        />
      </div>
    </section>
  );
}

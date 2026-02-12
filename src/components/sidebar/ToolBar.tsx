import { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { getSceneRefs } from '../scene/SceneBridge';
import type { CameraPreset } from '../scene/CameraController';

interface ToolBarProps {
  cameraPreset: CameraPreset;
  onCameraChange: (preset: CameraPreset) => void;
  onShowShortcuts?: () => void;
}

export default function ToolBar({ cameraPreset, onCameraChange, onShowShortcuts }: ToolBarProps) {
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const furnitureList = useStore((s) => s.furnitureList);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const removeFurniture = useStore((s) => s.removeFurniture);
  const duplicateFurniture = useStore((s) => s.duplicateFurniture);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const historyLength = useStore((s) => s._history.length);
  const futureLength = useStore((s) => s._future.length);
  const snapEnabled = useStore((s) => s.snapEnabled);
  const setSnapEnabled = useStore((s) => s.setSnapEnabled);
  const exportToFile = useStore((s) => s.exportToFile);
  const importFromFile = useStore((s) => s.importFromFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = furnitureList.find((f) => f.id === selectedFurnitureId);

  const rotateY = (angle: number) => {
    if (!selectedItem) return;
    updateFurniture(selectedItem.id, {
      rotation: [selectedItem.rotation[0], selectedItem.rotation[1] + angle, selectedItem.rotation[2]],
    });
  };

  return (
    <section style={{ marginBottom: 24 }}>
      {/* Furniture actions */}
      {selectedItem && (
        <>
          <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>가구 조작</h3>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <button
              className="preset-btn"
              style={{ flex: 1 }}
              onClick={() => rotateY(-Math.PI / 2)}
              title="왼쪽으로 90° 회전 (Shift+R)"
            >
              ← 90° 회전
            </button>
            <button
              className="preset-btn"
              style={{ flex: 1 }}
              onClick={() => rotateY(Math.PI / 2)}
              title="오른쪽으로 90° 회전 (R)"
            >
              90° 회전 →
            </button>
          </div>
          <button
            className="preset-btn"
            style={{ width: '100%', marginBottom: 6 }}
            onClick={() => duplicateFurniture(selectedFurnitureId!)}
            title="선택한 가구를 복제합니다 (Ctrl+D)"
          >
            복제 (Ctrl+D)
          </button>
          <button
            className="preset-btn"
            style={{ width: '100%', color: '#ff6b6b', marginBottom: 10 }}
            onClick={() => removeFurniture(selectedFurnitureId!)}
          >
            삭제 (Del)
          </button>
        </>
      )}

      {/* Undo/Redo */}
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>실행취소</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <button className="preset-btn" style={{ flex: 1 }}
          onClick={undo} disabled={historyLength === 0}
          title="실행취소 (Ctrl+Z)">
          ↩ 실행취소
        </button>
        <button className="preset-btn" style={{ flex: 1 }}
          onClick={redo} disabled={futureLength === 0}
          title="다시실행 (Ctrl+Shift+Z)">
          다시실행 ↪
        </button>
      </div>

      {/* View */}
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>보기</h3>
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
          위에서 보기
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <button
          className={`preset-btn ${snapEnabled ? 'active' : ''}`}
          style={{ flex: 1 }}
          onClick={() => setSnapEnabled(!snapEnabled)}
          title="켜면 가구와 방이 격자/벽에 딱 맞게 정렬됩니다"
        >
          격자 정렬 {snapEnabled ? 'ON' : 'OFF'}
        </button>
        <button className="preset-btn" style={{ flex: 1 }}
          onClick={onShowShortcuts} title="키보드 단축키 (?)">
          ? 단축키
        </button>
      </div>

      {/* File */}
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>파일</h3>
      <button className="preset-btn" style={{ width: '100%', marginBottom: 6 }}
        onClick={() => {
          const { gl, scene, camera } = getSceneRefs();
          if (!gl || !scene || !camera) return;
          const prevSelected = useStore.getState().selectedFurnitureId;
          useStore.getState().setSelectedFurnitureId(null);
          gl.render(scene, camera);
          const dataUrl = gl.domElement.toDataURL('image/png');
          useStore.getState().setSelectedFurnitureId(prevSelected);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `my-model-house-${Date.now()}.png`;
          a.click();
        }}
        title="현재 화면을 이미지로 저장합니다">
        스크린샷 저장
      </button>
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

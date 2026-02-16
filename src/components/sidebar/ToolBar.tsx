import { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { getSceneRefs } from '../scene/SceneBridge';
import { encodeStateToHash } from '../../utils/sharing';

interface ToolBarProps {
  onShowShortcuts?: () => void;
}

export default function ToolBar({ onShowShortcuts }: ToolBarProps) {
  const snapEnabled = useStore((s) => s.snapEnabled);
  const setSnapEnabled = useStore((s) => s.setSnapEnabled);
  const ppQuality = useStore((s) => s.postProcessingQuality);
  const setPPQuality = useStore((s) => s.setPostProcessingQuality);
  const exportToFile = useStore((s) => s.exportToFile);
  const importFromFile = useStore((s) => s.importFromFile);
  const floorPlan = useStore((s) => s.floorPlan);
  const setFloorPlan = useStore((s) => s.setFloorPlan);
  const updateFloorPlan = useStore((s) => s.updateFloorPlan);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* Display */}
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>화면</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
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
      <button className="preset-btn" style={{ width: '100%', marginBottom: 16 }}
        onClick={() => {
          const cycle = { off: 'low', low: 'high', high: 'off' } as const;
          setPPQuality(cycle[ppQuality]);
        }}>
        효과: {ppQuality === 'off' ? '끄기' : ppQuality === 'low' ? '낮음' : '높음'}
      </button>

      {/* Floor plan */}
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>도면</h3>
      <button className="preset-btn" style={{ width: '100%', marginBottom: 6 }}
        onClick={() => floorPlanInputRef.current?.click()}>
        도면 이미지 불러오기
      </button>
      <input
        ref={floorPlanInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const defaultWidth = 10;
              const aspect = img.height / img.width;
              setFloorPlan({
                dataUrl: reader.result as string,
                scale: 1,
                position: [0, 0],
                opacity: 0.5,
                width: defaultWidth,
                height: defaultWidth * aspect,
              });
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(file);
          e.target.value = '';
        }}
      />
      {floorPlan && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>
            크기 (가로 {floorPlan.width.toFixed(1)}m)
            <input type="range" min={2} max={30} step={0.5}
              value={floorPlan.width}
              onChange={(e) => {
                const w = parseFloat(e.target.value);
                const aspect = floorPlan.height / floorPlan.width;
                updateFloorPlan({ width: w, height: w * aspect });
              }}
              style={{ width: '100%' }}
            />
          </label>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>
            투명도 ({(floorPlan.opacity * 100).toFixed(0)}%)
            <input type="range" min={0.1} max={1} step={0.1}
              value={floorPlan.opacity}
              onChange={(e) => updateFloorPlan({ opacity: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </label>
          <button className="preset-btn" style={{ width: '100%', color: '#ff6b6b' }}
            onClick={() => setFloorPlan(null)}>
            도면 제거
          </button>
        </div>
      )}

      {/* File */}
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>파일</h3>
      <button className="preset-btn" style={{ width: '100%', marginBottom: 6 }}
        onClick={() => {
          const { gl, scene, camera } = getSceneRefs();
          if (!gl || !scene || !camera) return;
          const prevSelected = useStore.getState().selectedFurnitureIds;
          useStore.getState().setSelectedFurnitureId(null);
          gl.render(scene, camera);
          const dataUrl = gl.domElement.toDataURL('image/png');
          prevSelected.forEach((id) => useStore.getState().toggleFurnitureSelection(id));
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `my-model-house-${Date.now()}.png`;
          a.click();
        }}
        title="현재 화면을 이미지로 저장합니다">
        스크린샷 저장
      </button>
      <button className="preset-btn" style={{ width: '100%', marginBottom: 6 }}
        onClick={async () => {
          const { rooms, furnitureList } = useStore.getState();
          const url = encodeStateToHash(rooms, furnitureList);
          if (!url) {
            alert('현재 프로젝트가 너무 커서 URL로 공유할 수 없습니다. 파일로 저장해 주세요.');
            return;
          }
          try {
            await navigator.clipboard.writeText(url);
            alert('링크가 클립보드에 복사되었습니다!');
          } catch {
            prompt('아래 링크를 복사하세요:', url);
          }
        }}>
        링크 복사
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
    </div>
  );
}

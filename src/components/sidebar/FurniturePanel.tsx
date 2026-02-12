import { useStore } from '../../store/useStore';

export default function FurniturePanel() {
  const selectedIds = useStore((s) => s.selectedFurnitureIds);
  const furnitureList = useStore((s) => s.furnitureList);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const removeFurniture = useStore((s) => s.removeFurniture);

  const selectedItems = furnitureList.filter((f) => selectedIds.includes(f.id));
  if (selectedItems.length === 0) return null;

  if (selectedItems.length > 1) {
    return (
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>
          {selectedItems.length}개 가구 선택됨
        </h3>
        <button
          className="preset-btn"
          style={{ width: '100%', color: '#ff6b6b', marginBottom: 6 }}
          onClick={() => selectedIds.forEach((id) => removeFurniture(id))}
        >
          전체 삭제
        </button>
        <button
          className="preset-btn"
          style={{ width: '100%' }}
          onClick={() => selectedIds.forEach((id) => updateFurniture(id, { locked: true }))}
        >
          전체 고정
        </button>
      </section>
    );
  }

  const item = selectedItems[0];
  if (!item) return null;

  const posLabels = ['X', 'Y', 'Z'] as const;
  const rotLabels = ['RX', 'RY', 'RZ'] as const;

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>
        {item.name} 속성
      </h3>
      <div style={{ marginBottom: 10 }}>
        <button
          className={`preset-btn ${item.locked ? 'active' : ''}`}
          style={{ width: '100%' }}
          onClick={() => updateFurniture(item.id, { locked: !item.locked })}
          title={item.locked ? '클릭하면 가구를 다시 움직일 수 있습니다' : '클릭하면 가구가 고정되어 실수로 움직이지 않습니다'}
        >
          {item.locked ? '고정됨 (눌러서 해제)' : '고정하기'}
        </button>
      </div>
      <div style={{ fontSize: 12 }}>
        <div style={{ marginBottom: 8, color: '#888' }}>위치 (m)</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {posLabels.map((label, i) => (
            <label key={label} style={{ flex: 1 }}>
              <span style={{ color: '#888', fontSize: 11 }}>{label}</span>
              <input
                type="number"
                step={0.1}
                value={Number(item.position[i].toFixed(2))}
                onChange={(e) => {
                  const pos = [...item.position] as [number, number, number];
                  pos[i] = parseFloat(e.target.value) || 0;
                  updateFurniture(item.id, { position: pos });
                }}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  background: '#222',
                  border: '1px solid #444',
                  borderRadius: 4,
                  color: '#ddd',
                  fontSize: 12,
                }}
              />
            </label>
          ))}
        </div>
        <div style={{ marginBottom: 8, color: '#888' }}>회전 (rad)</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {rotLabels.map((label, i) => (
            <label key={label} style={{ flex: 1 }}>
              <span style={{ color: '#888', fontSize: 11 }}>{label}</span>
              <input
                type="number"
                step={0.1}
                value={Number(item.rotation[i].toFixed(2))}
                onChange={(e) => {
                  const rot = [...item.rotation] as [number, number, number];
                  rot[i] = parseFloat(e.target.value) || 0;
                  updateFurniture(item.id, { rotation: rot });
                }}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  background: '#222',
                  border: '1px solid #444',
                  borderRadius: 4,
                  color: '#ddd',
                  fontSize: 12,
                }}
              />
            </label>
          ))}
        </div>
        <div style={{ marginBottom: 8, color: '#888' }}>크기 (m)</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['width', 'depth', 'height'] as const).map((key) => (
            <label key={key} style={{ flex: 1 }}>
              <span style={{ color: '#888', fontSize: 11 }}>
                {key === 'width' ? 'W' : key === 'depth' ? 'D' : 'H'}
              </span>
              <input
                type="number"
                step={0.05}
                min={0.1}
                max={10}
                value={Number(item.dimensions[key].toFixed(2))}
                onChange={(e) => {
                  const val = Math.min(10, Math.max(0.1, parseFloat(e.target.value) || 0.1));
                  updateFurniture(item.id, {
                    dimensions: { ...item.dimensions, [key]: val },
                  });
                }}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  background: '#222',
                  border: '1px solid #444',
                  borderRadius: 4,
                  color: '#ddd',
                  fontSize: 12,
                }}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

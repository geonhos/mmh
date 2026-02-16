import { useStore } from '../../store/useStore';

const inputStyle = {
  width: '100%',
  padding: '3px 5px',
  background: '#222',
  border: '1px solid #444',
  borderRadius: 4,
  color: '#ddd',
  fontSize: 11,
} as const;

export default function FurniturePanel() {
  const selectedIds = useStore((s) => s.selectedFurnitureIds);
  const furnitureList = useStore((s) => s.furnitureList);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const removeFurniture = useStore((s) => s.removeFurniture);
  const duplicateFurniture = useStore((s) => s.duplicateFurniture);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);

  const selectedItems = furnitureList.filter((f) => selectedIds.includes(f.id));
  if (selectedItems.length === 0) return null;

  // Multi-select
  if (selectedItems.length > 1) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedItems.length}개 선택</span>
          <button
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
            onClick={() => setSelectedFurnitureId(null)}
            title="선택 해제"
          >
            ✕
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="preset-btn"
            style={{ flex: 1, color: '#ff6b6b', fontSize: 12 }}
            onClick={() => selectedIds.forEach((id) => removeFurniture(id))}
          >
            전체 삭제
          </button>
          <button
            className="preset-btn"
            style={{ flex: 1, fontSize: 12 }}
            onClick={() => selectedIds.forEach((id) => updateFurniture(id, { locked: true }))}
          >
            전체 고정
          </button>
        </div>
      </div>
    );
  }

  // Single select
  const item = selectedItems[0];
  if (!item) return null;

  const rotateY = (angle: number) => {
    updateFurniture(item.id, {
      rotation: [item.rotation[0], item.rotation[1] + angle, item.rotation[2]],
    });
  };

  return (
    <div style={{ fontSize: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </span>
        <button
          className={`preset-btn ${item.locked ? 'active' : ''}`}
          style={{ padding: '2px 8px', fontSize: 11, flex: 'none' }}
          onClick={() => updateFurniture(item.id, { locked: !item.locked })}
          title={item.locked ? '고정 해제' : '고정'}
        >
          {item.locked ? '고정됨' : '고정'}
        </button>
        <button
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14, padding: '0 2px', flex: 'none' }}
          onClick={() => setSelectedFurnitureId(null)}
          title="선택 해제"
        >
          ✕
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <button className="preset-btn" style={{ flex: 1, fontSize: 11, padding: '4px 0' }}
          onClick={() => rotateY(-Math.PI / 2)} title="왼쪽 90° (Shift+R)">
          ← 90°
        </button>
        <button className="preset-btn" style={{ flex: 1, fontSize: 11, padding: '4px 0' }}
          onClick={() => rotateY(Math.PI / 2)} title="오른쪽 90° (R)">
          90° →
        </button>
        <button className="preset-btn" style={{ flex: 1, fontSize: 11, padding: '4px 0' }}
          onClick={() => duplicateFurniture(item.id)} title="복제 (Ctrl+D)">
          복제
        </button>
        <button className="preset-btn" style={{ flex: 1, fontSize: 11, padding: '4px 0', color: '#ff6b6b' }}
          onClick={() => removeFurniture(item.id)} title="삭제 (Del)">
          삭제
        </button>
      </div>

      {/* Position */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ color: '#888', fontSize: 11, marginBottom: 3 }}>위치</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['X', 'Y', 'Z'] as const).map((label, i) => (
            <label key={label} style={{ flex: 1 }}>
              <span style={{ color: '#666', fontSize: 10 }}>{label}</span>
              <input
                type="number" step={0.1}
                value={Number(item.position[i].toFixed(2))}
                onChange={(e) => {
                  const pos = [...item.position] as [number, number, number];
                  pos[i] = parseFloat(e.target.value) || 0;
                  updateFurniture(item.id, { position: pos });
                }}
                style={inputStyle}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ color: '#888', fontSize: 11, marginBottom: 3 }}>회전</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['RX', 'RY', 'RZ'] as const).map((label, i) => (
            <label key={label} style={{ flex: 1 }}>
              <span style={{ color: '#666', fontSize: 10 }}>{label}</span>
              <input
                type="number" step={0.1}
                value={Number(item.rotation[i].toFixed(2))}
                onChange={(e) => {
                  const rot = [...item.rotation] as [number, number, number];
                  rot[i] = parseFloat(e.target.value) || 0;
                  updateFurniture(item.id, { rotation: rot });
                }}
                style={inputStyle}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Dimensions + Color */}
      <div>
        <div style={{ color: '#888', fontSize: 11, marginBottom: 3 }}>크기</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['width', 'depth', 'height'] as const).map((key) => (
            <label key={key} style={{ flex: 1 }}>
              <span style={{ color: '#666', fontSize: 10 }}>
                {key === 'width' ? 'W' : key === 'depth' ? 'D' : 'H'}
              </span>
              <input
                type="number" step={0.05} min={0.1} max={10}
                value={Number(item.dimensions[key].toFixed(2))}
                onChange={(e) => {
                  const val = Math.min(10, Math.max(0.1, parseFloat(e.target.value) || 0.1));
                  updateFurniture(item.id, {
                    dimensions: { ...item.dimensions, [key]: val },
                  });
                }}
                style={inputStyle}
              />
            </label>
          ))}
          <label style={{ flex: 'none' }}>
            <span style={{ color: '#666', fontSize: 10 }}>색</span>
            <input
              type="color"
              value={item.color}
              onChange={(e) => updateFurniture(item.id, { color: e.target.value })}
              style={{
                display: 'block', width: 28, height: 22, padding: 0,
                border: '1px solid #444', borderRadius: 3, cursor: 'pointer',
                background: 'none',
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

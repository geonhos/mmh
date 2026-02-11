import { useStore } from '../../store/useStore';

export default function FurniturePanel() {
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const furnitureList = useStore((s) => s.furnitureList);
  const updateFurniture = useStore((s) => s.updateFurniture);

  const item = furnitureList.find((f) => f.id === selectedFurnitureId);
  if (!item) return null;

  const posLabels = ['X', 'Y', 'Z'] as const;
  const rotLabels = ['RX', 'RY', 'RZ'] as const;

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>
        {item.name} 속성
      </h3>
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

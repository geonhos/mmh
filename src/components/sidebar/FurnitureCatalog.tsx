import { furnitureCatalog } from '../../store/furnitureCatalog';
import { useStore } from '../../store/useStore';
import { generateId } from '../../utils/ids';

export default function FurnitureCatalog() {
  const addFurniture = useStore((s) => s.addFurniture);

  const handleAdd = (catalogId: string) => {
    const item = furnitureCatalog.find((c) => c.id === catalogId);
    if (!item) return;
    addFurniture({
      id: generateId(),
      catalogId: item.id,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      name: item.name,
      dimensions: { ...item.dimensions },
      color: item.color,
    });
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>가구 카탈로그</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {furnitureCatalog.map((item) => (
          <button
            key={item.id}
            className="catalog-item"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', item.id);
              e.dataTransfer.effectAllowed = 'copy';
            }}
            onClick={() => handleAdd(item.id)}
          >
            <span
              className="catalog-swatch"
              style={{ background: item.color }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: '#888' }}>
                {item.dimensions.width}m x {item.dimensions.depth}m x {item.dimensions.height}m
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

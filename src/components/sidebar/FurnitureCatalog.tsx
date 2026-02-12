import { useState } from 'react';
import { furnitureCatalog, categories, brands } from '../../store/furnitureCatalog';
import { useStore } from '../../store/useStore';
import { generateId } from '../../utils/ids';

export default function FurnitureCatalog() {
  const addFurniture = useStore((s) => s.addFurniture);
  const selectedRoomId = useStore((s) => s.selectedRoomId);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const filtered = furnitureCatalog.filter((item) => {
    const matchSearch = !search || item.name.includes(search) || item.category.includes(search) || (item.brand && item.brand.includes(search)) || (item.model && item.model.includes(search));
    const matchCategory = !activeCategory || item.category === activeCategory;
    const matchBrand = !activeBrand || item.brand === activeBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  const handleAdd = (catalogId: string) => {
    const item = furnitureCatalog.find((c) => c.id === catalogId);
    if (!item || !selectedRoomId) return;
    addFurniture({
      id: generateId(),
      catalogId: item.id,
      roomId: selectedRoomId,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      name: item.name,
      dimensions: { ...item.dimensions },
      color: item.color,
    });
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>가구 추가</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="검색 (예: 침대, MALM, 한샘...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 10px',
          marginBottom: 8,
          background: '#222',
          border: '1px solid #444',
          borderRadius: 6,
          color: '#ddd',
          fontSize: 13,
          boxSizing: 'border-box',
        }}
      />

      {/* Brand filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
        <button
          className={`preset-btn ${!activeBrand ? 'active' : ''}`}
          style={{ padding: '3px 8px', fontSize: 11, flex: 'none' }}
          onClick={() => setActiveBrand(null)}
        >
          전체
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            className={`preset-btn ${activeBrand === brand ? 'active' : ''}`}
            style={{ padding: '3px 8px', fontSize: 11, flex: 'none' }}
            onClick={() => setActiveBrand(activeBrand === brand ? null : brand)}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        <button
          className={`preset-btn ${!activeCategory ? 'active' : ''}`}
          style={{ padding: '3px 8px', fontSize: 11, flex: 'none' }}
          onClick={() => setActiveCategory(null)}
        >
          전체
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`preset-btn ${activeCategory === cat ? 'active' : ''}`}
            style={{ padding: '3px 8px', fontSize: 11, flex: 'none' }}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 240, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ color: '#666', fontSize: 12, padding: 8 }}>검색 결과가 없습니다</div>
        )}
        {filtered.map((item) => (
          <button
            key={item.id}
            className="catalog-item"
            onClick={() => handleAdd(item.id)}
          >
            <span
              className="catalog-swatch"
              style={{ background: item.color }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>
                {item.name}
                {item.brand && (
                  <span style={{ fontSize: 10, color: '#646cff', marginLeft: 6 }}>
                    {item.brand}
                  </span>
                )}
              </div>
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

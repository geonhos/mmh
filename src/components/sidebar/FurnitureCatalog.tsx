import { useState } from 'react';
import { furnitureCatalog, categories, brands } from '../../store/furnitureCatalog';
import { useStore } from '../../store/useStore';
import { generateId } from '../../utils/ids';

const shapeOptions = [
  { value: 'custom', label: '박스 (기본)' },
  { value: 'bed', label: '침대' },
  { value: 'table', label: '테이블' },
  { value: 'chair', label: '의자' },
  { value: 'sofa', label: '소파' },
  { value: 'shelf', label: '선반' },
];

export default function FurnitureCatalog() {
  const addFurniture = useStore((s) => s.addFurniture);
  const selectedRoomId = useStore((s) => s.selectedRoomId);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('커스텀 가구');
  const [customWidth, setCustomWidth] = useState(1.0);
  const [customDepth, setCustomDepth] = useState(1.0);
  const [customHeight, setCustomHeight] = useState(1.0);
  const [customColor, setCustomColor] = useState('#888888');
  const [customShape, setCustomShape] = useState('custom');

  const filtered = furnitureCatalog.filter((item) => {
    const matchSearch = !search || item.name.includes(search) || item.category.includes(search) || (item.brand && item.brand.includes(search)) || (item.model && item.model.includes(search));
    const matchCategory = !activeCategory || item.category === activeCategory;
    const matchBrand = !activeBrand || item.brand === activeBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  const handleAddCustom = () => {
    if (!selectedRoomId) return;
    addFurniture({
      id: generateId(),
      catalogId: customShape,
      roomId: selectedRoomId,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      name: customName,
      dimensions: { width: customWidth, depth: customDepth, height: customHeight },
      color: customColor,
    });
  };

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

      {/* Custom mode toggle */}
      <button
        className={`preset-btn ${customMode ? 'active' : ''}`}
        style={{ width: '100%', marginBottom: 8, padding: '6px 0', fontSize: 13 }}
        onClick={() => setCustomMode(!customMode)}
      >
        {customMode ? '카탈로그로 돌아가기' : '직접 만들기'}
      </button>

      {customMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="가구 이름"
            style={{
              width: '100%', padding: '6px 10px', background: '#222',
              border: '1px solid #444', borderRadius: 6, color: '#ddd', fontSize: 13,
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            <label style={{ fontSize: 11, color: '#888' }}>
              가로(m)
              <input type="number" min={0.1} max={10} step={0.1} value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                style={{ width: '100%', padding: '4px 6px', background: '#222',
                  border: '1px solid #444', borderRadius: 4, color: '#ddd', fontSize: 12,
                  boxSizing: 'border-box',
                }}
              />
            </label>
            <label style={{ fontSize: 11, color: '#888' }}>
              세로(m)
              <input type="number" min={0.1} max={10} step={0.1} value={customDepth}
                onChange={(e) => setCustomDepth(Number(e.target.value))}
                style={{ width: '100%', padding: '4px 6px', background: '#222',
                  border: '1px solid #444', borderRadius: 4, color: '#ddd', fontSize: 12,
                  boxSizing: 'border-box',
                }}
              />
            </label>
            <label style={{ fontSize: 11, color: '#888' }}>
              높이(m)
              <input type="number" min={0.1} max={10} step={0.1} value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                style={{ width: '100%', padding: '4px 6px', background: '#222',
                  border: '1px solid #444', borderRadius: 4, color: '#ddd', fontSize: 12,
                  boxSizing: 'border-box',
                }}
              />
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 11, color: '#888', flex: 1 }}>
              모양
              <select value={customShape} onChange={(e) => setCustomShape(e.target.value)}
                style={{ width: '100%', padding: '4px 6px', background: '#222',
                  border: '1px solid #444', borderRadius: 4, color: '#ddd', fontSize: 12,
                }}
              >
                {shapeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
            <label style={{ fontSize: 11, color: '#888' }}>
              색상
              <input type="color" value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                style={{ display: 'block', width: 36, height: 28, padding: 0,
                  border: '1px solid #444', borderRadius: 4, cursor: 'pointer',
                  background: 'none',
                }}
              />
            </label>
          </div>
          <button
            className="preset-btn active"
            style={{ padding: '8px 0', fontSize: 13, marginTop: 4 }}
            onClick={handleAddCustom}
            disabled={!selectedRoomId}
          >
            {selectedRoomId ? '추가' : '방을 먼저 선택하세요'}
          </button>
        </div>
      ) : (
      <>
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
      </>
      )}
    </section>
  );
}

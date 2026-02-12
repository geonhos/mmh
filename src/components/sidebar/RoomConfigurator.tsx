import type { RoomInstance, WallSide, WallElement } from '../../types';
import { useStore } from '../../store/useStore';
import { createDefaultRoom, DEFAULT_ROOM } from '../../utils/constants';
import { generateId } from '../../utils/ids';

const WALL_LABELS: Record<WallSide, string> = {
  north: '북(뒤)',
  south: '남(앞)',
  east: '동(오른쪽)',
  west: '서(왼쪽)',
};

/** Find a grid position that doesn't overlap any existing room. */
function findNonOverlappingPosition(rooms: RoomInstance[]): [number, number] {
  if (rooms.length === 0) return [0, 0];

  const cellW = DEFAULT_ROOM.width + 1; // room width + 1m gap
  const cellD = DEFAULT_ROOM.depth + 1;

  const occupied = new Set(
    rooms.map((r) => {
      const col = Math.round(r.position[0] / cellW);
      const row = Math.round(r.position[1] / cellD);
      return `${col},${row}`;
    }),
  );

  // Spiral-style search: row by row, column by column
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!occupied.has(`${col},${row}`)) {
        return [col * cellW, row * cellD];
      }
    }
  }

  return [rooms.length * cellW, 0];
}

export default function RoomConfigurator() {
  const rooms = useStore((s) => s.rooms);
  const selectedRoomId = useStore((s) => s.selectedRoomId);
  const setSelectedRoomId = useStore((s) => s.setSelectedRoomId);
  const addRoom = useStore((s) => s.addRoom);
  const updateRoom = useStore((s) => s.updateRoom);
  const removeRoom = useStore((s) => s.removeRoom);
  const addWallElement = useStore((s) => s.addWallElement);
  const updateWallElement = useStore((s) => s.updateWallElement);
  const removeWallElement = useStore((s) => s.removeWallElement);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const dimFields = [
    { label: '가로 (m)', key: 'width' as const, min: 2, max: 15 },
    { label: '세로 (m)', key: 'depth' as const, min: 2, max: 15 },
    { label: '높이 (m)', key: 'height' as const, min: 2, max: 4, step: 0.1 },
  ];

  const posFields = [
    { label: 'X 위치', key: 0 as const, min: -20, max: 20 },
    { label: 'Z 위치', key: 1 as const, min: -20, max: 20 },
  ];

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>방 관리</h3>

      {/* Room list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 8px',
              borderRadius: 4,
              background: room.id === selectedRoomId ? '#333' : 'transparent',
              cursor: 'pointer',
              fontSize: 13,
            }}
            onClick={() => setSelectedRoomId(room.id)}
          >
            <span style={{ flex: 1 }}>{room.name}</span>
            {rooms.length > 1 && (
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: '0 4px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeRoom(room.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        className="preset-btn"
        style={{ width: '100%', marginBottom: 12 }}
        onClick={() => {
          const newRoom = createDefaultRoom(`방 ${rooms.length + 1}`);
          newRoom.position = findNonOverlappingPosition(rooms);
          addRoom(newRoom);
          setSelectedRoomId(newRoom.id);
        }}
      >
        + 방 추가
      </button>

      {/* Selected room editor */}
      {selectedRoom && (
        <>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: '#888' }}>방 이름</label>
            <input
              type="text"
              value={selectedRoom.name}
              onChange={(e) => updateRoom(selectedRoom.id, { name: e.target.value })}
              style={{
                width: '100%',
                padding: '4px 8px',
                background: '#222',
                border: '1px solid #444',
                borderRadius: 4,
                color: '#ddd',
                fontSize: 13,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {dimFields.map(({ label, key, min, max, step }) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span>{label}</span>
                <input
                  type="number"
                  min={min}
                  max={max}
                  step={step ?? 0.5}
                  value={selectedRoom.dimensions[key]}
                  onChange={(e) => {
                    const val = Math.min(max, Math.max(min, parseFloat(e.target.value) || min));
                    updateRoom(selectedRoom.id, {
                      dimensions: { ...selectedRoom.dimensions, [key]: val },
                    });
                  }}
                  style={{
                    width: 64,
                    padding: '2px 6px',
                    background: '#222',
                    border: '1px solid #444',
                    borderRadius: 4,
                    color: '#ddd',
                    fontSize: 12,
                    textAlign: 'right',
                  }}
                />
              </label>
              <input
                type="range"
                min={min}
                max={max}
                step={step ?? 0.5}
                value={selectedRoom.dimensions[key]}
                onChange={(e) =>
                  updateRoom(selectedRoom.id, {
                    dimensions: { ...selectedRoom.dimensions, [key]: parseFloat(e.target.value) },
                  })
                }
                style={{ width: '100%' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 10 }}>
            <button
              className={`preset-btn ${selectedRoom.locked ? 'active' : ''}`}
              style={{ width: '100%' }}
              onClick={() => updateRoom(selectedRoom.id, { locked: !selectedRoom.locked })}
              title={selectedRoom.locked ? '클릭하면 방을 다시 움직일 수 있습니다' : '클릭하면 방이 고정되어 실수로 움직이지 않습니다'}
            >
              {selectedRoom.locked ? '고정됨 (눌러서 해제)' : '고정하기'}
            </button>
          </div>

          <div style={{ marginBottom: 8, color: '#888', fontSize: 12 }}>방 위치</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {posFields.map(({ label, key, min, max }) => (
              <label key={key} style={{ flex: 1 }}>
                <span style={{ color: '#888', fontSize: 11 }}>{label}</span>
                <input
                  type="number"
                  step={0.5}
                  min={min}
                  max={max}
                  value={selectedRoom.position[key]}
                  onChange={(e) => {
                    const pos: [number, number] = [...selectedRoom.position];
                    pos[key] = parseFloat(e.target.value) || 0;
                    updateRoom(selectedRoom.id, { position: pos });
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

          {/* Doors & Windows */}
          <div style={{ marginBottom: 8, color: '#888', fontSize: 12 }}>문/창문</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <button
              className="preset-btn"
              style={{ flex: 1 }}
              onClick={() => {
                const el: WallElement = {
                  id: generateId(),
                  type: 'door',
                  wall: 'south',
                  offset: 0,
                  width: 0.9,
                  height: 2.1,
                  elevation: 0,
                };
                addWallElement(selectedRoom.id, el);
              }}
            >
              + 문
            </button>
            <button
              className="preset-btn"
              style={{ flex: 1 }}
              onClick={() => {
                const el: WallElement = {
                  id: generateId(),
                  type: 'window',
                  wall: 'south',
                  offset: 0,
                  width: 1.2,
                  height: 1.0,
                  elevation: 1.0,
                };
                addWallElement(selectedRoom.id, el);
              }}
            >
              + 창문
            </button>
          </div>
          {(selectedRoom.wallElements ?? []).map((el) => (
            <div
              key={el.id}
              style={{
                background: '#222',
                borderRadius: 4,
                padding: '6px 8px',
                marginBottom: 6,
                fontSize: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: '#ddd' }}>
                  {el.type === 'door' ? '문' : '창문'}
                </span>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    fontSize: 13,
                    padding: '0 4px',
                  }}
                  onClick={() => removeWallElement(selectedRoom.id, el.id)}
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {(['north', 'south', 'east', 'west'] as const).map((side) => (
                  <button
                    key={side}
                    className={`preset-btn ${el.wall === side ? 'active' : ''}`}
                    style={{ flex: 1, fontSize: 10, padding: '2px 0' }}
                    onClick={() => updateWallElement(selectedRoom.id, el.id, { wall: side })}
                  >
                    {WALL_LABELS[side]}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <label style={{ flex: 1 }}>
                  <span style={{ color: '#888', fontSize: 10 }}>위치</span>
                  <input
                    type="number"
                    step={0.1}
                    value={el.offset}
                    onChange={(e) =>
                      updateWallElement(selectedRoom.id, el.id, {
                        offset: parseFloat(e.target.value) || 0,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '2px 4px',
                      background: '#1a1a2e',
                      border: '1px solid #444',
                      borderRadius: 3,
                      color: '#ddd',
                      fontSize: 11,
                    }}
                  />
                </label>
                <label style={{ flex: 1 }}>
                  <span style={{ color: '#888', fontSize: 10 }}>폭</span>
                  <input
                    type="number"
                    step={0.1}
                    min={0.3}
                    max={5}
                    value={el.width}
                    onChange={(e) =>
                      updateWallElement(selectedRoom.id, el.id, {
                        width: Math.max(0.3, parseFloat(e.target.value) || 0.3),
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '2px 4px',
                      background: '#1a1a2e',
                      border: '1px solid #444',
                      borderRadius: 3,
                      color: '#ddd',
                      fontSize: 11,
                    }}
                  />
                </label>
                <label style={{ flex: 1 }}>
                  <span style={{ color: '#888', fontSize: 10 }}>높이</span>
                  <input
                    type="number"
                    step={0.1}
                    min={0.3}
                    max={4}
                    value={el.height}
                    onChange={(e) =>
                      updateWallElement(selectedRoom.id, el.id, {
                        height: Math.max(0.3, parseFloat(e.target.value) || 0.3),
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '2px 4px',
                      background: '#1a1a2e',
                      border: '1px solid #444',
                      borderRadius: 3,
                      color: '#ddd',
                      fontSize: 11,
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}

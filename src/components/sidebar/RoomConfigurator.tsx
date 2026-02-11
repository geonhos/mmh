import type { RoomInstance } from '../../types';
import { useStore } from '../../store/useStore';
import { createDefaultRoom, DEFAULT_ROOM } from '../../utils/constants';

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
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>{label}</span>
                <span>{selectedRoom.dimensions[key].toFixed(1)}</span>
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
            >
              이동 {selectedRoom.locked ? '잠금' : '해제'}
            </button>
          </div>

          <div style={{ marginBottom: 8, color: '#888', fontSize: 12 }}>방 위치</div>
          <div style={{ display: 'flex', gap: 6 }}>
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
        </>
      )}
    </section>
  );
}

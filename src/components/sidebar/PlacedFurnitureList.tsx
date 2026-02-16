import { useState } from 'react';
import { useStore } from '../../store/useStore';

export default function PlacedFurnitureList() {
  const rooms = useStore((s) => s.rooms);
  const furnitureList = useStore((s) => s.furnitureList);
  const selectedFurnitureIds = useStore((s) => s.selectedFurnitureIds);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const setSelectedRoomId = useStore((s) => s.setSelectedRoomId);
  const [open, setOpen] = useState(false);

  if (furnitureList.length === 0) return null;

  const grouped = rooms.map((room) => ({
    room,
    items: furnitureList.filter((f) => f.roomId === room.id),
  })).filter((g) => g.items.length > 0);

  return (
    <section style={{ marginBottom: 16 }}>
      <button
        style={{
          width: '100%', background: 'none', border: 'none',
          color: '#aaa', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 0',
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{
          display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0)',
          transition: 'transform 0.15s', fontSize: 10,
        }}>
          ▶
        </span>
        배치된 가구 ({furnitureList.length})
      </button>
      {open && (
        <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: 4 }}>
          {grouped.map(({ room, items }) => (
            <div key={room.id} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 3, paddingLeft: 4 }}>
                {room.name}
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRoomId(item.roomId);
                    setSelectedFurnitureId(item.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 8px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    background: selectedFurnitureIds.includes(item.id) ? '#333' : 'transparent',
                    color: selectedFurnitureIds.includes(item.id) ? '#fff' : '#bbb',
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                  {item.locked && (
                    <span style={{ fontSize: 10, color: '#888' }}>고정</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

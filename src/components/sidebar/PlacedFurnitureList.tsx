import { useStore } from '../../store/useStore';

export default function PlacedFurnitureList() {
  const rooms = useStore((s) => s.rooms);
  const furnitureList = useStore((s) => s.furnitureList);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const setSelectedRoomId = useStore((s) => s.setSelectedRoomId);

  if (furnitureList.length === 0) return null;

  const grouped = rooms.map((room) => ({
    room,
    items: furnitureList.filter((f) => f.roomId === room.id),
  })).filter((g) => g.items.length > 0);

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 8, color: '#aaa' }}>
        배치된 가구 ({furnitureList.length})
      </h3>
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {grouped.map(({ room, items }) => (
          <div key={room.id} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#666', marginBottom: 4, paddingLeft: 4 }}>
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
                  background: selectedFurnitureId === item.id ? '#333' : 'transparent',
                  color: selectedFurnitureId === item.id ? '#fff' : '#bbb',
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
    </section>
  );
}

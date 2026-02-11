import { useStore } from '../../store/useStore';

export default function RoomConfigurator() {
  const room = useStore((s) => s.room);
  const setRoom = useStore((s) => s.setRoom);

  const fields = [
    { label: '가로 (m)', key: 'width' as const, min: 2, max: 15 },
    { label: '세로 (m)', key: 'depth' as const, min: 2, max: 15 },
    { label: '높이 (m)', key: 'height' as const, min: 2, max: 4, step: 0.1 },
  ];

  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>방 크기</h3>
      {fields.map(({ label, key, min, max, step }) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>{label}</span>
            <span>{room[key].toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={min}
            max={max}
            step={step ?? 0.5}
            value={room[key]}
            onChange={(e) => setRoom({ [key]: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>
      ))}
    </section>
  );
}

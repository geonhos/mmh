import { Html } from '@react-three/drei';

interface DimensionLabelProps {
  position: [number, number, number];
  text: string;
}

export default function DimensionLabel({ position, text }: DimensionLabelProps) {
  return (
    <Html position={position} center distanceFactor={8}
      style={{ pointerEvents: 'none' }}>
      <div style={{
        background: 'rgba(26, 26, 46, 0.85)',
        color: '#e0e0e0',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
        border: '1px solid #646cff',
      }}>
        {text}
      </div>
    </Html>
  );
}

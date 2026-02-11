interface SofaShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function SofaShape({ width, depth, height, color }: SofaShapeProps) {
  const baseH = height * 0.45;
  const backH = height * 0.55;
  const backThick = 0.15;
  const armW = 0.12;
  const armH = height * 0.6;

  return (
    <group>
      {/* Seat base */}
      <mesh position={[0, baseH / 2, 0]} castShadow>
        <boxGeometry args={[width - armW * 2, baseH, depth - backThick]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, baseH + backH / 2, -(depth / 2 - backThick / 2)]} castShadow>
        <boxGeometry args={[width, backH, backThick]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Left armrest */}
      <mesh position={[-(width / 2 - armW / 2), armH / 2, 0]} castShadow>
        <boxGeometry args={[armW, armH, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Right armrest */}
      <mesh position={[(width / 2 - armW / 2), armH / 2, 0]} castShadow>
        <boxGeometry args={[armW, armH, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

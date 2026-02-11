interface ShelfShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function ShelfShape({ width, depth, height, color }: ShelfShapeProps) {
  const panelThick = 0.03;
  const shelfCount = 4;

  return (
    <group>
      {/* Left panel */}
      <mesh position={[-(width / 2 - panelThick / 2), height / 2, 0]} castShadow>
        <boxGeometry args={[panelThick, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Right panel */}
      <mesh position={[(width / 2 - panelThick / 2), height / 2, 0]} castShadow>
        <boxGeometry args={[panelThick, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => {
        const y = (height / (shelfCount - 1)) * i;
        return (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[width, panelThick, depth]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}

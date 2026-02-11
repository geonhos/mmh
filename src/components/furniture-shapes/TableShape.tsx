interface TableShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function TableShape({ width, depth, height, color }: TableShapeProps) {
  const topH = 0.04;
  const legW = 0.05;
  const legH = height - topH;

  const legPositions: [number, number, number][] = [
    [-(width / 2 - legW), legH / 2, -(depth / 2 - legW)],
    [(width / 2 - legW), legH / 2, -(depth / 2 - legW)],
    [-(width / 2 - legW), legH / 2, (depth / 2 - legW)],
    [(width / 2 - legW), legH / 2, (depth / 2 - legW)],
  ];

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, height - topH / 2, 0]} castShadow>
        <boxGeometry args={[width, topH, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[legW, legH, legW]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

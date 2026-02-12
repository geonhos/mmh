import type { MaterialType } from '../../types';
import { getMaterialProps } from '../../utils/materials';

interface ChairShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default function ChairShape({ width, depth, height, color, materialType = 'wood' }: ChairShapeProps) {
  const seatH = 0.04;
  const seatY = height * 0.53;
  const legW = 0.04;
  const legH = seatY - seatH / 2;
  const backH = height - seatY;
  const backThick = 0.04;
  const matProps = getMaterialProps(materialType, color);

  const legPositions: [number, number, number][] = [
    [-(width / 2 - legW), legH / 2, -(depth / 2 - legW)],
    [(width / 2 - legW), legH / 2, -(depth / 2 - legW)],
    [-(width / 2 - legW), legH / 2, (depth / 2 - legW)],
    [(width / 2 - legW), legH / 2, (depth / 2 - legW)],
  ];

  return (
    <group>
      {/* Seat */}
      <mesh position={[0, seatY, 0]} castShadow>
        <boxGeometry args={[width, seatH, depth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, seatY + backH / 2, -(depth / 2 - backThick / 2)]} castShadow>
        <boxGeometry args={[width, backH, backThick]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[legW, legH, legW]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
      ))}
    </group>
  );
}

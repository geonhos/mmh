import { memo } from 'react';
import type { MaterialType } from '../../types';
import { getBoxGeometry, getPooledMaterial } from '../../utils/geometryPool';

interface ChairShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default memo(function ChairShape({ width, depth, height, color, materialType = 'wood' }: ChairShapeProps) {
  const seatH = 0.04;
  const seatY = height * 0.53;
  const legW = 0.04;
  const legH = seatY - seatH / 2;
  const backH = height - seatY;
  const backThick = 0.04;
  const mat = getPooledMaterial(materialType, color);
  const legGeo = getBoxGeometry(legW, legH, legW);

  const legPositions: [number, number, number][] = [
    [-(width / 2 - legW), legH / 2, -(depth / 2 - legW)],
    [(width / 2 - legW), legH / 2, -(depth / 2 - legW)],
    [-(width / 2 - legW), legH / 2, (depth / 2 - legW)],
    [(width / 2 - legW), legH / 2, (depth / 2 - legW)],
  ];

  return (
    <group>
      {/* Seat */}
      <mesh
        position={[0, seatY, 0]}
        castShadow
        geometry={getBoxGeometry(width, seatH, depth)}
        material={mat}
      />
      {/* Backrest */}
      <mesh
        position={[0, seatY + backH / 2, -(depth / 2 - backThick / 2)]}
        castShadow
        geometry={getBoxGeometry(width, backH, backThick)}
        material={mat}
      />
      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow geometry={legGeo} material={mat} />
      ))}
    </group>
  );
});

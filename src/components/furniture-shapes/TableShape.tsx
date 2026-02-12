import { memo } from 'react';
import type { MaterialType } from '../../types';
import { getBoxGeometry, getPooledMaterial } from '../../utils/geometryPool';

interface TableShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default memo(function TableShape({ width, depth, height, color, materialType = 'wood' }: TableShapeProps) {
  const topH = 0.04;
  const legW = 0.05;
  const legH = height - topH;
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
      {/* Table top */}
      <mesh
        position={[0, height - topH / 2, 0]}
        castShadow
        geometry={getBoxGeometry(width, topH, depth)}
        material={mat}
      />
      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow geometry={legGeo} material={mat} />
      ))}
    </group>
  );
});

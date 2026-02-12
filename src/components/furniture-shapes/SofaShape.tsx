import { memo } from 'react';
import type { MaterialType } from '../../types';
import { getBoxGeometry, getPooledMaterial } from '../../utils/geometryPool';

interface SofaShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default memo(function SofaShape({ width, depth, height, color, materialType = 'fabric' }: SofaShapeProps) {
  const baseH = height * 0.45;
  const backH = height * 0.55;
  const backThick = 0.15;
  const armW = 0.12;
  const armH = height * 0.6;
  const mat = getPooledMaterial(materialType, color);

  return (
    <group>
      {/* Seat base */}
      <mesh
        position={[0, baseH / 2, 0]}
        castShadow
        geometry={getBoxGeometry(width - armW * 2, baseH, depth - backThick)}
        material={mat}
      />
      {/* Backrest */}
      <mesh
        position={[0, baseH + backH / 2, -(depth / 2 - backThick / 2)]}
        castShadow
        geometry={getBoxGeometry(width, backH, backThick)}
        material={mat}
      />
      {/* Left armrest */}
      <mesh
        position={[-(width / 2 - armW / 2), armH / 2, 0]}
        castShadow
        geometry={getBoxGeometry(armW, armH, depth)}
        material={mat}
      />
      {/* Right armrest */}
      <mesh
        position={[(width / 2 - armW / 2), armH / 2, 0]}
        castShadow
        geometry={getBoxGeometry(armW, armH, depth)}
        material={mat}
      />
    </group>
  );
});

import { memo } from 'react';
import type { MaterialType } from '../../types';
import { getBoxGeometry, getPooledMaterial } from '../../utils/geometryPool';

interface ShelfShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default memo(function ShelfShape({ width, depth, height, color, materialType = 'wood' }: ShelfShapeProps) {
  const panelThick = 0.03;
  const shelfCount = 4;
  const mat = getPooledMaterial(materialType, color);
  const panelGeo = getBoxGeometry(panelThick, height, depth);
  const shelfGeo = getBoxGeometry(width, panelThick, depth);

  return (
    <group>
      {/* Left panel */}
      <mesh position={[-(width / 2 - panelThick / 2), height / 2, 0]} castShadow geometry={panelGeo} material={mat} />
      {/* Right panel */}
      <mesh position={[(width / 2 - panelThick / 2), height / 2, 0]} castShadow geometry={panelGeo} material={mat} />
      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => {
        const y = (height / (shelfCount - 1)) * i;
        return (
          <mesh key={i} position={[0, y, 0]} castShadow geometry={shelfGeo} material={mat} />
        );
      })}
    </group>
  );
});

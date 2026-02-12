import { memo } from 'react';
import type { MaterialType } from '../../types';
import { getBoxGeometry, getPooledMaterial } from '../../utils/geometryPool';

interface BedShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default memo(function BedShape({ width, depth, height, color, materialType = 'wood' }: BedShapeProps) {
  const frameH = height * 0.4;
  const mattressH = height * 0.6;

  return (
    <group>
      {/* Frame */}
      <mesh
        position={[0, frameH / 2, 0]}
        castShadow
        geometry={getBoxGeometry(width, frameH, depth)}
        material={getPooledMaterial(materialType, color)}
      />
      {/* Mattress */}
      <mesh
        position={[0, frameH + mattressH / 2, 0]}
        castShadow
        geometry={getBoxGeometry(width * 0.95, mattressH, depth * 0.95)}
        material={getPooledMaterial('fabric', '#e8e0d8')}
      />
    </group>
  );
});

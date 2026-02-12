import { memo } from 'react';
import type { MaterialType } from '../../types';
import { getBoxGeometry, getPooledMaterial } from '../../utils/geometryPool';

interface GenericBoxShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default memo(function GenericBoxShape({ width, depth, height, color, materialType = 'wood' }: GenericBoxShapeProps) {
  return (
    <mesh
      position={[0, height / 2, 0]}
      castShadow
      geometry={getBoxGeometry(width, height, depth)}
      material={getPooledMaterial(materialType, color)}
    />
  );
});

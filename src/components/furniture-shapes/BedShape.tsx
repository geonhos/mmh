import type { MaterialType } from '../../types';
import { getMaterialProps } from '../../utils/materials';

interface BedShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default function BedShape({ width, depth, height, color, materialType = 'wood' }: BedShapeProps) {
  const frameH = height * 0.4;
  const mattressH = height * 0.6;
  const matProps = getMaterialProps(materialType, color);
  const mattressProps = getMaterialProps('fabric', '#e8e0d8');

  return (
    <group>
      {/* Frame */}
      <mesh position={[0, frameH / 2, 0]} castShadow>
        <boxGeometry args={[width, frameH, depth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, frameH + mattressH / 2, 0]} castShadow>
        <boxGeometry args={[width * 0.95, mattressH, depth * 0.95]} />
        <meshPhysicalMaterial {...mattressProps} />
      </mesh>
    </group>
  );
}

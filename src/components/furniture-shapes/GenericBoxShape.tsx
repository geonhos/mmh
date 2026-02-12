import type { MaterialType } from '../../types';
import { getMaterialProps } from '../../utils/materials';

interface GenericBoxShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default function GenericBoxShape({ width, depth, height, color, materialType = 'wood' }: GenericBoxShapeProps) {
  const matProps = getMaterialProps(materialType, color);
  return (
    <mesh position={[0, height / 2, 0]} castShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshPhysicalMaterial {...matProps} />
    </mesh>
  );
}

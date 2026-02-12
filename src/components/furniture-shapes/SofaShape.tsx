import type { MaterialType } from '../../types';
import { getMaterialProps } from '../../utils/materials';

interface SofaShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default function SofaShape({ width, depth, height, color, materialType = 'fabric' }: SofaShapeProps) {
  const baseH = height * 0.45;
  const backH = height * 0.55;
  const backThick = 0.15;
  const armW = 0.12;
  const armH = height * 0.6;
  const matProps = getMaterialProps(materialType, color);

  return (
    <group>
      {/* Seat base */}
      <mesh position={[0, baseH / 2, 0]} castShadow>
        <boxGeometry args={[width - armW * 2, baseH, depth - backThick]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, baseH + backH / 2, -(depth / 2 - backThick / 2)]} castShadow>
        <boxGeometry args={[width, backH, backThick]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Left armrest */}
      <mesh position={[-(width / 2 - armW / 2), armH / 2, 0]} castShadow>
        <boxGeometry args={[armW, armH, depth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Right armrest */}
      <mesh position={[(width / 2 - armW / 2), armH / 2, 0]} castShadow>
        <boxGeometry args={[armW, armH, depth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    </group>
  );
}

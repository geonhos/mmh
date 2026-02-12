import type { MaterialType } from '../../types';
import { getMaterialProps } from '../../utils/materials';

interface ShelfShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
  materialType?: MaterialType;
}

export default function ShelfShape({ width, depth, height, color, materialType = 'wood' }: ShelfShapeProps) {
  const panelThick = 0.03;
  const shelfCount = 4;
  const matProps = getMaterialProps(materialType, color);

  return (
    <group>
      {/* Left panel */}
      <mesh position={[-(width / 2 - panelThick / 2), height / 2, 0]} castShadow>
        <boxGeometry args={[panelThick, height, depth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Right panel */}
      <mesh position={[(width / 2 - panelThick / 2), height / 2, 0]} castShadow>
        <boxGeometry args={[panelThick, height, depth]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => {
        const y = (height / (shelfCount - 1)) * i;
        return (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[width, panelThick, depth]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        );
      })}
    </group>
  );
}

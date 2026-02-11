import { useRef } from 'react';
import type { Group } from 'three';
import type { FurnitureInstance } from '../../types';
import { useStore } from '../../store/useStore';
import FurnitureGeometry from './FurnitureGeometry';

interface FurnitureItemProps {
  item: FurnitureInstance;
}

export default function FurnitureItem({ item }: FurnitureItemProps) {
  const groupRef = useRef<Group>(null);
  const selectedId = useStore((s) => s.selectedId);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const isSelected = selectedId === item.id;

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(item.id);
      }}
    >
      <FurnitureGeometry
        catalogId={item.catalogId}
        width={item.dimensions.width}
        depth={item.dimensions.depth}
        height={item.dimensions.height}
        color={item.color}
      />
      {isSelected && (
        <mesh position={[0, item.dimensions.height / 2, 0]}>
          <boxGeometry
            args={[
              item.dimensions.width + 0.05,
              item.dimensions.height + 0.05,
              item.dimensions.depth + 0.05,
            ]}
          />
          <meshBasicMaterial color="#646cff" wireframe />
        </mesh>
      )}
    </group>
  );
}

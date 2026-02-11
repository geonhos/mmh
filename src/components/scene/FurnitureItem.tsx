import { useRef } from 'react';
import type { Group } from 'three';
import { TransformControls } from '@react-three/drei';
import type { FurnitureInstance } from '../../types';
import { useStore } from '../../store/useStore';
import FurnitureGeometry from './FurnitureGeometry';

interface FurnitureItemProps {
  item: FurnitureInstance;
  mode: 'translate' | 'rotate';
}

export default function FurnitureItem({ item, mode }: FurnitureItemProps) {
  const groupRef = useRef<Group>(null);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const isSelected = selectedFurnitureId === item.id;

  const handleChange = () => {
    const obj = groupRef.current;
    if (!obj) return;
    updateFurniture(item.id, {
      position: [obj.position.x, obj.position.y, obj.position.z],
      rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
    });
  };

  return (
    <>
      <group
        ref={groupRef}
        position={item.position}
        rotation={item.rotation}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedFurnitureId(item.id);
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
      {isSelected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={mode}
          onMouseUp={handleChange}
        />
      )}
    </>
  );
}

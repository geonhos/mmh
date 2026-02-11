import { useRef } from 'react';
import type { Group } from 'three';
import { TransformControls } from '@react-three/drei';
import type { FurnitureInstance } from '../../types';
import { useStore } from '../../store/useStore';
import { GRID_SNAP_SIZE } from '../../utils/constants';
import FurnitureGeometry from './FurnitureGeometry';

const snap = (v: number, grid: number) => Math.round(v / grid) * grid;

interface FurnitureItemProps {
  item: FurnitureInstance;
  mode: 'translate' | 'rotate';
}

export default function FurnitureItem({ item, mode }: FurnitureItemProps) {
  const groupRef = useRef<Group>(null);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const snapEnabled = useStore((s) => s.snapEnabled);
  const rooms = useStore((s) => s.rooms);
  const isSelected = selectedFurnitureId === item.id;

  const handleChange = () => {
    const obj = groupRef.current;
    if (!obj) return;

    let x = obj.position.x;
    let y = obj.position.y;
    let z = obj.position.z;

    // Grid snap
    if (snapEnabled) {
      x = snap(x, GRID_SNAP_SIZE);
      z = snap(z, GRID_SNAP_SIZE);
    }

    // Room boundary clamping
    const room = rooms.find((r) => r.id === item.roomId);
    if (room) {
      const hw = room.dimensions.width / 2 - item.dimensions.width / 2;
      const hd = room.dimensions.depth / 2 - item.dimensions.depth / 2;
      x = Math.max(-hw, Math.min(hw, x));
      z = Math.max(-hd, Math.min(hd, z));
    }

    // Apply snapped/clamped position back to the object
    obj.position.set(x, y, z);

    updateFurniture(item.id, {
      position: [x, y, z],
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

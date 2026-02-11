import { useMemo } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';
import type { RoomInstance } from '../../types';
import { useStore } from '../../store/useStore';
import { COLORS, GRID_SNAP_SIZE } from '../../utils/constants';

function FloorGrid({ width, depth }: { width: number; depth: number }) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const hw = width / 2;
    const hd = depth / 2;
    const spacing = GRID_SNAP_SIZE;

    // Lines along X (varying Z)
    for (let z = -hd; z <= hd + 0.001; z += spacing) {
      points.push(-hw, 0, z, hw, 0, z);
    }
    // Lines along Z (varying X)
    for (let x = -hw; x <= hw + 0.001; x += spacing) {
      points.push(x, 0, -hd, x, 0, hd);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [width, depth]);

  return (
    <lineSegments geometry={geometry} position={[0, 0.003, 0]}>
      <lineBasicMaterial color="#888" transparent opacity={0.25} />
    </lineSegments>
  );
}

interface RoomProps {
  room: RoomInstance;
  isSelected: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

export default function Room({ room, isSelected, onSelect, children }: RoomProps) {
  const { width, depth, height } = room.dimensions;
  const wallThickness = 0.08;
  const snapEnabled = useStore((s) => s.snapEnabled);

  return (
    <group position={[room.position[0], 0, room.position[1]]}>
      {/* Floor */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={COLORS.floor} />
      </mesh>

      {/* Floor grid (visible when snap is on) */}
      {snapEnabled && <FloorGrid width={width} depth={depth} />}

      {/* Selection outline on floor */}
      {isSelected && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
          <planeGeometry args={[width + 0.1, depth + 0.1]} />
          <meshBasicMaterial color="#646cff" wireframe />
        </mesh>
      )}

      {/* Back wall (z = -depth/2) */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial
          color={COLORS.wall}
          transparent
          opacity={COLORS.wallOpacity}
        />
      </mesh>

      {/* Front wall (z = depth/2) */}
      <mesh position={[0, height / 2, depth / 2]}>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial
          color={COLORS.wall}
          transparent
          opacity={COLORS.wallOpacity}
        />
      </mesh>

      {/* Left wall (x = -width/2) */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial
          color={COLORS.wall}
          transparent
          opacity={COLORS.wallOpacity}
        />
      </mesh>

      {/* Right wall (x = width/2) */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial
          color={COLORS.wall}
          transparent
          opacity={COLORS.wallOpacity}
        />
      </mesh>

      {children}
    </group>
  );
}

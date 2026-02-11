import type { ReactNode } from 'react';
import type { RoomInstance } from '../../types';
import { COLORS } from '../../utils/constants';

interface RoomProps {
  room: RoomInstance;
  isSelected: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

export default function Room({ room, isSelected, onSelect, children }: RoomProps) {
  const { width, depth, height } = room.dimensions;
  const wallThickness = 0.08;

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

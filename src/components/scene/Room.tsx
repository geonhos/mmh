import { useStore } from '../../store/useStore';
import { COLORS } from '../../utils/constants';

export default function Room() {
  const { width, depth, height } = useStore((s) => s.room);
  const wallThickness = 0.08;

  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={COLORS.floor} />
      </mesh>

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
    </group>
  );
}

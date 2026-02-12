interface DoorShapeProps {
  width: number;
  height: number;
}

export default function DoorShape({ width, height }: DoorShapeProps) {
  const frameThickness = 0.04;
  const frameDepth = 0.12;

  return (
    <group>
      {/* Left frame */}
      <mesh position={[-width / 2 + frameThickness / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshPhysicalMaterial color="#8B6914" roughness={0.6} />
      </mesh>
      {/* Right frame */}
      <mesh position={[width / 2 - frameThickness / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshPhysicalMaterial color="#8B6914" roughness={0.6} />
      </mesh>
      {/* Top frame */}
      <mesh position={[0, height - frameThickness / 2, 0]}>
        <boxGeometry args={[width, frameThickness, frameDepth]} />
        <meshPhysicalMaterial color="#8B6914" roughness={0.6} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width - frameThickness * 2, height - frameThickness, 0.04]} />
        <meshPhysicalMaterial color="#A0784C" roughness={0.5} />
      </mesh>
    </group>
  );
}

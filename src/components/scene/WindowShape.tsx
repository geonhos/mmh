interface WindowShapeProps {
  width: number;
  height: number;
}

export default function WindowShape({ width, height }: WindowShapeProps) {
  const frameThickness = 0.03;
  const frameDepth = 0.1;

  return (
    <group>
      {/* Frame - left */}
      <mesh position={[-width / 2 + frameThickness / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshPhysicalMaterial color="#cccccc" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Frame - right */}
      <mesh position={[width / 2 - frameThickness / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshPhysicalMaterial color="#cccccc" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Frame - top */}
      <mesh position={[0, height - frameThickness / 2, 0]}>
        <boxGeometry args={[width, frameThickness, frameDepth]} />
        <meshPhysicalMaterial color="#cccccc" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Frame - bottom */}
      <mesh position={[0, frameThickness / 2, 0]}>
        <boxGeometry args={[width, frameThickness, frameDepth]} />
        <meshPhysicalMaterial color="#cccccc" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Center divider */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshPhysicalMaterial color="#cccccc" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Glass panes */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width - frameThickness * 2, height - frameThickness * 2, 0.01]} />
        <meshPhysicalMaterial
          color="#88ccff"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

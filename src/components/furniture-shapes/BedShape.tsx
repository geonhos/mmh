interface BedShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function BedShape({ width, depth, height, color }: BedShapeProps) {
  const frameH = height * 0.4;
  const mattressH = height * 0.6;

  return (
    <group>
      {/* Frame */}
      <mesh position={[0, frameH / 2, 0]} castShadow>
        <boxGeometry args={[width, frameH, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, frameH + mattressH / 2, 0]} castShadow>
        <boxGeometry args={[width * 0.95, mattressH, depth * 0.95]} />
        <meshStandardMaterial color="#e8e0d8" />
      </mesh>
    </group>
  );
}

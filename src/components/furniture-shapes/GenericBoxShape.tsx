interface GenericBoxShapeProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function GenericBoxShape({ width, depth, height, color }: GenericBoxShapeProps) {
  return (
    <mesh position={[0, height / 2, 0]} castShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

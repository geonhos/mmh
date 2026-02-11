export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}

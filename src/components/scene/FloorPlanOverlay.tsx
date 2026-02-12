import { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

export default function FloorPlanOverlay() {
  const floorPlan = useStore((s) => s.floorPlan);

  const texture = useMemo(() => {
    if (!floorPlan) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(floorPlan.dataUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [floorPlan?.dataUrl]);

  if (!floorPlan || !texture) return null;

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[floorPlan.position[0], -0.01, floorPlan.position[1]]}
    >
      <planeGeometry args={[floorPlan.width, floorPlan.height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={floorPlan.opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

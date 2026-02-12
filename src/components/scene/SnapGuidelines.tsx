import { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

export default function SnapGuidelines() {
  const guidelines = useStore((s) => s.activeGuidelines);

  const geometries = useMemo(() => {
    return guidelines.map((guide) => {
      const points = guide.axis === 'x'
        ? [guide.position, 0.02, guide.start, guide.position, 0.02, guide.end]
        : [guide.start, 0.02, guide.position, guide.end, 0.02, guide.position];
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      return geo;
    });
  }, [guidelines]);

  if (guidelines.length === 0) return null;

  return (
    <group>
      {geometries.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial color="#646cff" />
        </lineSegments>
      ))}
    </group>
  );
}

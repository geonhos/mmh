import { useMemo } from 'react';
import * as THREE from 'three';
import DimensionLabel from './DimensionLabel';

interface DoorShapeProps {
  width: number;
  height: number;
  /** -1 = swing toward -Z (south/east walls), +1 = toward +Z (north/west walls) */
  swingSign?: number;
}

export default function DoorShape({ width, height, swingSign = -1 }: DoorShapeProps) {
  const frameThickness = 0.04;
  const frameDepth = 0.12;
  const panelWidth = width - frameThickness * 2;
  const hingeX = -width / 2 + frameThickness;

  // Arc points on floor plane (XZ)
  const arcPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * (Math.PI / 2);
      pts.push([
        panelWidth * Math.cos(t),
        0,
        panelWidth * Math.sin(t) * swingSign,
      ]);
    }
    return pts;
  }, [panelWidth, swingSign]);

  // CircleGeometry thetaLength: positive sweeps toward -Z, negative toward +Z (after rotation)
  const thetaLength = -swingSign * (Math.PI / 2);

  // Dimension label position (at 45° on the arc, slightly inside)
  const labelRadius = panelWidth * 0.6;
  const cos45 = Math.cos(Math.PI / 4);
  const sin45 = Math.sin(Math.PI / 4);

  // Arc outline as THREE.Line object
  const arcLine = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = arcPoints.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    geo.setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#646cff', transparent: true, opacity: 0.5 }));
  }, [arcPoints]);

  // Dashed open-position line
  const openLine = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, panelWidth * swingSign),
    ]);
    const mat = new THREE.LineDashedMaterial({ color: '#646cff', transparent: true, opacity: 0.35, dashSize: 0.06, gapSize: 0.04 });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }, [panelWidth, swingSign]);

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
        <boxGeometry args={[panelWidth, height - frameThickness, 0.04]} />
        <meshPhysicalMaterial color="#A0784C" roughness={0.5} />
      </mesh>

      {/* Swing arc visualization */}
      <group position={[hingeX, 0.01, 0]}>
        {/* Filled sector */}
        <mesh rotation-x={-Math.PI / 2}>
          <circleGeometry args={[panelWidth, 32, 0, thetaLength]} />
          <meshBasicMaterial
            color="#646cff"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Arc outline */}
        <primitive object={arcLine} />

        {/* Open position dashed line */}
        <primitive object={openLine} />

        {/* Dimension label */}
        <DimensionLabel
          position={[labelRadius * cos45, 0, labelRadius * sin45 * swingSign]}
          text={`${width.toFixed(1)}m`}
        />
      </group>
    </group>
  );
}

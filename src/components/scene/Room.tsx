import { useRef, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Group } from 'three';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import type { RoomInstance } from '../../types';
import { useStore } from '../../store/useStore';
import { COLORS, GRID_SNAP_SIZE, ROOM_SNAP_THRESHOLD } from '../../utils/constants';

const _floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _intersection = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _ndc = new THREE.Vector2();

function FloorGrid({ width, depth }: { width: number; depth: number }) {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const hw = width / 2;
    const hd = depth / 2;
    const spacing = GRID_SNAP_SIZE;

    // Lines along X (varying Z)
    for (let z = -hd; z <= hd + 0.001; z += spacing) {
      points.push(-hw, 0, z, hw, 0, z);
    }
    // Lines along Z (varying X)
    for (let x = -hw; x <= hw + 0.001; x += spacing) {
      points.push(x, 0, -hd, x, 0, hd);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [width, depth]);

  return (
    <lineSegments geometry={geometry} position={[0, 0.003, 0]}>
      <lineBasicMaterial color="#888" transparent opacity={0.25} />
    </lineSegments>
  );
}

interface RoomProps {
  room: RoomInstance;
  isSelected: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

export default function Room({ room, isSelected, onSelect, children }: RoomProps) {
  const { width, depth, height } = room.dimensions;
  const wallThickness = 0.08;
  const snapEnabled = useStore((s) => s.snapEnabled);
  const updateRoom = useStore((s) => s.updateRoom);
  const groupRef = useRef<Group>(null);
  const draggingRef = useRef(false);
  const { camera, gl, controls } = useThree();

  const handleFloorPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      // First click selects; drag only on already-selected room
      if (!isSelected) {
        onSelect();
        return;
      }

      // Prevent dragging when locked
      if (room.locked) return;

      draggingRef.current = true;
      if (controls) (controls as THREE.EventDispatcher & { enabled: boolean }).enabled = false;

      const onMove = (ev: PointerEvent) => {
        if (!draggingRef.current || !groupRef.current) return;
        const rect = gl.domElement.getBoundingClientRect();
        _ndc.set(
          ((ev.clientX - rect.left) / rect.width) * 2 - 1,
          -((ev.clientY - rect.top) / rect.height) * 2 + 1,
        );
        _raycaster.setFromCamera(_ndc, camera);
        if (_raycaster.ray.intersectPlane(_floorPlane, _intersection)) {
          groupRef.current.position.set(_intersection.x, 0, _intersection.z);
        }
      };

      const onUp = () => {
        if (!groupRef.current) return;
        draggingRef.current = false;
        let x = groupRef.current.position.x;
        let z = groupRef.current.position.z;

        // Grid snap
        if (snapEnabled) {
          x = Math.round(x / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;
          z = Math.round(z / GRID_SNAP_SIZE) * GRID_SNAP_SIZE;
        }

        // Room-to-room magnetic snap
        if (snapEnabled) {
          const allRooms = useStore.getState().rooms;
          const myHW = width / 2;
          const myHD = depth / 2;
          let bestSnapX: number | null = null;
          let bestDistX = ROOM_SNAP_THRESHOLD;
          let bestSnapZ: number | null = null;
          let bestDistZ = ROOM_SNAP_THRESHOLD;

          for (const other of allRooms) {
            if (other.id === room.id) continue;
            const oX = other.position[0];
            const oZ = other.position[1];
            const oHW = other.dimensions.width / 2;
            const oHD = other.dimensions.depth / 2;

            // My right edge → other left edge
            const dRightLeft = Math.abs((x + myHW) - (oX - oHW));
            if (dRightLeft < bestDistX) { bestDistX = dRightLeft; bestSnapX = oX - oHW - myHW; }
            // My left edge → other right edge
            const dLeftRight = Math.abs((x - myHW) - (oX + oHW));
            if (dLeftRight < bestDistX) { bestDistX = dLeftRight; bestSnapX = oX + oHW + myHW; }

            // My front edge → other back edge
            const dFrontBack = Math.abs((z + myHD) - (oZ - oHD));
            if (dFrontBack < bestDistZ) { bestDistZ = dFrontBack; bestSnapZ = oZ - oHD - myHD; }
            // My back edge → other front edge
            const dBackFront = Math.abs((z - myHD) - (oZ + oHD));
            if (dBackFront < bestDistZ) { bestDistZ = dBackFront; bestSnapZ = oZ + oHD + myHD; }
          }

          if (bestSnapX !== null) x = bestSnapX;
          if (bestSnapZ !== null) z = bestSnapZ;
        }

        groupRef.current.position.set(x, 0, z);
        updateRoom(room.id, { position: [x, z] });
        if (controls) (controls as THREE.EventDispatcher & { enabled: boolean }).enabled = true;
        gl.domElement.removeEventListener('pointermove', onMove);
        gl.domElement.removeEventListener('pointerup', onUp);
      };

      gl.domElement.addEventListener('pointermove', onMove);
      gl.domElement.addEventListener('pointerup', onUp);
    },
    [isSelected, onSelect, controls, gl, camera, updateRoom, room.id, snapEnabled, width, depth],
  );

  return (
    <group ref={groupRef} position={[room.position[0], 0, room.position[1]]}>
      {/* Floor */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0, 0]}
        receiveShadow
        onPointerDown={handleFloorPointerDown}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={COLORS.floor} />
      </mesh>

      {/* Floor grid (visible when snap is on) */}
      {snapEnabled && <FloorGrid width={width} depth={depth} />}

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

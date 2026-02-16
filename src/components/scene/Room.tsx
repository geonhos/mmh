import { useRef, useMemo, useCallback, memo } from 'react';
import type { ReactNode } from 'react';
import type { Group } from 'three';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import type { RoomInstance, WallElement, WallSide } from '../../types';
import { useStore } from '../../store/useStore';
import { COLORS, GRID_SNAP_SIZE, ROOM_SNAP_THRESHOLD } from '../../utils/constants';
import DimensionLabel from './DimensionLabel';
import DoorShape from './DoorShape';
import WindowShape from './WindowShape';

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

interface WallSegment {
  offset: number;
  segWidth: number;
  y: number;
  segHeight: number;
}

function computeWallSegments(
  wallLength: number,
  wallHeight: number,
  elements: WallElement[],
): WallSegment[] {
  if (elements.length === 0) {
    return [{ offset: 0, segWidth: wallLength, y: wallHeight / 2, segHeight: wallHeight }];
  }

  const sorted = [...elements].sort((a, b) => a.offset - b.offset);
  const segments: WallSegment[] = [];
  let cursor = -wallLength / 2;

  for (const el of sorted) {
    const elLeft = el.offset - el.width / 2;
    const elRight = el.offset + el.width / 2;
    const elTop = el.elevation + el.height;

    // Wall before this element (full height)
    if (elLeft > cursor + 0.001) {
      const w = elLeft - cursor;
      segments.push({ offset: cursor + w / 2, segWidth: w, y: wallHeight / 2, segHeight: wallHeight });
    }

    // Wall above element
    if (elTop < wallHeight - 0.001) {
      segments.push({ offset: el.offset, segWidth: el.width, y: (elTop + wallHeight) / 2, segHeight: wallHeight - elTop });
    }

    // Wall below element (for windows)
    if (el.elevation > 0.001) {
      segments.push({ offset: el.offset, segWidth: el.width, y: el.elevation / 2, segHeight: el.elevation });
    }

    cursor = elRight;
  }

  // Wall after last element
  const wallEnd = wallLength / 2;
  if (cursor < wallEnd - 0.001) {
    const w = wallEnd - cursor;
    segments.push({ offset: cursor + w / 2, segWidth: w, y: wallHeight / 2, segHeight: wallHeight });
  }

  return segments;
}

function getWallTransform(
  wall: WallSide,
  width: number,
  depth: number,
  offset: number,
  y: number,
): { position: [number, number, number] } {
  switch (wall) {
    case 'north': return { position: [offset, y, -depth / 2] };
    case 'south': return { position: [offset, y, depth / 2] };
    case 'west': return { position: [-width / 2, y, offset] };
    case 'east': return { position: [width / 2, y, offset] };
  }
}

function wallLength(wall: WallSide, width: number, depth: number): number {
  return wall === 'north' || wall === 'south' ? width : depth;
}

interface RoomProps {
  room: RoomInstance;
  isSelected: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

function RoomInner({ room, isSelected, onSelect, children }: RoomProps) {
  const { width, depth, height } = room.dimensions;
  const wallThickness = 0.08;
  const snapEnabled = useStore((s) => s.snapEnabled);
  const updateRoom = useStore((s) => s.updateRoom);
  const setContextMenu = useStore((s) => s.setContextMenu);
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
        onContextMenu={(e) => {
          e.stopPropagation();
          e.nativeEvent.preventDefault();
          setContextMenu({
            x: (e.nativeEvent as MouseEvent).clientX,
            y: (e.nativeEvent as MouseEvent).clientY,
            targetId: room.id,
            targetType: 'room',
          });
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={COLORS.floor} />
      </mesh>

      {/* Floor grid (visible when snap is on) */}
      {snapEnabled && <FloorGrid width={width} depth={depth} />}

      {/* Selection outline on floor + dimension labels */}
      {isSelected && (
        <>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
            <planeGeometry args={[width + 0.1, depth + 0.1]} />
            <meshBasicMaterial color="#646cff" wireframe />
          </mesh>
          <DimensionLabel
            position={[0, height + 0.3, 0]}
            text={`${width.toFixed(1)} × ${depth.toFixed(1)} × ${height.toFixed(1)}m`}
          />
          <DimensionLabel
            position={[0, 0.1, depth / 2 + 0.3]}
            text={`${width.toFixed(1)}m`}
          />
          <DimensionLabel
            position={[width / 2 + 0.3, 0.1, 0]}
            text={`${depth.toFixed(1)}m`}
          />
        </>
      )}

      {/* Walls with openings */}
      {(['north', 'south', 'east', 'west'] as const).map((side) => {
        const wLen = wallLength(side, width, depth);
        const elems = (room.wallElements ?? []).filter((el) => el.wall === side);
        const segments = computeWallSegments(wLen, height, elems);
        const isHorizontal = side === 'north' || side === 'south';

        return (
          <group key={side}>
            {segments.map((seg, i) => {
              const { position: pos } = getWallTransform(side, width, depth, seg.offset, seg.y);
              return (
                <mesh key={i} position={pos}>
                  <boxGeometry args={isHorizontal ? [seg.segWidth, seg.segHeight, wallThickness] : [wallThickness, seg.segHeight, seg.segWidth]} />
                  <meshStandardMaterial color={COLORS.wall} transparent opacity={COLORS.wallOpacity} />
                </mesh>
              );
            })}
            {elems.map((el) => {
              const { position: pos } = getWallTransform(side, width, depth, el.offset, el.elevation);
              return (
                <group key={el.id} position={pos} rotation-y={isHorizontal ? 0 : Math.PI / 2}>
                  {el.type === 'door' ? (
                    <DoorShape
                      width={el.width}
                      height={el.height}
                      swingSign={side === 'north' || side === 'west' ? 1 : -1}
                    />
                  ) : (
                    <WindowShape width={el.width} height={el.height} />
                  )}
                </group>
              );
            })}
          </group>
        );
      })}

      {children}
    </group>
  );
}

const Room = memo(RoomInner);
export default Room;

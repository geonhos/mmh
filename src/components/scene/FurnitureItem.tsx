import { useRef, useCallback } from 'react';
import type { Group } from 'three';
import * as THREE from 'three';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import type { FurnitureInstance } from '../../types';
import { useStore } from '../../store/useStore';
import { GRID_SNAP_SIZE, WALL_SNAP_THRESHOLD } from '../../utils/constants';
import FurnitureGeometry from './FurnitureGeometry';

const snap = (v: number, grid: number) => Math.round(v / grid) * grid;

// Reusable objects to avoid per-frame allocation
const _floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _intersection = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _ndc = new THREE.Vector2();

interface FurnitureItemProps {
  item: FurnitureInstance;
  mode: 'translate' | 'rotate';
}

export default function FurnitureItem({ item, mode }: FurnitureItemProps) {
  const groupRef = useRef<Group>(null);
  const draggingRef = useRef(false);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const snapEnabled = useStore((s) => s.snapEnabled);
  const rooms = useStore((s) => s.rooms);
  const isSelected = selectedFurnitureId === item.id;
  const { camera, gl, controls } = useThree();

  const room = rooms.find((r) => r.id === item.roomId);

  const raycastToFloor = useCallback(
    (clientX: number, clientY: number) => {
      if (!room) return null;
      const rect = gl.domElement.getBoundingClientRect();
      _ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      _raycaster.setFromCamera(_ndc, camera);
      if (!_raycaster.ray.intersectPlane(_floorPlane, _intersection)) return null;
      // World → room-local coordinates
      return {
        x: _intersection.x - room.position[0],
        z: _intersection.z - room.position[1],
      };
    },
    [camera, gl, room],
  );

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (mode !== 'translate' || !isSelected) return;
      e.stopPropagation();
      draggingRef.current = true;
      if (controls) (controls as THREE.EventDispatcher & { enabled: boolean }).enabled = false;

      const onMove = (ev: PointerEvent) => {
        if (!draggingRef.current || !groupRef.current) return;
        const pos = raycastToFloor(ev.clientX, ev.clientY);
        if (pos) groupRef.current.position.set(pos.x, 0, pos.z);
      };

      const onUp = () => {
        if (!groupRef.current) return;
        draggingRef.current = false;

        let x = groupRef.current.position.x;
        let z = groupRef.current.position.z;

        // Grid snap
        if (snapEnabled) {
          x = snap(x, GRID_SNAP_SIZE);
          z = snap(z, GRID_SNAP_SIZE);
        }

        // Wall magnetic snap
        if (snapEnabled && room) {
          const maxX = room.dimensions.width / 2 - item.dimensions.width / 2;
          const maxZ = room.dimensions.depth / 2 - item.dimensions.depth / 2;
          if (maxX - x > 0 && maxX - x < WALL_SNAP_THRESHOLD) x = maxX;
          else if (x + maxX > 0 && x + maxX < WALL_SNAP_THRESHOLD) x = -maxX;
          if (maxZ - z > 0 && maxZ - z < WALL_SNAP_THRESHOLD) z = maxZ;
          else if (z + maxZ > 0 && z + maxZ < WALL_SNAP_THRESHOLD) z = -maxZ;
        }

        // Room boundary clamping
        if (room) {
          const hw = room.dimensions.width / 2 - item.dimensions.width / 2;
          const hd = room.dimensions.depth / 2 - item.dimensions.depth / 2;
          x = Math.max(-hw, Math.min(hw, x));
          z = Math.max(-hd, Math.min(hd, z));
        }

        groupRef.current.position.set(x, 0, z);
        updateFurniture(item.id, { position: [x, 0, z] });
        if (controls) (controls as THREE.EventDispatcher & { enabled: boolean }).enabled = true;
        gl.domElement.removeEventListener('pointermove', onMove);
        gl.domElement.removeEventListener('pointerup', onUp);
      };

      gl.domElement.addEventListener('pointermove', onMove);
      gl.domElement.addEventListener('pointerup', onUp);
    },
    [mode, isSelected, controls, gl, raycastToFloor, snapEnabled, room, item, updateFurniture],
  );

  const handleRotateChange = () => {
    const obj = groupRef.current;
    if (!obj) return;
    updateFurniture(item.id, {
      rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
    });
  };

  return (
    <>
      <group
        ref={groupRef}
        position={item.position}
        rotation={item.rotation}
        onClick={(e) => {
          if (draggingRef.current) return;
          e.stopPropagation();
          setSelectedFurnitureId(item.id);
        }}
        onPointerDown={handlePointerDown}
      >
        <FurnitureGeometry
          catalogId={item.catalogId}
          width={item.dimensions.width}
          depth={item.dimensions.depth}
          height={item.dimensions.height}
          color={item.color}
        />
        {isSelected && (
          <mesh position={[0, item.dimensions.height / 2, 0]}>
            <boxGeometry
              args={[
                item.dimensions.width + 0.05,
                item.dimensions.height + 0.05,
                item.dimensions.depth + 0.05,
              ]}
            />
            <meshBasicMaterial color="#646cff" wireframe />
          </mesh>
        )}
      </group>
      {isSelected && mode === 'rotate' && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode="rotate"
          onMouseUp={handleRotateChange}
        />
      )}
    </>
  );
}

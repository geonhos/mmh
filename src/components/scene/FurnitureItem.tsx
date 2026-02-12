import { useRef, useCallback, useState } from 'react';
import type { Group } from 'three';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import type { FurnitureInstance } from '../../types';
import { useStore } from '../../store/useStore';
import { GRID_SNAP_SIZE, WALL_SNAP_THRESHOLD } from '../../utils/constants';
import { checkCollisions } from '../../utils/collision';
import FurnitureGeometry from './FurnitureGeometry';

const snap = (v: number, grid: number) => Math.round(v / grid) * grid;

// Reusable objects to avoid per-frame allocation
const _floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _intersection = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _ndc = new THREE.Vector2();

interface FurnitureItemProps {
  item: FurnitureInstance;
}

export default function FurnitureItem({ item }: FurnitureItemProps) {
  const groupRef = useRef<Group>(null);
  const draggingRef = useRef(false);
  const collidingRef = useRef(false);
  const [isColliding, setIsColliding] = useState(false);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const setContextMenu = useStore((s) => s.setContextMenu);
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
      return { worldX: _intersection.x, worldZ: _intersection.z };
    },
    [camera, gl, room],
  );

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isSelected || item.locked) return;
      e.stopPropagation();
      draggingRef.current = true;
      if (controls) (controls as THREE.EventDispatcher & { enabled: boolean }).enabled = false;

      const onMove = (ev: PointerEvent) => {
        if (!draggingRef.current || !groupRef.current || !room) return;
        const hit = raycastToFloor(ev.clientX, ev.clientY);
        if (hit) {
          const localX = hit.worldX - room.position[0];
          const localZ = hit.worldZ - room.position[1];
          groupRef.current.position.set(localX, 0, localZ);

          // Check collision
          const furnitureList = useStore.getState().furnitureList;
          const tempPos: [number, number, number] = [localX, 0, localZ];
          const collides = checkCollisions(item, furnitureList, tempPos);
          if (collides !== collidingRef.current) {
            collidingRef.current = collides;
            setIsColliding(collides);
          }
        }
      };

      const onUp = () => {
        if (!groupRef.current || !room) return;
        draggingRef.current = false;
        collidingRef.current = false;
        setIsColliding(false);

        // Convert to world coordinates
        const worldX = groupRef.current.position.x + room.position[0];
        const worldZ = groupRef.current.position.z + room.position[1];

        // Find target room
        const allRooms = useStore.getState().rooms;
        let targetRoom = room;
        for (const r of allRooms) {
          const hw = r.dimensions.width / 2;
          const hd = r.dimensions.depth / 2;
          const lx = worldX - r.position[0];
          const lz = worldZ - r.position[1];
          if (lx >= -hw && lx <= hw && lz >= -hd && lz <= hd) {
            targetRoom = r;
            break;
          }
        }

        // Convert to target room-local
        let x = worldX - targetRoom.position[0];
        let z = worldZ - targetRoom.position[1];

        // Grid snap
        if (snapEnabled) {
          x = snap(x, GRID_SNAP_SIZE);
          z = snap(z, GRID_SNAP_SIZE);
        }

        // Account for rotation
        const yRot = ((item.rotation[1] % Math.PI) + Math.PI) % Math.PI;
        const isRotated = Math.abs(yRot - Math.PI / 2) < 0.01;
        const fw = isRotated ? item.dimensions.depth : item.dimensions.width;
        const fd = isRotated ? item.dimensions.width : item.dimensions.depth;

        // Wall magnetic snap
        const maxX = targetRoom.dimensions.width / 2 - fw / 2;
        const maxZ = targetRoom.dimensions.depth / 2 - fd / 2;
        if (snapEnabled) {
          if (maxX - x > 0 && maxX - x < WALL_SNAP_THRESHOLD) x = maxX;
          else if (x + maxX > 0 && x + maxX < WALL_SNAP_THRESHOLD) x = -maxX;
          if (maxZ - z > 0 && maxZ - z < WALL_SNAP_THRESHOLD) z = maxZ;
          else if (z + maxZ > 0 && z + maxZ < WALL_SNAP_THRESHOLD) z = -maxZ;
        }

        // Room boundary clamping
        x = Math.max(-maxX, Math.min(maxX, x));
        z = Math.max(-maxZ, Math.min(maxZ, z));

        groupRef.current.position.set(x, 0, z);
        updateFurniture(item.id, { position: [x, 0, z], roomId: targetRoom.id });
        if (controls) (controls as THREE.EventDispatcher & { enabled: boolean }).enabled = true;
        gl.domElement.removeEventListener('pointermove', onMove);
        gl.domElement.removeEventListener('pointerup', onUp);
      };

      gl.domElement.addEventListener('pointermove', onMove);
      gl.domElement.addEventListener('pointerup', onUp);
    },
    [isSelected, controls, gl, raycastToFloor, snapEnabled, room, item, updateFurniture],
  );

  return (
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
      onContextMenu={(e) => {
        e.stopPropagation();
        e.nativeEvent.preventDefault();
        setSelectedFurnitureId(item.id);
        setContextMenu({
          x: (e.nativeEvent as MouseEvent).clientX,
          y: (e.nativeEvent as MouseEvent).clientY,
          targetId: item.id,
          targetType: 'furniture',
        });
      }}
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
      {isColliding && draggingRef.current && (
        <mesh position={[0, item.dimensions.height / 2, 0]}>
          <boxGeometry args={[item.dimensions.width + 0.02, item.dimensions.height + 0.02, item.dimensions.depth + 0.02]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

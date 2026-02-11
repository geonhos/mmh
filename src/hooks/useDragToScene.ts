import { useEffect, useRef } from 'react';
import { Raycaster, Vector2, Plane, Vector3 } from 'three';
import { getSceneRefs } from '../components/scene/SceneBridge';
import { furnitureCatalog } from '../store/furnitureCatalog';
import { useStore } from '../store/useStore';
import { generateId } from '../utils/ids';
import { GRID_SNAP_SIZE } from '../utils/constants';

const snap = (v: number, grid: number) => Math.round(v / grid) * grid;

const floorPlane = new Plane(new Vector3(0, 1, 0), 0);

function findTargetRoom(worldX: number, worldZ: number) {
  const rooms = useStore.getState().rooms;
  for (const room of rooms) {
    const rx = room.position[0];
    const rz = room.position[1];
    const hw = room.dimensions.width / 2;
    const hd = room.dimensions.depth / 2;
    if (worldX >= rx - hw && worldX <= rx + hw && worldZ >= rz - hd && worldZ <= rz + hd) {
      return room;
    }
  }
  return null;
}

export function useDragToScene(containerRef: React.RefObject<HTMLDivElement | null>) {
  const addFurniture = useStore((s) => s.addFurniture);
  const addRef = useRef(addFurniture);
  addRef.current = addFurniture;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const catalogId = e.dataTransfer?.getData('text/plain');
      if (!catalogId) return;

      const catalogItem = furnitureCatalog.find((c) => c.id === catalogId);
      if (!catalogItem) return;

      const { camera, gl } = getSceneRefs();
      if (!camera || !gl) return;

      const rect = gl.domElement.getBoundingClientRect();
      const ndc = new Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new Raycaster();
      raycaster.setFromCamera(ndc, camera);

      const intersect = new Vector3();
      const hit = raycaster.ray.intersectPlane(floorPlane, intersect);
      if (!hit) return;

      const targetRoom = findTargetRoom(intersect.x, intersect.z);
      if (!targetRoom) {
        // Fall back to selected room
        const state = useStore.getState();
        const fallback = state.rooms.find((r) => r.id === state.selectedRoomId);
        if (!fallback) return;

        let localX = intersect.x - fallback.position[0];
        let localZ = intersect.z - fallback.position[1];
        if (useStore.getState().snapEnabled) {
          localX = snap(localX, GRID_SNAP_SIZE);
          localZ = snap(localZ, GRID_SNAP_SIZE);
        }

        addRef.current({
          id: generateId(),
          catalogId: catalogItem.id,
          roomId: fallback.id,
          position: [localX, 0, localZ],
          rotation: [0, 0, 0],
          name: catalogItem.name,
          dimensions: { ...catalogItem.dimensions },
          color: catalogItem.color,
        });
        return;
      }

      // Convert world coords to room-local coords
      let localX = intersect.x - targetRoom.position[0];
      let localZ = intersect.z - targetRoom.position[1];
      if (useStore.getState().snapEnabled) {
        localX = snap(localX, GRID_SNAP_SIZE);
        localZ = snap(localZ, GRID_SNAP_SIZE);
      }

      addRef.current({
        id: generateId(),
        catalogId: catalogItem.id,
        roomId: targetRoom.id,
        position: [localX, 0, localZ],
        rotation: [0, 0, 0],
        name: catalogItem.name,
        dimensions: { ...catalogItem.dimensions },
        color: catalogItem.color,
      });
    };

    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('drop', handleDrop);
    return () => {
      el.removeEventListener('dragover', handleDragOver);
      el.removeEventListener('drop', handleDrop);
    };
  }, [containerRef]);
}

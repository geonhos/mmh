import { useEffect, useRef } from 'react';
import { Raycaster, Vector2, Plane, Vector3 } from 'three';
import { getSceneRefs } from '../components/scene/SceneBridge';
import { furnitureCatalog } from '../store/furnitureCatalog';
import { useStore } from '../store/useStore';
import { generateId } from '../utils/ids';

const floorPlane = new Plane(new Vector3(0, 1, 0), 0);

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

      addRef.current({
        id: generateId(),
        catalogId: catalogItem.id,
        position: [intersect.x, 0, intersect.z],
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

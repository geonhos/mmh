import type { FurnitureInstance } from '../types';
import { furnitureAABB } from './collision';

export interface SnapGuideline {
  axis: 'x' | 'z';
  position: number;
  start: number;
  end: number;
}

const GUIDE_THRESHOLD = 0.15;

export function computeSnapGuides(
  dragging: FurnitureInstance,
  tempPosition: [number, number, number],
  others: FurnitureInstance[],
  roomOffset: [number, number],
): { guidelines: SnapGuideline[]; snappedX: number | null; snappedZ: number | null } {
  const dragAABB = furnitureAABB({ ...dragging, position: tempPosition });
  const dragCenterX = tempPosition[0];
  const dragCenterZ = tempPosition[2];
  const guidelines: SnapGuideline[] = [];
  let snappedX: number | null = null;
  let snappedZ: number | null = null;
  let bestDistX = GUIDE_THRESHOLD;
  let bestDistZ = GUIDE_THRESHOLD;

  for (const other of others) {
    if (other.id === dragging.id || other.roomId !== dragging.roomId) continue;
    const otherAABB = furnitureAABB(other);
    const otherCenterX = other.position[0];
    const otherCenterZ = other.position[2];

    // Center-to-center X alignment
    const dxCenter = Math.abs(dragCenterX - otherCenterX);
    if (dxCenter < bestDistX) {
      bestDistX = dxCenter;
      snappedX = otherCenterX;
      guidelines.push({
        axis: 'x',
        position: otherCenterX + roomOffset[0],
        start: Math.min(dragCenterZ, otherCenterZ) + roomOffset[1],
        end: Math.max(dragCenterZ, otherCenterZ) + roomOffset[1],
      });
    }

    // Center-to-center Z alignment
    const dzCenter = Math.abs(dragCenterZ - otherCenterZ);
    if (dzCenter < bestDistZ) {
      bestDistZ = dzCenter;
      snappedZ = otherCenterZ;
      guidelines.push({
        axis: 'z',
        position: otherCenterZ + roomOffset[1],
        start: Math.min(dragCenterX, otherCenterX) + roomOffset[0],
        end: Math.max(dragCenterX, otherCenterX) + roomOffset[0],
      });
    }

    // Edge alignment X: left-left, right-right
    const edgesX = [
      { drag: dragAABB.minX, other: otherAABB.minX },
      { drag: dragAABB.maxX, other: otherAABB.maxX },
      { drag: dragAABB.minX, other: otherAABB.maxX },
      { drag: dragAABB.maxX, other: otherAABB.minX },
    ];
    for (const { drag, other } of edgesX) {
      const dist = Math.abs(drag - other);
      if (dist < bestDistX) {
        bestDistX = dist;
        snappedX = dragCenterX + (other - drag);
        guidelines.push({
          axis: 'x',
          position: other + roomOffset[0],
          start: Math.min(dragCenterZ, otherCenterZ) + roomOffset[1] - 0.5,
          end: Math.max(dragCenterZ, otherCenterZ) + roomOffset[1] + 0.5,
        });
      }
    }

    // Edge alignment Z: front-front, back-back
    const edgesZ = [
      { drag: dragAABB.minZ, other: otherAABB.minZ },
      { drag: dragAABB.maxZ, other: otherAABB.maxZ },
      { drag: dragAABB.minZ, other: otherAABB.maxZ },
      { drag: dragAABB.maxZ, other: otherAABB.minZ },
    ];
    for (const { drag, other } of edgesZ) {
      const dist = Math.abs(drag - other);
      if (dist < bestDistZ) {
        bestDistZ = dist;
        snappedZ = dragCenterZ + (other - drag);
        guidelines.push({
          axis: 'z',
          position: other + roomOffset[1],
          start: Math.min(dragCenterX, otherCenterX) + roomOffset[0] - 0.5,
          end: Math.max(dragCenterX, otherCenterX) + roomOffset[0] + 0.5,
        });
      }
    }
  }

  return { guidelines, snappedX, snappedZ };
}

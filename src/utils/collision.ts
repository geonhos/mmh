import type { FurnitureInstance } from '../types';

interface AABB {
  minX: number; maxX: number;
  minZ: number; maxZ: number;
}

export function furnitureAABB(item: FurnitureInstance): AABB {
  const yRot = ((item.rotation[1] % Math.PI) + Math.PI) % Math.PI;
  const isRotated = Math.abs(yRot - Math.PI / 2) < 0.01;
  const w = isRotated ? item.dimensions.depth : item.dimensions.width;
  const d = isRotated ? item.dimensions.width : item.dimensions.depth;
  return {
    minX: item.position[0] - w / 2,
    maxX: item.position[0] + w / 2,
    minZ: item.position[2] - d / 2,
    maxZ: item.position[2] + d / 2,
  };
}

export function aabbOverlap(a: AABB, b: AABB): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ;
}

export function checkCollisions(
  item: FurnitureInstance,
  allFurniture: FurnitureInstance[],
  tempPosition?: [number, number, number],
): boolean {
  const testItem = tempPosition ? { ...item, position: tempPosition } : item;
  const testAABB = furnitureAABB(testItem);

  return allFurniture.some((other) => {
    if (other.id === item.id) return false;
    if (other.roomId !== item.roomId) return false;
    return aabbOverlap(testAABB, furnitureAABB(other));
  });
}

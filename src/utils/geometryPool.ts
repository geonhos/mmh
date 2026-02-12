import * as THREE from 'three';
import type { MaterialType } from '../types';
import { materialPresets } from './materials';

// Geometry cache keyed by "width,height,depth"
const geoCache = new Map<string, THREE.BoxGeometry>();

export function getBoxGeometry(w: number, h: number, d: number): THREE.BoxGeometry {
  const key = `${w},${h},${d}`;
  let geo = geoCache.get(key);
  if (!geo) {
    geo = new THREE.BoxGeometry(w, h, d);
    geoCache.set(key, geo);
  }
  return geo;
}

// Material cache keyed by "materialType:color"
const matCache = new Map<string, THREE.MeshPhysicalMaterial>();

export function getPooledMaterial(materialType: MaterialType, color: string): THREE.MeshPhysicalMaterial {
  const key = `${materialType}:${color}`;
  let mat = matCache.get(key);
  if (!mat) {
    const preset = materialPresets[materialType];
    mat = new THREE.MeshPhysicalMaterial({
      color,
      roughness: preset.roughness,
      metalness: preset.metalness,
      clearcoat: preset.clearcoat ?? 0,
      clearcoatRoughness: preset.clearcoatRoughness ?? 0,
      opacity: preset.opacity ?? 1,
      transparent: preset.transparent ?? false,
    });
    matCache.set(key, mat);
  }
  return mat;
}

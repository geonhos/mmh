import type { MaterialType } from '../types';

export interface PBRConfig {
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  opacity?: number;
  transparent?: boolean;
}

export const materialPresets: Record<MaterialType, PBRConfig> = {
  wood:     { roughness: 0.7, metalness: 0.0 },
  fabric:   { roughness: 0.9, metalness: 0.0 },
  metal:    { roughness: 0.3, metalness: 0.8 },
  ceramic:  { roughness: 0.4, metalness: 0.1, clearcoat: 0.5 },
  plastic:  { roughness: 0.5, metalness: 0.0 },
  glass:    { roughness: 0.1, metalness: 0.1, opacity: 0.6, transparent: true },
};

export function getMaterialProps(materialType: MaterialType, color: string) {
  const preset = materialPresets[materialType];
  return { color, ...preset };
}

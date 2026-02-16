import type { RoomConfig, RoomInstance } from '../types';
import { generateId } from './ids';

export const DEFAULT_ROOM: RoomConfig = {
  width: 5,
  depth: 4,
  height: 2.8,
};

export const COLORS = {
  wall: '#e8e0d8',
  floor: '#c4a882',
  wallOpacity: 0.3,
};

export interface SurfacePreset {
  id: string;
  label: string;
  color: string;
  roughness: number;
}

export const FLOOR_PRESETS: SurfacePreset[] = [
  { id: 'wood-light', label: '밝은 원목', color: '#c4a882', roughness: 0.7 },
  { id: 'wood-dark', label: '어두운 원목', color: '#8B6B4A', roughness: 0.65 },
  { id: 'wood-walnut', label: '월넛', color: '#6B4226', roughness: 0.6 },
  { id: 'tile-white', label: '화이트 타일', color: '#e8e8e8', roughness: 0.3 },
  { id: 'tile-gray', label: '그레이 타일', color: '#b0b0b0', roughness: 0.35 },
  { id: 'marble', label: '대리석', color: '#e0d8d0', roughness: 0.15 },
  { id: 'concrete', label: '콘크리트', color: '#a0a0a0', roughness: 0.9 },
  { id: 'carpet-beige', label: '베이지 카펫', color: '#c8b99a', roughness: 1.0 },
  { id: 'carpet-gray', label: '그레이 카펫', color: '#909090', roughness: 1.0 },
];

export const WALL_PRESETS: SurfacePreset[] = [
  { id: 'white', label: '화이트', color: '#f0ede8', roughness: 0.9 },
  { id: 'warm-white', label: '웜화이트', color: '#e8e0d8', roughness: 0.9 },
  { id: 'cream', label: '크림', color: '#f5e6c8', roughness: 0.85 },
  { id: 'light-gray', label: '라이트그레이', color: '#d0d0d0', roughness: 0.9 },
  { id: 'blue-gray', label: '블루그레이', color: '#b8c4cc', roughness: 0.85 },
  { id: 'sage', label: '세이지', color: '#b8c4b0', roughness: 0.85 },
  { id: 'light-blue', label: '라이트블루', color: '#c0d4e0', roughness: 0.85 },
  { id: 'pink-beige', label: '핑크베이지', color: '#dcc8bc', roughness: 0.85 },
  { id: 'charcoal', label: '차콜', color: '#505050', roughness: 0.8 },
];

export const GRID_SNAP_SIZE = 0.25;
export const WALL_SNAP_THRESHOLD = 0.3;
export const ROOM_SNAP_THRESHOLD = 0.5;

export function createDefaultRoom(name: string): RoomInstance {
  return {
    id: generateId(),
    name,
    dimensions: { ...DEFAULT_ROOM },
    position: [0, 0],
  };
}

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

export const GRID_SNAP_SIZE = 0.25;

export function createDefaultRoom(name: string): RoomInstance {
  return {
    id: generateId(),
    name,
    dimensions: { ...DEFAULT_ROOM },
    position: [0, 0],
  };
}

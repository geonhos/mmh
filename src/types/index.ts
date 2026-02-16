export interface RoomConfig {
  width: number;
  depth: number;
  height: number;
}

export type WallSide = 'north' | 'south' | 'east' | 'west';

export interface WallElement {
  id: string;
  type: 'door' | 'window';
  wall: WallSide;
  offset: number;
  width: number;
  height: number;
  elevation: number;
}

export interface RoomInstance {
  id: string;
  name: string;
  dimensions: RoomConfig;
  position: [number, number];
  locked?: boolean;
  wallElements?: WallElement[];
  floorMaterial?: string;
  wallMaterial?: string;
}

export type MaterialType = 'wood' | 'fabric' | 'metal' | 'ceramic' | 'plastic' | 'glass';

export interface FurnitureCatalogItem {
  id: string;
  name: string;
  category: string;
  dimensions: { width: number; depth: number; height: number };
  color: string;
  materialType?: MaterialType;
  brand?: string;
  model?: string;
}

export interface FloorPlanConfig {
  dataUrl: string;
  scale: number;
  position: [number, number];
  opacity: number;
  width: number;
  height: number;
}

export interface FurnitureInstance {
  id: string;
  catalogId: string;
  roomId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  name: string;
  dimensions: { width: number; depth: number; height: number };
  color: string;
  locked?: boolean;
}

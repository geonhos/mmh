export interface RoomConfig {
  width: number;
  depth: number;
  height: number;
}

export interface FurnitureCatalogItem {
  id: string;
  name: string;
  category: string;
  dimensions: { width: number; depth: number; height: number };
  color: string;
}

export interface FurnitureInstance {
  id: string;
  catalogId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  name: string;
  dimensions: { width: number; depth: number; height: number };
  color: string;
}

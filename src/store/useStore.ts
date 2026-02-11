import { create } from 'zustand';
import type { RoomConfig, RoomInstance, FurnitureInstance } from '../types';
import { createDefaultRoom } from '../utils/constants';

const STORAGE_KEY = 'my-model-house-save';
const SAVE_VERSION = 2;

interface SaveDataV1 {
  room: RoomConfig;
  furnitureList: FurnitureInstance[];
}

interface SaveDataV2 {
  version: 2;
  rooms: RoomInstance[];
  furnitureList: FurnitureInstance[];
}

type SaveData = SaveDataV2;

function migrateV1toV2(v1: SaveDataV1): SaveDataV2 {
  const defaultRoom = createDefaultRoom('방 1');
  defaultRoom.dimensions = v1.room;
  return {
    version: 2,
    rooms: [defaultRoom],
    furnitureList: v1.furnitureList.map((f) => ({
      ...f,
      roomId: f.roomId ?? defaultRoom.id,
    })),
  };
}

function parseSaveData(raw: string): SaveDataV2 | null {
  try {
    const data = JSON.parse(raw);
    if (data.version === 2) return data as SaveDataV2;
    // v1: has room + furnitureList but no version
    if (data.room && data.furnitureList) return migrateV1toV2(data as SaveDataV1);
    return null;
  } catch {
    return null;
  }
}

const initialRoom = createDefaultRoom('방 1');

interface AppState {
  rooms: RoomInstance[];
  selectedRoomId: string | null;
  furnitureList: FurnitureInstance[];
  selectedFurnitureId: string | null;
  snapEnabled: boolean;

  // Room CRUD
  addRoom: (room: RoomInstance) => void;
  updateRoom: (id: string, updates: Partial<Omit<RoomInstance, 'id'>>) => void;
  removeRoom: (id: string) => void;
  setSelectedRoomId: (id: string | null) => void;

  // Furniture
  addFurniture: (item: FurnitureInstance) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureInstance>) => void;
  removeFurniture: (id: string) => void;
  setSelectedFurnitureId: (id: string | null) => void;

  // Snap
  setSnapEnabled: (enabled: boolean) => void;

  // Persistence
  save: () => void;
  load: () => void;
}

export const useStore = create<AppState>((set) => ({
  rooms: [initialRoom],
  selectedRoomId: initialRoom.id,
  furnitureList: [],
  selectedFurnitureId: null,
  snapEnabled: true,

  addRoom: (room) =>
    set((state) => ({ rooms: [...state.rooms, room] })),

  updateRoom: (id, updates) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  removeRoom: (id) =>
    set((state) => ({
      rooms: state.rooms.filter((r) => r.id !== id),
      furnitureList: state.furnitureList.filter((f) => f.roomId !== id),
      selectedRoomId: state.selectedRoomId === id
        ? (state.rooms.find((r) => r.id !== id)?.id ?? null)
        : state.selectedRoomId,
    })),

  setSelectedRoomId: (id) => set({ selectedRoomId: id }),

  addFurniture: (item) =>
    set((state) => ({ furnitureList: [...state.furnitureList, item] })),

  updateFurniture: (id, updates) =>
    set((state) => ({
      furnitureList: state.furnitureList.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  removeFurniture: (id) =>
    set((state) => ({
      furnitureList: state.furnitureList.filter((f) => f.id !== id),
      selectedFurnitureId: state.selectedFurnitureId === id ? null : state.selectedFurnitureId,
    })),

  setSelectedFurnitureId: (id) => set({ selectedFurnitureId: id }),

  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),

  save: () => {
    const { rooms, furnitureList } = useStore.getState();
    const data: SaveData = { version: SAVE_VERSION, rooms, furnitureList };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  load: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = parseSaveData(raw);
    if (!data) return;
    set({
      rooms: data.rooms,
      furnitureList: data.furnitureList,
      selectedRoomId: data.rooms[0]?.id ?? null,
      selectedFurnitureId: null,
    });
  },
}));

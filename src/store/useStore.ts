import { create } from 'zustand';
import type { RoomConfig, FurnitureInstance } from '../types';
import { DEFAULT_ROOM } from '../utils/constants';

interface AppState {
  room: RoomConfig;
  furnitureList: FurnitureInstance[];
  selectedId: string | null;

  setRoom: (room: Partial<RoomConfig>) => void;
  addFurniture: (item: FurnitureInstance) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureInstance>) => void;
  removeFurniture: (id: string) => void;
  setSelectedId: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  room: DEFAULT_ROOM,
  furnitureList: [],
  selectedId: null,

  setRoom: (partial) =>
    set((state) => ({ room: { ...state.room, ...partial } })),

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
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  setSelectedId: (id) => set({ selectedId: id }),
}));

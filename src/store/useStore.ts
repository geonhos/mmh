import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RoomConfig, RoomInstance, FurnitureInstance } from '../types';
import { createDefaultRoom } from '../utils/constants';
import { generateId } from '../utils/ids';

const SAVE_VERSION = 2;
const MAX_HISTORY = 50;

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

/** Snapshot of undoable state */
interface Snapshot {
  rooms: RoomInstance[];
  furnitureList: FurnitureInstance[];
}

const initialRoom = createDefaultRoom('방 1');

interface AppState {
  rooms: RoomInstance[];
  selectedRoomId: string | null;
  furnitureList: FurnitureInstance[];
  selectedFurnitureId: string | null;
  snapEnabled: boolean;

  // Undo/Redo
  _history: Snapshot[];
  _future: Snapshot[];
  undo: () => void;
  redo: () => void;

  // Room CRUD
  addRoom: (room: RoomInstance) => void;
  updateRoom: (id: string, updates: Partial<Omit<RoomInstance, 'id'>>) => void;
  removeRoom: (id: string) => void;
  setSelectedRoomId: (id: string | null) => void;

  // Furniture
  addFurniture: (item: FurnitureInstance) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureInstance>) => void;
  removeFurniture: (id: string) => void;
  duplicateFurniture: (id: string) => void;
  setSelectedFurnitureId: (id: string | null) => void;

  // Snap
  setSnapEnabled: (enabled: boolean) => void;

  // Context menu
  contextMenu: { x: number; y: number; targetId: string; targetType: 'furniture' | 'room' } | null;
  setContextMenu: (menu: AppState['contextMenu']) => void;

  // Persistence
  exportToFile: () => void;
  importFromFile: (json: string) => void;
}

function pushHistory(state: AppState): { _history: Snapshot[]; _future: Snapshot[] } {
  const snapshot: Snapshot = {
    rooms: state.rooms,
    furnitureList: state.furnitureList,
  };
  const history = [...state._history, snapshot];
  if (history.length > MAX_HISTORY) history.shift();
  return { _history: history, _future: [] };
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      rooms: [initialRoom],
      selectedRoomId: initialRoom.id,
      furnitureList: [],
      selectedFurnitureId: null,
      snapEnabled: true,
      _history: [],
      _future: [],

      undo: () =>
        set((state) => {
          if (state._history.length === 0) return state;
          const history = [...state._history];
          const snapshot = history.pop()!;
          const futureSnapshot: Snapshot = {
            rooms: state.rooms,
            furnitureList: state.furnitureList,
          };
          return {
            ...snapshot,
            _history: history,
            _future: [...state._future, futureSnapshot],
            selectedRoomId: snapshot.rooms.find((r) => r.id === state.selectedRoomId)
              ? state.selectedRoomId
              : snapshot.rooms[0]?.id ?? null,
            selectedFurnitureId: snapshot.furnitureList.find((f) => f.id === state.selectedFurnitureId)
              ? state.selectedFurnitureId
              : null,
          };
        }),

      redo: () =>
        set((state) => {
          if (state._future.length === 0) return state;
          const future = [...state._future];
          const snapshot = future.pop()!;
          const historySnapshot: Snapshot = {
            rooms: state.rooms,
            furnitureList: state.furnitureList,
          };
          const history = [...state._history, historySnapshot];
          if (history.length > MAX_HISTORY) history.shift();
          return {
            ...snapshot,
            _history: history,
            _future: future,
            selectedRoomId: snapshot.rooms.find((r) => r.id === state.selectedRoomId)
              ? state.selectedRoomId
              : snapshot.rooms[0]?.id ?? null,
            selectedFurnitureId: snapshot.furnitureList.find((f) => f.id === state.selectedFurnitureId)
              ? state.selectedFurnitureId
              : null,
          };
        }),

      addRoom: (room) =>
        set((state) => ({
          ...pushHistory(state),
          rooms: [...state.rooms, room],
        })),

      updateRoom: (id, updates) =>
        set((state) => ({
          ...pushHistory(state),
          rooms: state.rooms.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      removeRoom: (id) =>
        set((state) => ({
          ...pushHistory(state),
          rooms: state.rooms.filter((r) => r.id !== id),
          furnitureList: state.furnitureList.filter((f) => f.roomId !== id),
          selectedRoomId: state.selectedRoomId === id
            ? (state.rooms.find((r) => r.id !== id)?.id ?? null)
            : state.selectedRoomId,
        })),

      setSelectedRoomId: (id) => set({ selectedRoomId: id }),

      addFurniture: (item) =>
        set((state) => ({
          ...pushHistory(state),
          furnitureList: [...state.furnitureList, item],
        })),

      updateFurniture: (id, updates) =>
        set((state) => ({
          ...pushHistory(state),
          furnitureList: state.furnitureList.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      removeFurniture: (id) =>
        set((state) => ({
          ...pushHistory(state),
          furnitureList: state.furnitureList.filter((f) => f.id !== id),
          selectedFurnitureId: state.selectedFurnitureId === id ? null : state.selectedFurnitureId,
        })),

      duplicateFurniture: (id) =>
        set((state) => {
          const source = state.furnitureList.find((f) => f.id === id);
          if (!source) return state;
          const clone: FurnitureInstance = {
            ...source,
            id: generateId(),
            position: [source.position[0] + 0.3, source.position[1], source.position[2] + 0.3],
            locked: false,
          };
          return {
            ...pushHistory(state),
            furnitureList: [...state.furnitureList, clone],
            selectedFurnitureId: clone.id,
          };
        }),

      setSelectedFurnitureId: (id) => set({ selectedFurnitureId: id }),

      setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),

      contextMenu: null,
      setContextMenu: (menu) => set({ contextMenu: menu }),

      exportToFile: () => {
        const { rooms, furnitureList } = useStore.getState();
        const data: SaveData = { version: SAVE_VERSION, rooms, furnitureList };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-model-house.json';
        a.click();
        URL.revokeObjectURL(url);
      },

      importFromFile: (json: string) => {
        const data = parseSaveData(json);
        if (!data) return;
        set((state) => ({
          ...pushHistory(state),
          rooms: data.rooms,
          furnitureList: data.furnitureList,
          selectedRoomId: data.rooms[0]?.id ?? null,
          selectedFurnitureId: null,
        }));
      },
    }),
    {
      name: 'my-model-house-storage',
      version: SAVE_VERSION,
      partialize: (state) => ({
        rooms: state.rooms,
        furnitureList: state.furnitureList,
        selectedRoomId: state.selectedRoomId,
        snapEnabled: state.snapEnabled,
      }),
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          const raw = persistedState as Record<string, unknown>;
          if (raw.room && raw.furnitureList) {
            const migrated = migrateV1toV2(raw as unknown as SaveDataV1);
            return {
              rooms: migrated.rooms,
              furnitureList: migrated.furnitureList,
              selectedRoomId: migrated.rooms[0]?.id ?? null,
              snapEnabled: true,
            };
          }
        }
        return persistedState as Record<string, unknown>;
      },
    }
  )
);

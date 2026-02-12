import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { enablePatches, produceWithPatches, applyPatches, type Patch } from 'immer';
import type { RoomConfig, RoomInstance, FurnitureInstance, FloorPlanConfig, WallElement } from '../types';
import type { SnapGuideline } from '../utils/snapGuides';
import { createDefaultRoom } from '../utils/constants';
import { generateId } from '../utils/ids';

enablePatches();

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
    if (data.room && data.furnitureList) return migrateV1toV2(data as SaveDataV1);
    return null;
  } catch {
    return null;
  }
}

/** Undoable portion of the state */
interface UndoableState {
  rooms: RoomInstance[];
  furnitureList: FurnitureInstance[];
}

/** Patch-based history entry (much smaller than full snapshots) */
interface HistoryEntry {
  patches: Patch[];
  inversePatches: Patch[];
}

const initialRoom = createDefaultRoom('방 1');

interface AppState {
  rooms: RoomInstance[];
  selectedRoomId: string | null;
  furnitureList: FurnitureInstance[];
  selectedFurnitureIds: string[];
  snapEnabled: boolean;

  // Undo/Redo (patch-based)
  _history: HistoryEntry[];
  _future: HistoryEntry[];
  undo: () => void;
  redo: () => void;

  // Room CRUD
  addRoom: (room: RoomInstance) => void;
  updateRoom: (id: string, updates: Partial<Omit<RoomInstance, 'id'>>) => void;
  removeRoom: (id: string) => void;
  setSelectedRoomId: (id: string | null) => void;

  // Wall elements
  addWallElement: (roomId: string, element: WallElement) => void;
  updateWallElement: (roomId: string, elementId: string, updates: Partial<WallElement>) => void;
  removeWallElement: (roomId: string, elementId: string) => void;

  // Furniture
  addFurniture: (item: FurnitureInstance) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureInstance>) => void;
  removeFurniture: (id: string) => void;
  duplicateFurniture: (id: string) => void;
  setSelectedFurnitureId: (id: string | null) => void;
  toggleFurnitureSelection: (id: string) => void;

  // Snap
  setSnapEnabled: (enabled: boolean) => void;

  // Context menu
  contextMenu: { x: number; y: number; targetId: string; targetType: 'furniture' | 'room' } | null;
  setContextMenu: (menu: AppState['contextMenu']) => void;

  // Post-processing
  postProcessingQuality: 'off' | 'low' | 'high';
  setPostProcessingQuality: (quality: 'off' | 'low' | 'high') => void;

  // Snap guidelines (non-persisted, non-history)
  activeGuidelines: SnapGuideline[];
  setActiveGuidelines: (guidelines: SnapGuideline[]) => void;

  // Floor plan
  floorPlan: FloorPlanConfig | null;
  setFloorPlan: (config: FloorPlanConfig | null) => void;
  updateFloorPlan: (updates: Partial<FloorPlanConfig>) => void;

  // Persistence
  exportToFile: () => void;
  importFromFile: (json: string) => void;
}

/**
 * Produce a new undoable state with immer patches for undo/redo.
 * Returns partial state with rooms, furnitureList, _history, _future.
 */
function withHistory(
  state: AppState,
  recipe: (draft: UndoableState) => void,
): Partial<AppState> {
  const base: UndoableState = { rooms: state.rooms, furnitureList: state.furnitureList };
  const [nextState, patches, inversePatches] = produceWithPatches(base, recipe);

  if (patches.length === 0) return {};

  const history = [...state._history, { patches, inversePatches }];
  if (history.length > MAX_HISTORY) history.shift();

  return {
    rooms: nextState.rooms,
    furnitureList: nextState.furnitureList,
    _history: history,
    _future: [],
  };
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      rooms: [initialRoom],
      selectedRoomId: initialRoom.id,
      furnitureList: [],
      selectedFurnitureIds: [],
      snapEnabled: true,
      _history: [],
      _future: [],

      undo: () =>
        set((state) => {
          if (state._history.length === 0) return state;
          const history = [...state._history];
          const entry = history.pop()!;
          const base: UndoableState = { rooms: state.rooms, furnitureList: state.furnitureList };
          const next = applyPatches(base, entry.inversePatches);
          return {
            rooms: next.rooms,
            furnitureList: next.furnitureList,
            _history: history,
            _future: [...state._future, entry],
            selectedRoomId: next.rooms.find((r) => r.id === state.selectedRoomId)
              ? state.selectedRoomId
              : next.rooms[0]?.id ?? null,
            selectedFurnitureIds: state.selectedFurnitureIds.filter((id) =>
              next.furnitureList.some((f) => f.id === id)
            ),
          };
        }),

      redo: () =>
        set((state) => {
          if (state._future.length === 0) return state;
          const future = [...state._future];
          const entry = future.pop()!;
          const base: UndoableState = { rooms: state.rooms, furnitureList: state.furnitureList };
          const next = applyPatches(base, entry.patches);
          const history = [...state._history, entry];
          if (history.length > MAX_HISTORY) history.shift();
          return {
            rooms: next.rooms,
            furnitureList: next.furnitureList,
            _history: history,
            _future: future,
            selectedRoomId: next.rooms.find((r) => r.id === state.selectedRoomId)
              ? state.selectedRoomId
              : next.rooms[0]?.id ?? null,
            selectedFurnitureIds: state.selectedFurnitureIds.filter((id) =>
              next.furnitureList.some((f) => f.id === id)
            ),
          };
        }),

      addRoom: (room) =>
        set((state) => withHistory(state, (draft) => {
          draft.rooms.push(room);
        })),

      updateRoom: (id, updates) =>
        set((state) => withHistory(state, (draft) => {
          const room = draft.rooms.find((r) => r.id === id);
          if (room) Object.assign(room, updates);
        })),

      removeRoom: (id) =>
        set((state) => ({
          ...withHistory(state, (draft) => {
            const idx = draft.rooms.findIndex((r) => r.id === id);
            if (idx >= 0) draft.rooms.splice(idx, 1);
            draft.furnitureList = draft.furnitureList.filter((f) => f.roomId !== id);
          }),
          selectedRoomId: state.selectedRoomId === id
            ? (state.rooms.find((r) => r.id !== id)?.id ?? null)
            : state.selectedRoomId,
        })),

      setSelectedRoomId: (id) => set({ selectedRoomId: id }),

      addWallElement: (roomId, element) =>
        set((state) => withHistory(state, (draft) => {
          const room = draft.rooms.find((r) => r.id === roomId);
          if (room) {
            if (!room.wallElements) room.wallElements = [];
            room.wallElements.push(element);
          }
        })),

      updateWallElement: (roomId, elementId, updates) =>
        set((state) => withHistory(state, (draft) => {
          const room = draft.rooms.find((r) => r.id === roomId);
          const el = room?.wallElements?.find((e) => e.id === elementId);
          if (el) Object.assign(el, updates);
        })),

      removeWallElement: (roomId, elementId) =>
        set((state) => withHistory(state, (draft) => {
          const room = draft.rooms.find((r) => r.id === roomId);
          if (room?.wallElements) {
            room.wallElements = room.wallElements.filter((e) => e.id !== elementId);
          }
        })),

      addFurniture: (item) =>
        set((state) => withHistory(state, (draft) => {
          draft.furnitureList.push(item);
        })),

      updateFurniture: (id, updates) =>
        set((state) => withHistory(state, (draft) => {
          const item = draft.furnitureList.find((f) => f.id === id);
          if (item) Object.assign(item, updates);
        })),

      removeFurniture: (id) =>
        set((state) => ({
          ...withHistory(state, (draft) => {
            const idx = draft.furnitureList.findIndex((f) => f.id === id);
            if (idx >= 0) draft.furnitureList.splice(idx, 1);
          }),
          selectedFurnitureIds: state.selectedFurnitureIds.filter((sid) => sid !== id),
        })),

      duplicateFurniture: (id) =>
        set((state) => {
          const source = state.furnitureList.find((f) => f.id === id);
          if (!source) return state;
          const cloneId = generateId();
          return {
            ...withHistory(state, (draft) => {
              draft.furnitureList.push({
                ...source,
                id: cloneId,
                position: [source.position[0] + 0.3, source.position[1], source.position[2] + 0.3],
                locked: false,
              });
            }),
            selectedFurnitureIds: [cloneId],
          };
        }),

      setSelectedFurnitureId: (id) => set({ selectedFurnitureIds: id ? [id] : [] }),

      toggleFurnitureSelection: (id) =>
        set((state) => ({
          selectedFurnitureIds: state.selectedFurnitureIds.includes(id)
            ? state.selectedFurnitureIds.filter((sid) => sid !== id)
            : [...state.selectedFurnitureIds, id],
        })),

      setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),

      activeGuidelines: [],
      setActiveGuidelines: (guidelines) => set({ activeGuidelines: guidelines }),

      contextMenu: null,
      setContextMenu: (menu) => set({ contextMenu: menu }),

      postProcessingQuality: 'off',
      setPostProcessingQuality: (quality) => set({ postProcessingQuality: quality }),

      floorPlan: null,
      setFloorPlan: (config) => set({ floorPlan: config }),
      updateFloorPlan: (updates) =>
        set((state) => ({
          floorPlan: state.floorPlan ? { ...state.floorPlan, ...updates } : null,
        })),

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
          ...withHistory(state, (draft) => {
            draft.rooms = data.rooms;
            draft.furnitureList = data.furnitureList;
          }),
          selectedRoomId: data.rooms[0]?.id ?? null,
          selectedFurnitureIds: [],
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
        floorPlan: state.floorPlan,
        postProcessingQuality: state.postProcessingQuality,
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

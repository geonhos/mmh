import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { RoomInstance, FurnitureInstance } from '../types';

interface SharedState {
  v: number;
  r: RoomInstance[];
  f: FurnitureInstance[];
}

const MAX_URL_LENGTH = 8000;

export function encodeStateToHash(rooms: RoomInstance[], furnitureList: FurnitureInstance[]): string | null {
  const data: SharedState = { v: 2, r: rooms, f: furnitureList };
  const json = JSON.stringify(data);
  const compressed = compressToEncodedURIComponent(json);

  const url = `${window.location.origin}${window.location.pathname}#share=${compressed}`;
  if (url.length > MAX_URL_LENGTH) {
    return null;
  }
  return url;
}

export function decodeStateFromHash(hash: string): { rooms: RoomInstance[]; furnitureList: FurnitureInstance[] } | null {
  try {
    const prefix = '#share=';
    if (!hash.startsWith(prefix)) return null;
    const compressed = hash.slice(prefix.length);
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const data = JSON.parse(json) as SharedState;
    if (data.v !== 2 || !Array.isArray(data.r) || !Array.isArray(data.f)) return null;
    return { rooms: data.r, furnitureList: data.f };
  } catch {
    return null;
  }
}

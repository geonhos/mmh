import { useEffect } from 'react';
import { useStore } from '../store/useStore';

interface KeyboardShortcutsOptions {
  onToggleMode: () => void;
}

export function useKeyboardShortcuts({ onToggleMode }: KeyboardShortcutsOptions) {
  const removeFurniture = useStore((s) => s.removeFurniture);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const selectedId = useStore((s) => s.selectedId);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const furnitureList = useStore((s) => s.furnitureList);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'r':
        case 'R':
          if (selectedId) {
            const item = furnitureList.find((f) => f.id === selectedId);
            if (item) {
              updateFurniture(selectedId, {
                rotation: [item.rotation[0], item.rotation[1] + Math.PI / 2, item.rotation[2]],
              });
            }
          } else {
            onToggleMode();
          }
          break;
        case 'g':
        case 'G':
          onToggleMode();
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedId) {
            removeFurniture(selectedId);
          }
          break;
        case 'Escape':
          setSelectedId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, furnitureList, removeFurniture, setSelectedId, updateFurniture, onToggleMode]);
}

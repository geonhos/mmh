import { useEffect } from 'react';
import { useStore } from '../store/useStore';

interface KeyboardShortcutsOptions {
  onToggleMode: () => void;
}

export function useKeyboardShortcuts({ onToggleMode }: KeyboardShortcutsOptions) {
  const removeFurniture = useStore((s) => s.removeFurniture);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const furnitureList = useStore((s) => s.furnitureList);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'r':
        case 'R':
          if (selectedFurnitureId) {
            const item = furnitureList.find((f) => f.id === selectedFurnitureId);
            if (item) {
              updateFurniture(selectedFurnitureId, {
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
          if (selectedFurnitureId) {
            removeFurniture(selectedFurnitureId);
          }
          break;
        case 'Escape':
          setSelectedFurnitureId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFurnitureId, furnitureList, removeFurniture, setSelectedFurnitureId, updateFurniture, onToggleMode]);
}

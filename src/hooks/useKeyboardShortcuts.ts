import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const removeFurniture = useStore((s) => s.removeFurniture);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const furnitureList = useStore((s) => s.furnitureList);
  const undo = useStore((s) => s.undo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Ctrl+Z / Cmd+Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      if (!selectedFurnitureId) return;
      const item = furnitureList.find((f) => f.id === selectedFurnitureId);

      switch (e.key) {
        case 'r':
          // Rotate right 90°
          if (item) {
            updateFurniture(selectedFurnitureId, {
              rotation: [item.rotation[0], item.rotation[1] + Math.PI / 2, item.rotation[2]],
            });
          }
          break;
        case 'R':
          // Rotate left 90°
          if (item) {
            updateFurniture(selectedFurnitureId, {
              rotation: [item.rotation[0], item.rotation[1] - Math.PI / 2, item.rotation[2]],
            });
          }
          break;
        case 'Delete':
        case 'Backspace':
          removeFurniture(selectedFurnitureId);
          break;
        case 'Escape':
          setSelectedFurnitureId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFurnitureId, furnitureList, removeFurniture, setSelectedFurnitureId, updateFurniture, undo]);
}

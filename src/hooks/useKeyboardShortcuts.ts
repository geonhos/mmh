import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts(onToggleShortcutHelp?: () => void) {
  const removeFurniture = useStore((s) => s.removeFurniture);
  const duplicateFurniture = useStore((s) => s.duplicateFurniture);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);
  const selectedFurnitureId = useStore((s) => s.selectedFurnitureId);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const furnitureList = useStore((s) => s.furnitureList);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // ? key: Toggle shortcut help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onToggleShortcutHelp?.();
        return;
      }

      // Ctrl+Z / Cmd+Z: Undo, Ctrl+Shift+Z: Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      // Ctrl+Y / Cmd+Y: Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl+D / Cmd+D: Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedFurnitureId) {
          duplicateFurniture(selectedFurnitureId);
        }
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
  }, [selectedFurnitureId, furnitureList, removeFurniture, duplicateFurniture, setSelectedFurnitureId, updateFurniture, undo, redo, onToggleShortcutHelp]);
}

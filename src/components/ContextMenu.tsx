import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

interface ContextMenuProps {
  x: number;
  y: number;
  targetId: string;
  targetType: 'furniture' | 'room';
  onClose: () => void;
}

export default function ContextMenu({ x, y, targetId, targetType, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const duplicateFurniture = useStore((s) => s.duplicateFurniture);
  const removeFurniture = useStore((s) => s.removeFurniture);
  const updateFurniture = useStore((s) => s.updateFurniture);
  const updateRoom = useStore((s) => s.updateRoom);
  const furnitureList = useStore((s) => s.furnitureList);
  const rooms = useStore((s) => s.rooms);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const furnitureItem = furnitureList.find((f) => f.id === targetId);
  const roomItem = rooms.find((r) => r.id === targetId);

  const menuItems: { label: string; onClick: () => void; color?: string }[] = [];

  if (targetType === 'furniture' && furnitureItem) {
    menuItems.push(
      { label: '복제', onClick: () => { duplicateFurniture(targetId); onClose(); } },
      { label: furnitureItem.locked ? '잠금 해제' : '잠금', onClick: () => {
        updateFurniture(targetId, { locked: !furnitureItem.locked }); onClose();
      }},
      { label: '90° 회전', onClick: () => {
        updateFurniture(targetId, {
          rotation: [furnitureItem.rotation[0], furnitureItem.rotation[1] + Math.PI / 2, furnitureItem.rotation[2]],
        }); onClose();
      }},
      { label: '삭제', onClick: () => { removeFurniture(targetId); onClose(); }, color: '#ff6b6b' },
    );
  }

  if (targetType === 'room' && roomItem) {
    menuItems.push(
      { label: roomItem.locked ? '잠금 해제' : '잠금', onClick: () => {
        updateRoom(targetId, { locked: !roomItem.locked }); onClose();
      }},
    );
  }

  const adjustedX = Math.min(x, window.innerWidth - 160);
  const adjustedY = Math.min(y, window.innerHeight - menuItems.length * 36 - 16);

  return (
    <div ref={ref} style={{
      position: 'fixed', left: adjustedX, top: adjustedY, zIndex: 3000,
      background: '#2a2a3e', border: '1px solid #444', borderRadius: 8,
      padding: '4px 0', minWidth: 140, boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      {menuItems.map(({ label, onClick, color }) => (
        <button key={label} onClick={onClick} style={{
          display: 'block', width: '100%', padding: '8px 16px',
          background: 'none', border: 'none', color: color ?? '#e0e0e0',
          fontSize: 13, cursor: 'pointer', textAlign: 'left',
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#333'; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'none'; }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

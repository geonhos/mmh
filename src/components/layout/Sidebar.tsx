import { useState, useEffect } from 'react';
import type { CameraPreset } from '../scene/CameraController';
import { useStore } from '../../store/useStore';
import RoomConfigurator from '../sidebar/RoomConfigurator';
import PlacedFurnitureList from '../sidebar/PlacedFurnitureList';
import FurnitureCatalog from '../sidebar/FurnitureCatalog';
import ToolBar from '../sidebar/ToolBar';
import FurniturePanel from '../sidebar/FurniturePanel';

type SidebarTab = 'room' | 'furniture' | 'settings';

interface SidebarProps {
  cameraPreset: CameraPreset;
  onCameraChange: (preset: CameraPreset) => void;
  onShowShortcuts?: () => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

const cameraLabels: Record<CameraPreset, string> = {
  perspective: '3D',
  top: '탑',
  walkthrough: '1인칭',
};

export default function Sidebar({ cameraPreset, onCameraChange, onShowShortcuts }: SidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('room');

  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const historyLength = useStore((s) => s._history.length);
  const futureLength = useStore((s) => s._future.length);
  const selectedFurnitureIds = useStore((s) => s.selectedFurnitureIds);

  const tabs: { key: SidebarTab; label: string }[] = [
    { key: 'room', label: '방' },
    { key: 'furniture', label: '가구' },
    { key: 'settings', label: '설정' },
  ];

  const content = (
    <>
      {/* Header */}
      <h2 style={{ margin: '0 0 10px', fontSize: 18 }}>My Model House</h2>

      {/* Global Toolbar */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 10, alignItems: 'center',
        padding: '6px 0', borderBottom: '1px solid #333',
      }}>
        <button className="preset-btn" onClick={undo} disabled={historyLength === 0}
          style={{ padding: '4px 10px', fontSize: 13, flex: 'none' }} title="실행취소 (Ctrl+Z)">
          ↩
        </button>
        <button className="preset-btn" onClick={redo} disabled={futureLength === 0}
          style={{ padding: '4px 10px', fontSize: 13, flex: 'none' }} title="다시실행 (Ctrl+Shift+Z)">
          ↪
        </button>
        <div style={{ width: 1, height: 20, background: '#444', margin: '0 2px', flexShrink: 0 }} />
        {(['perspective', 'top', 'walkthrough'] as CameraPreset[]).map((p) => (
          <button
            key={p}
            className={`preset-btn ${cameraPreset === p ? 'active' : ''}`}
            style={{ padding: '4px 8px', fontSize: 11 }}
            onClick={() => onCameraChange(p)}
          >
            {cameraLabels[p]}
          </button>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', marginBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={{
              flex: 1,
              padding: '9px 0',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#fff' : '#888',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key
                ? '2px solid #646cff'
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content (scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12 }}>
        {activeTab === 'room' && (
          <>
            <RoomConfigurator />
            <PlacedFurnitureList />
          </>
        )}
        {activeTab === 'furniture' && (
          <>
            <PlacedFurnitureList />
            <FurnitureCatalog />
          </>
        )}
        {activeTab === 'settings' && (
          <ToolBar onShowShortcuts={onShowShortcuts} />
        )}
      </div>

      {/* Floating Furniture Panel */}
      {selectedFurnitureIds.length > 0 && (
        <div style={{
          borderTop: '1px solid #444',
          maxHeight: '40vh',
          overflowY: 'auto',
          paddingTop: 10,
          flexShrink: 0,
        }}>
          <FurniturePanel />
        </div>
      )}
    </>
  );

  // Desktop: always visible
  if (!isMobile) {
    return (
      <aside
        style={{
          width: 300,
          minWidth: 300,
          height: '100vh',
          borderRight: '1px solid #333',
          padding: 16,
          boxSizing: 'border-box',
          background: '#1a1a2e',
          color: '#e0e0e0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {content}
      </aside>
    );
  }

  // Mobile: toggle overlay
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 1001,
          width: 40,
          height: 40,
          borderRadius: 8,
          border: '1px solid #444',
          background: open ? '#646cff' : '#1a1a2e',
          color: '#fff',
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 300,
          maxWidth: '85vw',
          height: '100vh',
          padding: 16,
          paddingTop: 60,
          boxSizing: 'border-box',
          background: '#1a1a2e',
          color: '#e0e0e0',
          zIndex: 1000,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {content}
      </aside>
    </>
  );
}

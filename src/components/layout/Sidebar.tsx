import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
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

export default function Sidebar({ children }: SidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Desktop: always visible
  if (!isMobile) {
    return (
      <aside
        style={{
          width: 300,
          minWidth: 300,
          height: '100vh',
          overflowY: 'auto',
          borderRight: '1px solid #333',
          padding: 16,
          boxSizing: 'border-box',
          background: '#1a1a2e',
          color: '#e0e0e0',
        }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>My Model House</h2>
        {children}
      </aside>
    );
  }

  // Mobile: toggle overlay
  return (
    <>
      {/* Toggle button */}
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

      {/* Backdrop */}
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

      {/* Slide-in panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 300,
          maxWidth: '85vw',
          height: '100vh',
          overflowY: 'auto',
          padding: 16,
          paddingTop: 60,
          boxSizing: 'border-box',
          background: '#1a1a2e',
          color: '#e0e0e0',
          zIndex: 1000,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>My Model House</h2>
        {children}
      </aside>
    </>
  );
}

import type { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
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

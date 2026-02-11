import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';

interface ViewportProps {
  children: ReactNode;
}

export default function Viewport({ children }: ViewportProps) {
  return (
    <div style={{ flex: 1, height: '100vh' }}>
      <Canvas
        camera={{ position: [6, 6, 6], fov: 50 }}
        shadows
      >
        {children}
      </Canvas>
    </div>
  );
}

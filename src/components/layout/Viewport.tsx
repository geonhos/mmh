import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useDragToScene } from '../../hooks/useDragToScene';
import SceneBridge from '../scene/SceneBridge';
import ErrorBoundary from '../ErrorBoundary';

interface ViewportProps {
  children: ReactNode;
}

export default function Viewport({ children }: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDragToScene(containerRef);

  return (
    <div ref={containerRef} style={{ flex: 1, height: '100vh' }}>
      <ErrorBoundary>
        <Canvas
          camera={{ position: [6, 6, 6], fov: 50 }}
          shadows
          gl={{ preserveDrawingBuffer: true }}
        >
          <SceneBridge />
          {children}
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

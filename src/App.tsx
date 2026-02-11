import { useState, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Viewport from './components/layout/Viewport';
import RoomConfigurator from './components/sidebar/RoomConfigurator';
import FurnitureCatalog from './components/sidebar/FurnitureCatalog';
import FurniturePanel from './components/sidebar/FurniturePanel';
import ToolBar from './components/sidebar/ToolBar';
import Room from './components/scene/Room';
import SceneLighting from './components/scene/SceneLighting';
import CameraController, { type CameraPreset } from './components/scene/CameraController';
import FurnitureItem from './components/scene/FurnitureItem';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function App() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate');
  const furnitureList = useStore((s) => s.furnitureList);
  const setSelectedId = useStore((s) => s.setSelectedId);

  const toggleMode = useCallback(() => {
    setTransformMode((m) => (m === 'translate' ? 'rotate' : 'translate'));
  }, []);

  useKeyboardShortcuts({ onToggleMode: toggleMode });

  return (
    <div className="app-layout">
      <Sidebar>
        <RoomConfigurator />
        <FurnitureCatalog />
        <ToolBar
          mode={transformMode}
          onModeChange={setTransformMode}
          cameraPreset={cameraPreset}
          onCameraChange={setCameraPreset}
        />
        <FurniturePanel />
      </Sidebar>
      <Viewport>
        <SceneLighting />
        <Room />
        {furnitureList.map((item) => (
          <FurnitureItem key={item.id} item={item} mode={transformMode} />
        ))}
        <CameraController preset={cameraPreset} />
        <gridHelper args={[20, 20, '#444', '#333']} />
        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, -0.01, 0]}
          visible={false}
          onClick={() => setSelectedId(null)}
        >
          <planeGeometry args={[50, 50]} />
        </mesh>
      </Viewport>
    </div>
  );
}

export default App;

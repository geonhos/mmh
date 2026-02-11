import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Viewport from './components/layout/Viewport';
import RoomConfigurator from './components/sidebar/RoomConfigurator';
import FurnitureCatalog from './components/sidebar/FurnitureCatalog';
import Room from './components/scene/Room';
import SceneLighting from './components/scene/SceneLighting';
import CameraController, { type CameraPreset } from './components/scene/CameraController';
import FurnitureItem from './components/scene/FurnitureItem';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const furnitureList = useStore((s) => s.furnitureList);
  const setSelectedId = useStore((s) => s.setSelectedId);

  return (
    <div className="app-layout">
      <Sidebar>
        <RoomConfigurator />
        <FurnitureCatalog />
        <section style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12, color: '#aaa' }}>카메라</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`preset-btn ${cameraPreset === 'perspective' ? 'active' : ''}`}
              onClick={() => setCameraPreset('perspective')}
            >
              3D 뷰
            </button>
            <button
              className={`preset-btn ${cameraPreset === 'top' ? 'active' : ''}`}
              onClick={() => setCameraPreset('top')}
            >
              탑 뷰
            </button>
          </div>
        </section>
      </Sidebar>
      <Viewport>
        <SceneLighting />
        <Room />
        {furnitureList.map((item) => (
          <FurnitureItem key={item.id} item={item} />
        ))}
        <CameraController preset={cameraPreset} />
        <gridHelper args={[20, 20, '#444', '#333']} />
        {/* Click on empty space to deselect */}
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

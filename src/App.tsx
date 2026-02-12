import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Viewport from './components/layout/Viewport';
import RoomConfigurator from './components/sidebar/RoomConfigurator';
import FurnitureCatalog from './components/sidebar/FurnitureCatalog';
import FurniturePanel from './components/sidebar/FurniturePanel';
import PlacedFurnitureList from './components/sidebar/PlacedFurnitureList';
import ToolBar from './components/sidebar/ToolBar';
import ShortcutHelp from './components/sidebar/ShortcutHelp';
import { ContactShadows } from '@react-three/drei';
import Room from './components/scene/Room';
import SceneLighting from './components/scene/SceneLighting';
import CameraController, { type CameraPreset } from './components/scene/CameraController';
import FurnitureItem from './components/scene/FurnitureItem';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function App() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);
  const rooms = useStore((s) => s.rooms);
  const furnitureList = useStore((s) => s.furnitureList);
  const selectedRoomId = useStore((s) => s.selectedRoomId);
  const setSelectedRoomId = useStore((s) => s.setSelectedRoomId);
  const setSelectedFurnitureId = useStore((s) => s.setSelectedFurnitureId);

  useKeyboardShortcuts(() => setShortcutHelpOpen((prev) => !prev));

  return (
    <div className="app-layout">
      <Sidebar>
        <RoomConfigurator />
        <PlacedFurnitureList />
        <FurnitureCatalog />
        <ToolBar
          cameraPreset={cameraPreset}
          onCameraChange={setCameraPreset}
          onShowShortcuts={() => setShortcutHelpOpen(true)}
        />
        <FurniturePanel />
      </Sidebar>
      <Viewport>
        <SceneLighting />
        {rooms.map((room) => (
          <Room
            key={room.id}
            room={room}
            isSelected={room.id === selectedRoomId}
            onSelect={() => setSelectedRoomId(room.id)}
          >
            {furnitureList
              .filter((f) => f.roomId === room.id)
              .map((item) => (
                <FurnitureItem key={item.id} item={item} />
              ))}
          </Room>
        ))}
        <ContactShadows
          position={[0, -0.005, 0]}
          opacity={0.4}
          scale={30}
          blur={2}
          far={4}
          resolution={256}
          color="#000000"
        />
        <CameraController preset={cameraPreset} />
        <gridHelper args={[20, 20, '#444', '#333']} />
        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, -0.01, 0]}
          visible={false}
          onClick={() => setSelectedFurnitureId(null)}
        >
          <planeGeometry args={[50, 50]} />
        </mesh>
      </Viewport>
      <ShortcutHelp open={shortcutHelpOpen} onClose={() => setShortcutHelpOpen(false)} />
    </div>
  );
}

export default App;

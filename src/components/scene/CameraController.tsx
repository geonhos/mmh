import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';

export type CameraPreset = 'perspective' | 'top';

interface CameraControllerProps {
  preset?: CameraPreset;
}

export default function CameraController({ preset = 'perspective' }: CameraControllerProps) {
  const { camera } = useThree();

  const applyPreset = useCallback(
    (p: CameraPreset) => {
      if (p === 'top') {
        camera.position.set(0, 12, 0.01);
      } else {
        camera.position.set(6, 6, 6);
      }
      camera.lookAt(0, 0, 0);
    },
    [camera]
  );

  useEffect(() => {
    applyPreset(preset);
  }, [preset, applyPreset]);

  return <OrbitControls makeDefault />;
}

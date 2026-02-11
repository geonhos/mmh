import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { Camera, WebGLRenderer } from 'three';

let _camera: Camera | null = null;
let _gl: WebGLRenderer | null = null;

export function getSceneRefs() {
  return { camera: _camera, gl: _gl };
}

export default function SceneBridge() {
  const { camera, gl } = useThree();

  useEffect(() => {
    _camera = camera;
    _gl = gl;
    return () => {
      _camera = null;
      _gl = null;
    };
  }, [camera, gl]);

  return null;
}

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { Camera, WebGLRenderer, Scene } from 'three';

let _camera: Camera | null = null;
let _gl: WebGLRenderer | null = null;
let _scene: Scene | null = null;

export function getSceneRefs() {
  return { camera: _camera, gl: _gl, scene: _scene };
}

export default function SceneBridge() {
  const { camera, gl, scene } = useThree();

  useEffect(() => {
    _camera = camera;
    _gl = gl;
    _scene = scene;
    return () => {
      _camera = null;
      _gl = null;
      _scene = null;
    };
  }, [camera, gl, scene]);

  return null;
}

import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MOVE_SPEED = 3;
const LOOK_SPEED = 0.002;
const EYE_HEIGHT = 1.6;

export default function FirstPersonControls() {
  const { camera, gl } = useThree();
  const keysRef = useRef(new Set<string>());
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const isLockedRef = useRef(false);

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 2);
    eulerRef.current.setFromQuaternion(camera.quaternion, 'YXZ');
  }, [camera]);

  const handleClick = useCallback(() => {
    gl.domElement.requestPointerLock();
  }, [gl]);

  useEffect(() => {
    const onLockChange = () => {
      isLockedRef.current = document.pointerLockElement === gl.domElement;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isLockedRef.current) return;
      eulerRef.current.y -= e.movementX * LOOK_SPEED;
      eulerRef.current.x -= e.movementY * LOOK_SPEED;
      eulerRef.current.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, eulerRef.current.x));
      camera.quaternion.setFromEuler(eulerRef.current);
    };
    const onKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    gl.domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      gl.domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [camera, gl, handleClick]);

  const _direction = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!isLockedRef.current) return;
    const keys = keysRef.current;
    const direction = _direction.current;
    direction.set(0, 0, 0);

    if (keys.has('KeyW') || keys.has('ArrowUp')) direction.z -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) direction.z += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) direction.x -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      direction.applyQuaternion(camera.quaternion);
      direction.y = 0;
      direction.normalize();
      camera.position.addScaledVector(direction, MOVE_SPEED * delta);
    }

    camera.position.y = EYE_HEIGHT;
  });

  return null;
}

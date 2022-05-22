import * as THREE from 'three';
import { scene } from '@/utils';

export const addAmbientLight = (): THREE.AmbientLight => {
  const ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);
  return ambientLight;
};

export const addPointLight = (pos: [number, number, number], config?: { color?: THREE.ColorRepresentation; intensity?: number; distance?: number; decay?: number }): THREE.PointLight => {
  const { color, intensity, distance } = config || {};
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(...pos);
  scene.add(light);
  return light;
};

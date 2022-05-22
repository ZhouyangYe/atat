import * as THREE from 'three';
import { scene } from '@/utils';

export const addTerrain = (): THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> => {
  const geometry = new THREE.BoxGeometry(6, 0.2, 6);
  const material = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, -0.2, 0);
  scene.add(mesh);
  return mesh;
}
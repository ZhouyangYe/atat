import * as THREE from 'three';
import { scene } from '@/utils';

function createPathStrings(filename: string, ext: string): string[] {
  const basePath = "@resources/static/skybox/";
  const baseFilename = basePath + filename;
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];

  const pathStings = sides.map(side => {
    return `${baseFilename}_${side}.${ext}`;
  });

  return pathStings;
}

function createMaterialArray(filename: string, ext: string): THREE.MeshBasicMaterial[] {
  const skyboxImagepaths = createPathStrings(filename, ext);
  const materialArray = skyboxImagepaths.map(image => {
    const texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
  });
  return materialArray;
}

export const addSkyBox = (image: string, ext = 'png') => {
  // const materialArray = createMaterialArray(image, ext);
  // const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  // const skybox = new THREE.Mesh(skyboxGeo, materialArray);
  // scene.add(skybox);

  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load(createPathStrings(image, ext));
  scene.background = texture;
};

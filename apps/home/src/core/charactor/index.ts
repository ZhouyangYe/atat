import * as THREE from 'three';
import { scene, fbxLoader } from '@/utils';

export const addCharactor = (path: string): Promise<{ mixer:THREE.AnimationMixer; object: THREE.Group }> => {
  let mixer: THREE.AnimationMixer;

  return new Promise((res, rej) => {
    fbxLoader.load(path, function (object) {
      object.scale.set(0.02, 0.02, 0.02);
      object.position.set(0, -0.1, 0);
      mixer = new THREE.AnimationMixer(object);
      const action = mixer.clipAction(object.animations[0]);
      action.play();
      scene.add(object);
      res({ mixer, object });
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    }, function (error) {
      console.error(error);
      rej(error);
    });
  });
};
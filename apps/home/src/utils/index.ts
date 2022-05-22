import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export const
  app = document.querySelector<HTMLDivElement>('#app')!,
  ui = document.querySelector<HTMLDivElement>('#ui')!,
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000),
  scene = new THREE.Scene(),
  fbxLoader = new FBXLoader(),
  clock = new THREE.Clock(),
  axis = new THREE.AxesHelper(1),
  renderer = new THREE.WebGLRenderer({ antialias: true }),
  controls = new OrbitControls(camera, renderer.domElement),
  stats = Stats(),
  gameState: any = {};

stats.dom.style.display = 'none';

controls.enableDamping = true;
controls.target.set(0, 2, 0);

camera.position.set(0.0, 3.0, 8.0);

renderer.setSize(window.innerWidth, window.innerHeight);

scene.background = new THREE.Color(0xffffff);
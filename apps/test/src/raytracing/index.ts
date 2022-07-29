import * as THREE from 'three';

let width: number, height: number, scene: THREE.Scene, camera: THREE.Camera;
const renderer = new THREE.WebGLRenderer();
export const canvas = renderer.domElement;

const windowResize = () => {
  width = window.innerWidth;
  height = window.innerHeight
  renderer.setSize(width, height);
};

const vertexShader = `
  void main()
  {
    gl_Position = vec4(position, 1.0f);
  }
`;

const fragmentShader = `
  void main()
  {
    pc_fragColor = vec4(0.8f, 0.9f, 0.9f, 1.0f);
  }
`;

export const init = (w: number, h: number) => {
  width = w;
  height = h;

  window.removeEventListener('resize', windowResize, false);
  window.addEventListener('resize', windowResize, false);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    },
    vertexShader,
    fragmentShader,
  });

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

  renderer.setSize(w, h);

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    -1.0, -1.0, 1.0,
     1.0, -1.0, 1.0,
     1.0,  1.0, 1.0,

     1.0,  1.0, 1.0,
    -1.0,  1.0, 1.0,
    -1.0, -1.0, 1.0
  ]);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 6;
};

export const render = () => {
  renderer.render(scene, camera);
};


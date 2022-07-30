import * as THREE from 'three';

let width: number, height: number, scene: THREE.Scene, camera: THREE.Camera;
const renderer = new THREE.WebGLRenderer();
export const canvas = renderer.domElement;

const vertexShader = `
  void main()
  {
    gl_Position = vec4(position, 1.0f);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;

  #define PI 3.1415926535897932384626433832795

  float getDist(vec3 source, vec4 sphere)
  {
    return length(source - sphere.xyz) - sphere.w;
  }

  vec3 rayMarch(vec3 eye, vec3 ray, vec4 sphere)
  {
    vec3 src = eye;
    float dist = 0.f;

    for (int i = 0; i < 100; i++) {
      dist = getDist(src, sphere);
      src = src + ray * dist;

      if (dist < 0.01f) {
        return src;
      }
    }

    return vec3(0.f, 0.f, -1.f);
  }

  void main()
  {
    vec3 eye = vec3(0.f, 0.f, -200.f);
    vec4 sphere = vec4(0.f, 0.f, 300.f, 200.f);
    vec3 pointLight = vec3(160.f, 300.f, 50.f);

    float deltaArc = time / 10000.f * 2.f * PI;
    pointLight.xz += vec2(sin(deltaArc), cos(deltaArc)) * 300.f;

    vec3 fragCoord = vec3(gl_FragCoord.x - resolution.x / 2.f, gl_FragCoord.y - resolution.y / 2.f, 0.f);
    vec3 ray = normalize(fragCoord - eye);

    vec3 hit = rayMarch(eye, ray, sphere);

    if (hit.z < 0.f) {
      pc_fragColor = vec4(0.8f, 0.9f, 0.9f, 1.0f);
    } else {
      vec3 normal = normalize(hit - sphere.xyz);
      vec3 light = normalize(pointLight - hit);

      float dif = clamp(dot(normal, light), 0., 1.);

      pc_fragColor = vec4(dif, dif, dif, 1.0f);
    }
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  },
  vertexShader,
  fragmentShader,
});

const windowResize = () => {
  width = window.innerWidth;
  height = window.innerHeight
  renderer.setSize(width, height);
  material.uniforms.resolution.value = new THREE.Vector2(width, height);
};

export const init = (w: number, h: number) => {
  width = w;
  height = h;
  material.uniforms.resolution.value = new THREE.Vector2(width, height);

  window.removeEventListener('resize', windowResize, false);
  window.addEventListener('resize', windowResize, false);

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
  material.uniforms.time.value = new Date().getTime() % 10000;
  renderer.render(scene, camera);
};


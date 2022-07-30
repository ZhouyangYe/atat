import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { doAnimationInterval } from 'atat-common/lib/utils';

import './index.less';

interface Props {
  desc: string;
  vertexShader: string;
  fragmentShader: string;
}

const ShaderPanel: React.FC<Props> = ({ desc, vertexShader, fragmentShader }) => {
  const container = useRef<HTMLDivElement>(null);
  const state = useRef<{
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
  }>({
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, 1, 0.1, 1000),
    renderer: new THREE.WebGLRenderer(),
    material: new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader,
      fragmentShader,
    }),
  });

  useEffect(() => {
    const { scene, camera, renderer, material } = state.current;

    const windowResize = () => {
      const { clientWidth, clientHeight } = container.current!;
      renderer.setSize(clientWidth, clientHeight);
      material.uniforms.resolution.value = new THREE.Vector2(clientWidth, clientHeight);
    };
    window.addEventListener('resize', windowResize, false);

    windowResize();

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

    const render = () => {
      material.uniforms.time.value = new Date().getTime() % 10000;
      renderer.render(scene, camera);
    };

    const cancel = doAnimationInterval(render, 0);

    container.current?.appendChild(renderer.domElement);

    return () => {
      window.removeEventListener('resize', windowResize, false);
      cancel();
    };
  }, []);

  return (
    <div className='atat-shader'>
      <div className='panel' ref={container}></div>
      <div className='desc'>{desc}</div>
    </div>
  );
};

export default ShaderPanel;

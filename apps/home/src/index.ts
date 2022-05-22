import * as THREE from 'three';
import { scene, camera, clock, app, renderer, controls, stats, gameState } from './utils';
import { addCharactor } from './core/charactor';
import { addAmbientLight, addPointLight } from './core/light';
import { addTerrain } from './core/terrain';
import { handleKeyup } from './core/handlers';
import { addSkyBox } from './core/skybox';

import './styles';

const loadingPage = document.querySelector<HTMLDivElement>('#loading'), progress = document.querySelector<HTMLDivElement>('#progress');
let mixer: THREE.AnimationMixer | undefined = undefined;
let object: THREE.Group | undefined = undefined;
let loading = true;
addCharactor('@resources/static/model/dancing.fbx').then((result) => {
  mixer = result.mixer;
  object = result.object;
});

gameState.ambientLight = addAmbientLight();
gameState.pointLight = [addPointLight([-8, 6, 2], { intensity: 10, distance: 16 })];
gameState.terrain = addTerrain();
gameState.skybox = addSkyBox('heaven', 'jpg');
gameState.player = { mixer, object };
gameState.loading = {
  player: 0,
};

app.appendChild(renderer.domElement);
app.appendChild(stats.dom);

function tick(time?: number) {
  if (loading) {
    progress!.innerHTML = `${gameState.loading.player.toFixed(1)}%`;
    if (gameState.loading.player === 100) {
      setTimeout(() => {
        loadingPage!.style.opacity = '0';
        setTimeout(() => {
          loadingPage!.style.display = 'none';
        }, 200);
      }, 1000);
      loading = false;
    }
  }
  stats.update();
  controls.update();
  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();

// events
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  object?.updateMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  tick();
}

window.addEventListener('keydown', (e) => {
  e.preventDefault();
  e.stopPropagation();
}, false);

window.addEventListener('keyup', (e) => {
  e.preventDefault();
  e.stopPropagation();
  handleKeyup(e.key.toLowerCase());
}, false);

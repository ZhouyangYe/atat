import { scene, stats, axis, gameState } from '@/utils';

let showAxis = false;
let showLight = true;

export const handleKeyup = (key: string): void => {
  switch (key) {
    case 'f1':
      if (!showAxis) {
        scene.add(axis);
        stats.dom.style.display = 'block';
      } else {
        scene.remove(axis);
        stats.dom.style.display = 'none';
      }
      showAxis = !showAxis;
      break;
    case 'l':
      if (!showLight) {
        scene.add(gameState.pointLight[0]);
      } else {
        scene.remove(gameState.pointLight[0]);
      }
      showLight = !showLight;
      break;
    case 'f':
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
      break;
    default:
      break;
  }
};

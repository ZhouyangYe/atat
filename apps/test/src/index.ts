import { doAnimationInterval } from 'atat-common/lib/utils';
import * as physics from './physics';
import * as rayTracing from './raytracing';

import './styles';

let canvas: HTMLCanvasElement;
let cancel: () => void;

const list = [
  physics,
  rayTracing,
];

const testcase = list[1];

const restart = () => {
  if (cancel) cancel();
  document.removeChild(canvas);

  start();
}

const start = () => {
  canvas = testcase.canvas;
  document.body.appendChild(canvas);

  const width = window.innerWidth, height = window.innerHeight;

  testcase.init(width, height);

  const render = () => {
    testcase.render();
  };

  cancel = doAnimationInterval(render, 0);
};

start();
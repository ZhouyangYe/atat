import { doAnimationInterval } from 'atat-common/lib/utils';
import * as physics from './physics';
import * as shaderToy from './shaderToy';

import './styles';

const buttons = document.querySelectorAll<HTMLDivElement>('.btn');

let canvas: HTMLCanvasElement;
let cancel: () => void;

const list = [
  shaderToy,
  physics,
];

let testcase = list[0];
buttons[0].classList.add('active');

const start = () => {
  canvas = testcase.canvas;
  document.body.appendChild(canvas);

  const width = window.innerWidth, height = window.innerHeight;

  testcase.init(width, height);

  const render = (timestamp: number) => {
    testcase.render(timestamp);
  };

  cancel = doAnimationInterval(render, 0);
};

const restart = () => {
  if (cancel) cancel();
  document.body.removeChild(canvas);

  start();
}

start();

buttons.forEach((button, i) => {
  button.onclick = () => {
    testcase = list[i];
    buttons.forEach((btn) => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    restart();
  };
});

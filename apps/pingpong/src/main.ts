import { drawLine, clearPanel } from './utils';
import { start } from './core';
import { IElements } from './interface';

const init = (table: HTMLCanvasElement, elements: IElements, socket: SocketIOClient.Socket): void => {
  if (table.getContext) {
    const ctx = table.getContext('2d');

    clearPanel(ctx, table.width, table.height);

    // draw line
    drawLine(ctx, { x: 0, y: 350 }, { x: 600, y: 350 }, 3);

    elements.readyIcon.onclick = () => {
      elements.readyIcon.style.display = 'none';
      start(ctx, elements, socket);
    };
  } else {
    alert('Your browser does not support canvas!');
  }
};

export default init;

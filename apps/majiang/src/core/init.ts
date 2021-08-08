import { drawLine, clearPanel, IElements } from '@/utils';
import { start } from './start';

export const init = (table: HTMLCanvasElement, elements: IElements, socket: SocketIOClient.Socket): void => {
  if (table.getContext) {
    const ctx = table.getContext('2d');
    let messageTimer: NodeJS.Timer = null;

    clearPanel(ctx, table.width, table.height);

    // draw net
    drawLine(ctx, { x: 0, y: 350 }, { x: 600, y: 350 }, 3);

    socket.on('hasSlots', (data: boolean) => {
      if (data) {
        elements.readyIcon.style.display = 'block';
      }
    });

    socket.on('enemyName', (name: string) => {
      elements.oppoName.innerHTML = name;
    });

    elements.readyIcon.onclick = () => {
      const name = elements.name.value;
      if (!name) {
        elements.errorMessage.style.display = 'block';
        elements.errorMessage.innerHTML = 'Please enter your name!';
        clearTimeout(messageTimer);
        messageTimer = setTimeout(() => {
          elements.errorMessage.style.display = 'none';
        }, 2000);
        return;
      }
      elements.readyIcon.style.display = 'none';
      socket.emit('ready', name);
      start(ctx, elements, socket);
    };
  } else {
    alert('Your browser does not support canvas!');
  }
};

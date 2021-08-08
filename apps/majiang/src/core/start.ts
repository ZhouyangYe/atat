import { doAnimationInterval } from 'atat-common/lib/utils';
import { clearPanel, drawLine, IElements } from '@/utils';
import Ball from './ball';
import Blade, { PLAYER_TYPE } from './blade';

const fadeOut = (announcement: HTMLElement) => {
  setTimeout(() => {
    announcement.className = 'hide';
  }, 3000);
};

export const start = (ctx: CanvasRenderingContext2D, elements: IElements, socket: SocketIOClient.Socket): void => {
  socket.off('ballMove');
  socket.off('myBladeUpdate');
  socket.off('enemyBladeUpdate');
  socket.off('readyToServe');
  socket.off('win');
  socket.off('lose');

  const ball = new Ball(ctx);
  const myBlade = new Blade(ctx, PLAYER_TYPE.SELF);
  const enemyBlade = new Blade(ctx, PLAYER_TYPE.ENEMY);

  let stop: () => void;

  drawLine(ctx, { x: 0, y: 350 }, { x: 600, y: 350 }, 3);

  socket.on('readyToServe', (isMyServe: boolean) => {
    if (stop) stop();
    stop = doAnimationInterval(() => {
      clearPanel(ctx, 600, 700);
      // draw net
      drawLine(ctx, { x: 0, y: 350 }, { x: 600, y: 350 }, 3);
      ball.update();
      myBlade.update();
      enemyBlade.update();
    });

    document.onmousemove = (event) => {
      const x = event.clientX - elements.tableWrap.offsetLeft - myBlade.getWidth() / 2;
      socket.emit('bladeMove', x);
    };

    socket.on('myBladeUpdate', (x: number, position?: { x: number, y: number }) => {
      if (position) ball.setPosition(position.x, position.y);
      myBlade.setPosition(x);
    });

    socket.on('enemyBladeUpdate', (x: number, position?: { x: number, y: number }) => {
      if (position) ball.setPosition(position.x, position.y);
      enemyBlade.setPosition(x);
    });

    socket.on('win', () => {
      document.onmousemove = undefined;
      document.onkeydown = undefined;
      elements.announcement.innerHTML = 'You win!!!';
      elements.announcement.className = 'show';
      fadeOut(elements.announcement);
      stop();
    });

    socket.on('lose', () => {
      document.onmousemove = undefined;
      document.onkeydown = undefined;
      elements.announcement.innerHTML = 'You lose!!!';
      elements.announcement.className = 'show';
      fadeOut(elements.announcement);
      stop();
    });

    socket.on('ballMove', (position: { x: number, y: number }) => {
      ball.setPosition(position.x, position.y);
    });

    document.onkeydown = (event) => {
      if (isMyServe && event.code === 'Space') {
        socket.emit('start');
      }
    };
  });
};

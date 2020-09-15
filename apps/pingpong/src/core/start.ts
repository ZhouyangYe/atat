import { doAnimationInterval } from 'atat-common/lib/utils';
import { clearPanel } from '@/utils';
import { IElements } from '@/interface';
import Ball from './ball';

export const start = (ctx: CanvasRenderingContext2D, elements: IElements, socket: SocketIOClient.Socket): void => {
  const ball = new Ball(ctx, 600, 700);
  const stop = doAnimationInterval(() => {
    clearPanel(ctx, 600, 700);

    // bouncing
    if (ball.isLeftCollide() || ball.isRightCollide()) {
      ball.setDirection(Math.PI - ball.getDirection());
    }
    if (ball.isTopCollide() || ball.isBottomCollide()) {
      ball.setDirection(-ball.getDirection());
    }

    ball.move();
    ball.update();
  });
};

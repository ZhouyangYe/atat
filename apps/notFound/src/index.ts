import { doAnimationInterval } from 'atat-common/lib/utils';
import { COLOR } from './enum';
import { handler } from './handler';
import { Circle } from './shapes/Circle';
import { Polygon } from './shapes/Polygon';

import './styles';

const canvas = document.getElementById('app') as HTMLCanvasElement;
if (canvas.getContext) {
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth, height = window.innerHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  const windowResize = () => {
    width = window.innerWidth;
    height = window.innerHeight
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
  };
  window.addEventListener('resize', windowResize);

  const objects = [
    new Circle(ctx, { x: 100, y: 100 }, 50),
    new Circle(ctx, { x: 200, y: 100 }, 18),
    // new Polygon(ctx, { x: 300, y: 100 }, [
    //   { x: 0, y: 0 },
    //   { x: 100, y: 50 },
    //   { x: 100, y: 60 },
    //   { x: 50, y: 100 },
    //   { x: 0, y: 90 },
    // ]),
    new Polygon(ctx, { x: 500, y: 100 }, [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 90, y: 90 },
      { x: 50, y: 100 },
      { x: 0, y: 96 },
    ]),
    new Polygon(ctx, { x: 600, y: 100 }, [
      { x: 20, y: 0 },
      { x: 100, y: 0 },
      { x: 80, y: 100 },
      { x: 50, y: 130 },
      { x: 30, y: 110 },
    ]),
    // new Polygon(ctx, { x: 700, y: 100 }, [
    //   { x: 25, y: 0 },
    //   { x: 100, y: 50 },
    //   { x: 80, y: 100 },
    //   { x: 50, y: 118 },
    //   { x: 0, y: 100 },
    // ]),
    // new Polygon(ctx, { x: 900, y: 100 }, [
    //   { x: 0, y: 0 },
    //   { x: 30, y: 0 },
    //   { x: 30, y: 60 },
    //   { x: 0, y: 60 },
    // ]),
  ];
  const offset = { x: 0, y: 0 };
  let isDragging = false;
  let overObjectIndex = -1;

  canvas.addEventListener('mousedown', e => {
    if (overObjectIndex !== -1) {
      isDragging = true;
      const position = objects[overObjectIndex].position;
      offset.x = position.x - e.offsetX;
      offset.y = position.y - e.offsetY;
    }
  });
  
  canvas.addEventListener('mousemove', e => {
    if (isDragging) {
      const obj = objects[overObjectIndex];
      obj.setPos({ x: e.offsetX + offset.x, y: e.offsetY + offset.y });
      return;
    }

    overObjectIndex = -1;
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (obj.overlap({ x: e.offsetX, y: e.offsetY })) {
        overObjectIndex = i;
      }
    }
  });
  
  window.addEventListener('mouseup', e => {
    isDragging = false;
  });

  const render = () => {
    // reset color
    objects.forEach((obj, i) => {
      obj.setColor(COLOR.NORMAL);
    });

    // detect collision
    for (let i = 0; i < objects.length; i++) {
      if (isDragging && i === overObjectIndex) {
        objects[i].velocity.x = 0;
        objects[i].velocity.y = 0;
      } else {
        handler.gravity(objects[i]);
      }

      if (handler.boundary(objects[i], width, height)) {
        objects[i].setColor(COLOR.COLLIDE);
      }

      for (let j = i + 1; j < objects.length; j++) {
        if (handler.collide(objects[i], objects[j])) {
          objects[i].setColor(COLOR.COLLIDE);
          objects[j].setColor(COLOR.COLLIDE);
          objects[i].velocity.y = 0;
          objects[j].velocity.y = 0;
        }
      }
    }

    objects.forEach((obj, i) => {
      if (!isDragging && overObjectIndex === i) {
        obj.setColor(COLOR.OVERLAP);
        return;
      }
    });

    ctx.clearRect(0, 0, width, height);

    objects.forEach((obj, i) => {
      if (i === overObjectIndex) return;
      obj.draw();
    });
    if (overObjectIndex !== -1) objects[overObjectIndex].draw();
  };

  doAnimationInterval(render, 0);
}

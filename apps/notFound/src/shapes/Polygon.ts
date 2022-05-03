import { Vector, SHAPE } from '../enum';
import { Base } from './Base';

export type Dots = Vector[];

export class Polygon extends Base {
  private dots: Dots;
  private deg = 0;
  private top = -1;
  private bottom = -1;
  private left = -1;
  private right = -1;

  get d(): Dots {
    return this.dots;
  }

  get t(): number {
    return this.top;
  }

  get b(): number {
    return this.bottom;
  }

  get l(): number {
    return this.left;
  }

  get r(): number {
    return this.right;
  }

  private static calcPolygonArea(dots: Dots): number {
    let total = 0;

    for (let i = 0, l = dots.length; i < l; i++) {
      const addX = dots[i].x;
      const addY = dots[i == dots.length - 1 ? 0 : i + 1].y;
      const subX = dots[i == dots.length - 1 ? 0 : i + 1].x;
      const subY = dots[i].y;

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
}

  private intersect(p: Vector, i1: number, i2: number): boolean {
    const dot1 = this.dots[i1], dot2 = this.dots[i2], dot3 = this.dots[i2 === this.dots.length - 1 ? 0 : i2 + 1];
    const diffX = this.pos.x - p.x, diffY = this.pos.y - p.y;
    const diffX1 = dot1.x + diffX;
    const diffX2 = dot2.x + diffX;
    const diffY1 = dot1.y + diffY;
    const diffY2 = dot2.y + diffY;
    const diffY3 = dot3.y + diffY;
    const diffX12 = dot1.x - dot2.x;
    const diffY12 = dot1.y - dot2.y;
    const productY = diffY1 * diffY2;

    if (
      (diffX2 >= 0 && diffY2 === 0 && diffY1 * diffY3 < 0) ||
      (diffX1 >= 0 && diffX2 >= 0 && productY < 0) ||
      (diffX1 > 0 && diffX2 < 0 && productY < 0 && Math.abs(diffY1) / Math.abs(diffX1) < Math.abs(diffY12) / Math.abs(diffX12)) ||
      (diffX1 < 0 && diffX2 > 0 && productY < 0 && Math.abs(diffY2) / Math.abs(diffX2) < Math.abs(diffY12) / Math.abs(diffX12))
    ) {
      return true;
    }

    return false;
  }

  overlap(p: Vector): boolean {
    let count = 0;

    this.dots.forEach((dot, i) => {
      if (this.intersect(p, i, i === this.dots.length - 1 ? 0 : i + 1)) {
        count++;
      }
    });

    return count % 2 === 1;
  }

  constructor(c: CanvasRenderingContext2D, p: Vector, d: Dots) {
    super(SHAPE.POL, c, p, Polygon.calcPolygonArea(d));
    this.dots = d;
    d.forEach((dot) => {
      if (dot.x < this.left || this.left === -1) this.left = dot.x;
      if (dot.x > this.right || this.right === -1) this.right = dot.x;
      if (dot.y < this.top || this.top === -1) this.top = dot.y;
      if (dot.y > this.bottom || this.bottom === -1) this.bottom = dot.y;
    });
  }

  draw(): void {
    super.draw();
    
    this.ctx.beginPath();
    this.dots.forEach((dot, i) => {
      if (i === 0) {
        this.ctx.moveTo(this.pos.x + dot.x, this.pos.y + dot.y);
        return;
      }
      this.ctx.lineTo(this.pos.x + dot.x, this.pos.y + dot.y);
    });
    this.ctx.closePath();

    this.ctx.fill();
  }
}

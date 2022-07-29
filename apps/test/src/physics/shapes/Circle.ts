import { Vector, SHAPE } from '../enum';
import { Base } from './Base';

export class Circle extends Base {
  private radius: number;
  private r2: number;

  get r(): number {
    return this.radius;
  }

  overlap(p: Vector): boolean {
    return Math.pow(this.pos.x - p.x, 2) + Math.pow(this.pos.y - p.y, 2) < this.r2;
  }

  constructor(c: CanvasRenderingContext2D, p: Vector, r: number) {
    const r2 = Math.pow(r, 2);
    super(SHAPE.CIR, c, p, Math.PI * r2);
    this.radius = r;
    this.r2 = r2;
  }

  draw(): void {
    super.draw();

    const startAngle = 0; // Starting point on circle
    const endAngle = 2 * Math.PI; // End point on circle

    this.ctx.arc(this.pos.x, this.pos.y, this.radius, startAngle, endAngle, true);

    this.ctx.fill();
  }
}

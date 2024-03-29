import { Vector, SHAPE, COLOR } from '../enum';

export class Base {
  protected isStatic: boolean;
  protected weight: number;
  protected ctx: CanvasRenderingContext2D;
  protected type: SHAPE;
  protected pos: Vector;
  public velocity: Vector = { x: 0, y: 0 };
  private color: COLOR = COLOR.NORMAL;

  get position(): Vector {
    return this.pos;
  }

  get shape(): SHAPE {
    return this.type;
  }

  get mass(): number {
    return this.weight;
  }

  setColor(c: COLOR): void {
    this.color = c;
  }

  setPos(p: Vector): void {
    this.pos = p;
  }

  updatePos(): void {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

  constructor(t: SHAPE, c: CanvasRenderingContext2D, p: Vector, w: number, s = false) {
    this.type = t;
    this.pos = p;
    this.ctx = c;
    this.isStatic = s;
    this.weight = w;
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
  }
}

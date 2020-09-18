export enum PLAYER_TYPE {
  ENEMY = 'enemy',
  SELF = 'self',
}

class Blade {
  private ctx: CanvasRenderingContext2D;
  private gap = 2;
  private width = 100;
  private radius = 4;
  private thickness = 10;
  private x: number;
  private y: number;

  constructor(ctx: CanvasRenderingContext2D, type: PLAYER_TYPE) {
    this.ctx = ctx;
    this.x = (600 - this.width) / 2;
    this.y = type === PLAYER_TYPE.ENEMY ? this.gap : 700 - this.thickness - this.gap;
  }

  getWidth = (): number => {
    return this.width;
  };

  setPosition = (x: number): void => {
    this.x = x;
  };

  update = (): void => {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#e83a13';
    this.ctx.moveTo(this.x, this.y + this.radius);
    this.ctx.lineTo(this.x, this.y + this.thickness - this.radius);
    this.ctx.arcTo(this.x, this.y + this.thickness, this.x + this.radius, this.y + this.thickness, this.radius);
    this.ctx.lineTo(this.x + this.width - this.radius, this.y + this.thickness);
    this.ctx.arcTo(this.x + this.width, this.y + this.thickness, this.x + this.width, this.y + this.thickness - this.radius, this.radius);
    this.ctx.lineTo(this.x + this.width, this.y + this.radius);
    this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width - this.radius, this.y, this.radius);
    this.ctx.lineTo(this.x + this.radius, this.y);
    this.ctx.arcTo(this.x, this.y, this.x, this.y + this.radius, this.radius);
    this.ctx.fill();
  };
}

export default Blade;

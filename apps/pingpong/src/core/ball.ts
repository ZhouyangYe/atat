interface IBound {
  xLeft: number;
  xRight: number;
  yTop: number;
  yBottom: number;
}

class Blade {
  private ctx: CanvasRenderingContext2D;
  private radius = 9;
  private radian = Math.PI / 4;
  private x = 100;
  private y = 100;
  private speed = 10;
  private bound: IBound;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, x?: number, y?: number) {
    this.ctx = ctx;
    if (x) this.x = x;
    if (y) this.y = y;
    this.setBound(width, height);
  }

  private setBound = (width: number, height: number): void => {
    const xLeft = this.radius;
    const xRight = width - this.radius;
    const yTop = this.radius;
    const yBottom = height - this.radius;
    this.bound = { xLeft, xRight, yTop, yBottom };
  }

  getSpeed = (): number => {
    return this.speed;
  };

  getDirection = (): number => {
    return this.radian;
  };

  getPosition = (): { x: number, y: number } => {
    return {
      x: this.x,
      y: this.y,
    };
  };

  isCollide = (): boolean => {
    return (
      this.x === this.bound.xLeft ||
      this.x === this.bound.xRight ||
      this.y === this.bound.yTop ||
      this.y === this.bound.yBottom
    );
  };

  isLeftCollide = (): boolean => {
    return this.x === this.bound.xLeft;
  };

  isRightCollide = (): boolean => {
    return this.x === this.bound.xRight;
  };

  isTopCollide = (): boolean => {
    return this.y === this.bound.yTop;
  };

  isBottomCollide = (): boolean => {
    return this.y === this.bound.yBottom;
  };

  setPosition = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
    if (this.x < this.bound.xLeft) this.x = this.bound.xLeft;
    if (this.x > this.bound.xRight) this.x = this.bound.xRight;
    if (this.y < this.bound.yTop) this.x = this.bound.yTop;
    if (this.x > this.bound.yBottom) this.x = this.bound.yBottom;
  };

  setDirection = (direction: number): void => {
    this.radian = direction;
  };

  setSpeed = (speed: number): void => {
    this.speed = speed;
  };

  move = (): void => {
    this.x += Math.cos(this.radian) * this.speed;
    this.y += Math.sin(this.radian) * this.speed;
    if (this.x < this.bound.xLeft) this.x = this.bound.xLeft;
    if (this.x > this.bound.xRight) this.x = this.bound.xRight;
    if (this.y < this.bound.yTop) this.y = this.bound.yTop;
    if (this.y > this.bound.yBottom) this.y = this.bound.yBottom;
  };

  update = (): void => {
    const start = { x: this.x - this.radius, y: this.y - this.radius };
    const end = { x: this.x + this.radius, y: this.y + this.radius };
    const linearGrad = this.ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    linearGrad.addColorStop(0, '#888');
    linearGrad.addColorStop(1, 'rgb(255, 251, 0)');
    this.ctx.beginPath();
    this.ctx.fillStyle = linearGrad;
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  };
}

export default Blade;

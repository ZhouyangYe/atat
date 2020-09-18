class Blade {
  private ctx: CanvasRenderingContext2D;
  private radius = 9;
  private x = 9;
  private y = 9;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  setPosition = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
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

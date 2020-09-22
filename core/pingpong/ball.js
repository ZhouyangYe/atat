class Ball {
  constructor() {
    this.x = 300;
    this.y = 350;
    this.radius = 9;
    this.radian = Math.PI / 4;
    this.speed = 10;
    this.setBound(600, 700);
  }

  getSpeed() {
    return this.speed;
  }

  getRadius() {
    return this.radius;
  }
  
  setBound(width, height) {
    const xLeft = this.radius;
    const xRight = width - this.radius;
    const yTop = this.radius;
    const yBottom = height - this.radius;
    this.bound = { xLeft, xRight, yTop, yBottom };
  }

  getDirection() {
    return this.radian;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getReversePosition() {
    return {
      x: 600 - this.x,
      y: 700 - this.y,
    };
  }

  isCollide() {
    return (
      this.x === this.bound.xLeft ||
      this.x === this.bound.xRight ||
      this.y === this.bound.yTop ||
      this.y === this.bound.yBottom
    );
  }

  isLeftCollide() {
    return this.x === this.bound.xLeft;
  }

  isRightCollide() {
    return this.x === this.bound.xRight;
  }

  isTopCollide() {
    return this.y === this.bound.yTop;
  }

  isBottomCollide() {
    return this.y === this.bound.yBottom;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    if (this.x < this.bound.xLeft) this.x = this.bound.xLeft;
    if (this.x > this.bound.xRight) this.x = this.bound.xRight;
    if (this.y < this.bound.yTop) this.x = this.bound.yTop;
    if (this.x > this.bound.yBottom) this.x = this.bound.yBottom;
  }

  resetPosition() {
    this.x = 300;
    this.y = 350;
  }

  move() {
    this.x += Math.cos(this.radian) * this.speed;
    this.y += Math.sin(this.radian) * this.speed;
    if (this.x < this.bound.xLeft) this.x = this.bound.xLeft;
    if (this.x > this.bound.xRight) this.x = this.bound.xRight;
    if (this.y < this.bound.yTop) this.y = this.bound.yTop;
    if (this.y > this.bound.yBottom) this.y = this.bound.yBottom;
  }

  setDirection(direction) {
    this.radian = direction;
  }

  setSpeed(speed) {
    this.speed = speed;
  }
}

module.exports = Ball;

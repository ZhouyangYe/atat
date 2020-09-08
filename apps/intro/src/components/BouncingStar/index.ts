import { doAnimationInterval } from 'atat-common/lib/utils';

import './index.less';

const STAR_STATE_MAP = [0, 0.2, 0.4, 0.6, 0.8, 1];

class BouncingStar {
  private container: HTMLElement;

  private star: HTMLElement;

  private xSpeed = 6;

  private ySpeed = 3;

  private gravity = 1;

  private fraction = 0.8;

  private circleStarted = false;

  private starState = 0;

  private starOpacity = 0;

  private circleState = 0;

  private circleTimer: NodeJS.Timer = null;

  private circles: HTMLElement[] = [];

  private radius = 60;

  private cancelAnimation: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.createStar();
    this.handleDrawCircle();
  }

  getDom = (): HTMLElement => {
    return this.star;
  };

  private getRightBoundary = (): number => {
    return this.container.clientWidth - 100;
  };

  private getBottomBoundary = (): number => {
    return window.innerHeight - this.container.offsetTop - 100;
  };

  private initState = () => {
    this.star.style.backgroundImage = `url('@resources/static/icons/star/star-3.gif')`;
  };

  private startAnimation = () => {
    if (this.cancelAnimation) this.cancelAnimation();
    this.cancelAnimation = doAnimationInterval(() => {
      const rightBound = this.getRightBoundary();
      const bottomBound = this.getBottomBoundary();

      const { offsetLeft, offsetTop } = this.star;
      let left = Math.round(offsetLeft + this.xSpeed);
      let top = Math.floor(offsetTop + this.ySpeed);

      if (left < 0) left = 0;
      if (left > rightBound) left = rightBound;
      if (top < 0) top = 0;
      if (top > bottomBound) top = bottomBound;

      this.star.style.left = `${left}px`;
      this.star.style.top = `${top}px`;

      if (left === 0 || left === rightBound || top === 0 || top === bottomBound) {
        this.xSpeed *= this.fraction;
        this.ySpeed = (this.ySpeed - this.gravity) * this.fraction;
        if (Math.abs(this.xSpeed) < 0.01) this.xSpeed = 0;
        if (Math.abs(this.ySpeed) < 0.01) this.ySpeed = 0;
      }
      if (left === 0 || left === rightBound) this.xSpeed = -this.xSpeed;
      if (top === 0 || top === bottomBound) this.ySpeed = -this.ySpeed;

      if (this.xSpeed > 0 && this.ySpeed <= 0 && this.star.style.transform !== `rotateX(0deg) rotateY(180deg)`) {
        this.star.style.transform = `rotateX(0deg) rotateY(180deg)`;
      }
      if (this.xSpeed <= 0 && this.ySpeed < 0 && this.star.style.transform !== `rotateX(0deg) rotateY(0deg)`) {
        this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
      }
      if (this.xSpeed > 0 && this.ySpeed >= 0 && this.star.style.transform !== `rotateX(180deg) rotateY(180deg)`) {
        this.star.style.transform = `rotateX(180deg) rotateY(180deg)`;
      }
      if (this.xSpeed <= 0 && this.ySpeed > 0 && this.star.style.transform !== `rotateX(180deg) rotateY(0deg)`) {
        this.star.style.transform = `rotateX(180deg) rotateY(0deg)`;
      }

      if (top === bottomBound && this.xSpeed === 0 && this.ySpeed === 0) {
        if (this.star.style.backgroundImage !== `url("@resources/static/icons/star/star-4.gif")`) {
          this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
          this.star.style.backgroundImage = `url("@resources/static/icons/star/star-4.gif")`;
        }
      } else if (this.star.style.backgroundImage !== `url("@resources/static/icons/star/star-2.gif")`) {
        console.log('in');
        this.star.style.backgroundImage = `url("@resources/static/icons/star/star-2.gif")`;
      }

      this.ySpeed += this.gravity;
    });
  };

  private createStar = () => {
    this.star = document.createElement('div');
    this.star.id = 'star';

    this.star.style.backgroundRepeat = 'no-repeat';
    this.star.style.backgroundSize = 'contain';
    this.initState();

    this.star.onclick = (evt) => { evt.stopPropagation(); };

    this.star.onmousedown = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (this.cancelAnimation) this.cancelAnimation();
      this.star.style.cursor = 'grabbing';
      this.star.style.backgroundImage = `url('@resources/static/icons/star/star-1.gif')`;
      this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
      const xDelta = evt.offsetX;
      const yDelta = evt.offsetY;

      let prevX: number;
      let prevY: number;
      const handleMouseMove = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        const { clientX, clientY } = event;
        if (!prevX) prevX = clientX;
        if (!prevY) prevY = clientY;
        this.xSpeed = (clientX - prevX) * 0.3;
        this.ySpeed = (clientY - prevY) * 0.3;
        prevX = clientX;
        prevY = clientY;
        let left = Math.floor(clientX - xDelta);
        let top = Math.floor(clientY - yDelta - this.container.offsetTop);

        const rightBound = this.getRightBoundary();
        const bottomBound = this.getBottomBoundary();

        if (left < 0) left = 0;
        if (left > rightBound) left = rightBound;
        if (top < 0) top = 0;
        if (top > bottomBound) top = bottomBound;

        this.star.style.left = `${left}px`;
        this.star.style.top = `${top}px`;
      };
      this.container.addEventListener('mousemove', handleMouseMove, false);
      
      const handleMouseUp = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.star.style.cursor = 'grab';
        this.startAnimation();
        this.container.removeEventListener('mousemove', handleMouseMove, false);
        this.container.removeEventListener('mouseup', handleMouseUp, false);
      };
      this.container.addEventListener('mouseup', handleMouseUp, false);
    };
  };

  private placeCircles = (circle: HTMLElement, index: number) => {
    const arc = index * Math.PI / 4;
    const x = this.radius * (1 - Math.cos(arc));
    const y = this.radius * Math.sin(arc);
    circle.style.cssText = `left: ${x}px; top: ${-y}px;`;
  };

  private resetCircleTimer = () => {
    clearTimeout(this.circleTimer);
    this.circleTimer = setTimeout(() => {
      this.circleStarted = false;
    }, 500);
  };

  private handleDrawCircle = () => {
    const wrap = document.createElement('div');
    wrap.id = 'circle-wrap';
    for (let i = 0; i < 8; i++) {
      const circle = document.createElement('div');
      circle.className = 'circle';
      this.placeCircles(circle, i);
      this.circles.push(circle);
      circle.onmouseenter = () => {
        this.resetCircleTimer();
        if (i - this.circleState === 1) {
          this.circleState = i;
          this.starOpacity += 0.02;
          this.star.style.opacity = `${this.starOpacity}`;
        }
        if (this.circleState === 7 && i === 0) {
          this.circleState = 0;
          this.starState++;
          this.starOpacity = STAR_STATE_MAP[this.starState];
          this.star.style.opacity = `${this.starOpacity}`;
        }
      };
      wrap.appendChild(circle);
    }
    document.body.appendChild(wrap);

    const handleStartDrawCircle = (evt: MouseEvent) => {
      wrap.style.cssText = `display: block; left: ${evt.clientX - 30}px; top: ${evt.clientY - 30}px`;
      this.star.style.display = 'block';
      this.star.style.left = `${evt.clientX + 10}px`;
      this.star.style.top = `${evt.clientY - 50 - this.container.offsetTop}px`;
      this.circleStarted = true;
      this.resetCircleTimer();
    };
    document.addEventListener('mousedown', handleStartDrawCircle, false);

    const handleEndDrawCircle = () => {
      wrap.style.display = 'none';
    };
    document.addEventListener('mouseup', handleEndDrawCircle, false);
  };
}

export default BouncingStar;

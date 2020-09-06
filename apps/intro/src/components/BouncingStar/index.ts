import { doAnimationInterval } from 'atat-common/lib/utils';

import './index.less';

class BouncingStar {
  private container: HTMLElement;

  private star: HTMLElement;

  private xSpeed = 6;

  private ySpeed = 3;

  private gravity = 1;

  private fraction = 0.8;

  private cancelAnimation: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.createStar();
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
      this.star.style.backgroundImage = `url('@resources/static/icons/star/star-2.gif')`;

      if (this.xSpeed > 0 && this.ySpeed < 0) {
        this.star.style.transform = `rotateX(0deg) rotateY(180deg)`;
      }
      if (this.xSpeed <= 0 && this.ySpeed <= 0) {
        this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
      }
      if (this.xSpeed > 0 && this.ySpeed > 0) {
        this.star.style.transform = `rotateX(180deg) rotateY(180deg)`;
      }
      if (this.xSpeed <= 0 && this.ySpeed >= 0) {
        this.star.style.transform = `rotateX(180deg) rotateY(0deg)`;
      }

      if (left === 0 || left === rightBound || top === 0 || top === bottomBound) {
        this.xSpeed *= this.fraction;
        this.ySpeed = (this.ySpeed - this.gravity) * this.fraction;
        if (Math.abs(this.xSpeed) < 0.01) this.xSpeed = 0;
        if (Math.abs(this.ySpeed) < 0.01) this.ySpeed = 0;
      }
      if (left === 0 || left === rightBound) this.xSpeed = -this.xSpeed;
      if (top === 0 || top === bottomBound) this.ySpeed = -this.ySpeed;

      if (top === bottomBound && this.xSpeed === 0 && this.ySpeed === 0) {
        this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
        this.star.style.backgroundImage = `url('@resources/static/icons/star/star-4.gif')`;
      }

      this.ySpeed += this.gravity;
    });
  };

  private createStar = () => {
    this.star = document.createElement('div');
    this.star.id = 'star';

    this.star.style.left = '200px';
    this.star.style.top = '200px';
    this.star.style.backgroundRepeat = 'no-repeat';
    this.star.style.width = '100px';
    this.star.style.height = '100px';
    this.star.style.backgroundSize = 'contain';
    this.initState();

    this.startAnimation();

    this.star.onclick = (evt) => { evt.stopPropagation(); };

    this.star.onmousedown = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.cancelAnimation();
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
        const { screenX, screenY } = event;
        let left = Math.floor(screenX - xDelta);
        let top = Math.floor(screenY - yDelta - this.container.offsetTop - 100);

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
    }
  };
}

export default BouncingStar;

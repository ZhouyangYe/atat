import { doAnimationInterval } from 'atat-common/lib/utils';

import './index.less';

class BouncingStar {
  private container: HTMLElement;

  private star: HTMLElement;

  private closeButton: HTMLImageElement;

  private xSpeed = 0;

  private ySpeed = 0;

  private gravity = 1;

  private fraction = 0.8;

  private bouncingStarted = false;

  private starOpacity = 0;

  private circleState = 0;

  private circles: HTMLElement[] = [];

  private radius = 60;

  private starMovingOut = false;

  private cancelAnimation: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.preLoadImage();
    this.createStar();
    this.handleDrawCircle();
  }

  getDom = (): HTMLElement => {
    return this.star;
  };

  private preLoadImage = () => {
    for (let i = 0; i < 4; i++) {
      const starIcon = document.createElement('img');
      starIcon.src = `url('@resources/static/icons/star/star-${i}.gif')`;
    }
  };

  private getRightBoundary = (): number => {
    return this.container.clientWidth - 100;
  };

  private getBottomBoundary = (): number => {
    return window.innerHeight - this.container.offsetTop - 100;
  };

  private initState = () => {
    this.star.style.backgroundImage = `url('@resources/static/icons/star/star-3.gif')`;
    this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
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
      if (!this.starMovingOut && top > bottomBound) top = bottomBound;

      this.star.style.left = `${left}px`;
      this.star.style.top = `${top}px`;

      if (left === 0 || left === rightBound || top === 0 || (!this.starMovingOut && top === bottomBound)) {
        this.xSpeed *= this.fraction;
        this.ySpeed = (this.ySpeed - this.gravity) * this.fraction;
        if (Math.abs(this.xSpeed) < 0.01) this.xSpeed = 0;
        if (Math.abs(this.ySpeed) < 0.01) this.ySpeed = 0;
      }
      if (left === 0 || left === rightBound) this.xSpeed = -this.xSpeed;
      if (top === 0 || (!this.starMovingOut && top === bottomBound)) this.ySpeed = -this.ySpeed;

      if (this.xSpeed > 0 && this.ySpeed < 0 && this.star.style.transform !== `rotateX(0deg) rotateY(180deg)`) {
        if (bottomBound - top > 100 || this.starMovingOut) {
          this.star.style.transform = `rotateX(0deg) rotateY(180deg)`;
        }
      }
      if (this.xSpeed <= 0 && this.ySpeed < 0 && this.star.style.transform !== `rotateX(0deg) rotateY(0deg)`) {
        if (bottomBound - top > 100 || this.starMovingOut) {
          this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
        }
      }
      if (this.xSpeed > 0 && this.ySpeed > 0 && this.star.style.transform !== `rotateX(180deg) rotateY(180deg)`) {
        this.star.style.transform = `rotateX(180deg) rotateY(180deg)`;
      }
      if (this.xSpeed <= 0 && this.ySpeed > 0 && this.star.style.transform !== `rotateX(180deg) rotateY(0deg)`) {
        this.star.style.transform = `rotateX(180deg) rotateY(0deg)`;
      }

      if ((!this.starMovingOut && top === bottomBound) && this.xSpeed === 0 && this.ySpeed === 0) {
        if (this.star.style.backgroundImage !== `url("@resources/static/icons/star/star-4.gif")`) {
          this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
          this.star.style.backgroundImage = `url("@resources/static/icons/star/star-4.gif")`;
          this.closeButton.style.display = 'block';
        }
      } else if (this.star.style.backgroundImage !== `url("@resources/static/icons/star/star-2.gif")`) {
        this.closeButton.style.display = 'none';
        this.star.style.backgroundImage = `url("@resources/static/icons/star/star-2.gif")`;
      }

      this.ySpeed += this.gravity;
    });
  };

  private createStar = () => {
    this.star = document.createElement('div');
    this.star.id = 'star';
    this.closeButton = document.createElement('img');
    this.closeButton.src = '/@resources/static/icons/close-1.svg';
    this.closeButton.className = 'close';
    this.star.appendChild(this.closeButton);

    this.star.style.backgroundRepeat = 'no-repeat';
    this.star.style.backgroundSize = 'contain';
    this.initState();

    this.star.onclick = (evt) => { evt.stopPropagation(); };

    this.star.onmousedown = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.bouncingStarted || this.starMovingOut) return;
      if (this.cancelAnimation) this.cancelAnimation();
      this.star.style.cursor = 'grabbing';
      this.star.style.backgroundImage = `url('@resources/static/icons/star/star-1.gif')`;
      this.star.style.transform = `rotateX(0deg) rotateY(0deg)`;
      const xDelta = evt.offsetX;
      const yDelta = evt.offsetY;
      this.closeButton.style.display = 'none';

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
        this.closeButton.style.display = 'block';
        this.startAnimation();
        this.container.removeEventListener('mousemove', handleMouseMove, false);
        this.container.removeEventListener('mouseup', handleMouseUp, false);
      };
      this.container.addEventListener('mouseup', handleMouseUp, false);
    };

    this.closeButton.onmousedown = (evt: MouseEvent) => { evt.stopPropagation(); };
    this.closeButton.onclick = () => {
      if (!this.bouncingStarted) return;
      this.bouncingStarted = false;
      this.starMovingOut = true;
      this.xSpeed = Math.random() > 0.5 ? 5 : -5;
      this.ySpeed = -8;

      setTimeout(() => {
        if (this.cancelAnimation) this.cancelAnimation();
        this.starMovingOut = false;
        this.star.style.display = 'none';
      }, 2000);
    };
  };

  private placeCircles = (circle: HTMLElement, index: number) => {
    const arc = index * Math.PI / 4;
    const x = this.radius * (1 - Math.cos(arc));
    const y = this.radius * Math.sin(arc);
    circle.style.cssText = `left: ${x}px; top: ${-y}px;`;
  };

  private fadeInStar = () => {
    this.starOpacity += 0.03;
    if (this.starOpacity > 1) {
      this.starOpacity = 1;
    }
  };

  private startBouncingAfterFadeIn = () => {
    if (this.starOpacity === 1 && !this.bouncingStarted) {
      this.xSpeed = Math.random() > 0.5 ? 5 : -5;
      this.ySpeed = -6;
      this.bouncingStarted = true;
      this.startAnimation();
    }
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
        if (this.bouncingStarted) return;
        if (i - this.circleState === 1) {
          this.circleState = i;
          this.fadeInStar();
          this.star.style.opacity = `${this.starOpacity}`;
          this.startBouncingAfterFadeIn();
        }
        if (this.circleState === 7 && i === 0) {
          this.circleState = 0;
          this.fadeInStar();
          this.star.style.opacity = `${this.starOpacity}`;
          this.startBouncingAfterFadeIn();
        }
      };
      wrap.appendChild(circle);
    }
    document.body.appendChild(wrap);

    const handleStartDrawCircle = (evt: MouseEvent) => {
      if (this.bouncingStarted || this.starMovingOut) return;
      this.starOpacity = 0;
      wrap.style.cssText = `display: block; left: ${evt.clientX - 30}px; top: ${evt.clientY - 30}px`;
      this.star.style.display = 'block';
      this.star.style.opacity = '0';
      this.star.style.left = `${evt.clientX + 10}px`;
      this.star.style.top = `${evt.clientY - 50 - this.container.offsetTop}px`;
      this.initState();

      const handleEndDrawCircle = () => {
        wrap.style.display = 'none';
        if (!this.bouncingStarted) {
          this.star.style.display = 'none';
        }
        document.removeEventListener('mouseup', handleEndDrawCircle, false);
      };
      document.addEventListener('mouseup', handleEndDrawCircle, false);
    };
    document.addEventListener('mousedown', handleStartDrawCircle, false);
  };
}

export default BouncingStar;

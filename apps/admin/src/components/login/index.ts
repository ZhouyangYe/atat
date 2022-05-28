import { doAnimationInterval } from 'atat-common/lib/utils';

import './index.less';

const gravity = 0.98;
const fraction = 0.5;

class Login {
  private login: HTMLDivElement;
  private shadow: HTMLDivElement;
  private input: HTMLInputElement;
  private shadowInput: HTMLInputElement;
  private password: string | undefined;
  private loading = false;
  private speed = { x: 0, y: 0 };
  private hidden = true;
  private windowSize: { width: number; height: number };
  private cancelAnimation: () => void;
  onClick?: (password?: string) => Promise<void>;

  onSubmit(): void {
    this.loading = true;
    this.password = this.input.value || undefined;
    this.login.classList.add('loading');

    if (this.onClick) {
      this.onClick(this.password).then(() => {
        this.loading = false;
        this.login.classList.remove('loading');
      });
    }
  }

  resize(): void {
    this.windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  getDom(): HTMLDivElement {
    return this.login;
  }

  constructor() {
    this.render();
    this.resize();
  }

  show(): void {
    if (!this.hidden) {
      return;
    }
    this.login.classList.remove('hide');
    this.hidden = false;
    if (this.cancelAnimation) {
      this.cancelAnimation();
    }
    this.login.onclick = this.submit;
    const randomLeft = Math.random() * (this.windowSize.width - 300);
    this.speed.x = (Math.random() * 2 - 1) * 100;
    this.login.style.left = `${randomLeft}px`;
    this.login.style.top = '-200px';
    this.login.style.zIndex = '1000';
    this.cancelAnimation = doAnimationInterval(() => {
      let left = this.login.offsetLeft, top = this.login.offsetTop;

      left += this.speed.x;
      top += this.speed.y;
      const speedY = this.speed.y;

      const leftBound = this.windowSize.width - 300;
      if (left > leftBound) {
        left = leftBound;
        this.speed.x *= -fraction;
        this.speed.y *= fraction;
      } else if (left < 0) {
        left = 0;
        this.speed.x *= -fraction;
        this.speed.y *= fraction;
      }

      const topBound = (this.windowSize.height - 180) * 0.6;
      if (top > topBound) {
        top = topBound;
        this.speed.x *= fraction;
        this.speed.y *= -fraction;
        this.speed.y += gravity * (1 - (top - topBound) / speedY);
      } else {
        this.speed.y += gravity;
      }

      this.speed.x = Math.abs(this.speed.x) < 0.0001 ? 0 : this.speed.x;

      this.login.style.top = `${top}px`;
      this.login.style.left = `${left}px`;
      this.shadow.style.top = `${(topBound - top) * 2 + 180}px`;
    });
  }

  hide(): void {
    this.login.onclick = null;
    if (this.cancelAnimation) this.cancelAnimation();

    this.hidden = true;
    this.login.classList.add('hide');
    setTimeout(() => {
      this.login.style.zIndex = '0';
    }, 500);
  }

  private submit = (): void => {
    if (this.loading) return;

    if (!this.input.value) {
      this.input.focus();
      return;
    }

    this.onSubmit();
  }

  private render(): void {
    this.login = document.createElement('div');
    this.login.id = 'login';

    this.login.innerHTML = `
      <div class='bar-wrap'>
        <div class='bar'>
          <h2><span>Password</span></h2>
          <input class='password' type='password' maxlength='20'>
          <div class='loading-bar'>
            ${new Array(10).fill('wave').map((className) => `<div class="${className}"></div>`).join('')}
          </div>
        </div>
      </div>
      <div class='shadow'>
        <div class='content-wrap'>
          <div class='content'>
            <h2><span>Password</span></h2>
            <input class='password' type='password' maxlength='20'>
            <div class='loading-bar'>
              ${new Array(10).fill('wave').map((className) => `<div class="${className}"></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    const inputs = this.login.querySelectorAll<HTMLInputElement>('.password')!;
    this.input = inputs[0];
    this.shadowInput = inputs[1];
    this.shadow = this.login.querySelector<HTMLDivElement>('.shadow')!;

    const title = this.login.querySelector('span')!;

    title.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    this.input.onclick = (e) => {
      e.stopPropagation();
    };

    this.input.ondblclick = (e) => {
      e.stopPropagation();
    };

    this.input.onmousedown = (e) => {
      e.stopPropagation();
    };

    this.shadow.onclick = (e) => {
      e.stopPropagation();
    }

    this.shadowInput.onmousedown = (e) => {
      e.preventDefault();
    }

    this.input.onkeydown = (e) => {
      setTimeout(() => {
        this.shadowInput.value = this.input.value;
      }, 0);
      if (e.key.toLowerCase() === 'enter') {
        this.submit();
      }
    }

    this.login.onclick = this.submit;
  }
}

export default Login;

import './index.less';

class Login {
  private login: HTMLDivElement;
  private input: HTMLInputElement;
  private password: string | undefined;
  private loading = false;
  private timer: NodeJS.Timer;
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

  getDom(): HTMLDivElement {
    return this.login;
  }

  constructor() {
    this.render();
  }

  show(): void {
    clearTimeout(this.timer);

    this.login.onclick = this.submit;
    this.login.style.display = 'block';
    setTimeout(() => {
      this.login.classList.remove('hide');
    }, 18);
  }

  hide(): void {
    clearTimeout(this.timer);

    this.login.onclick = null;
    this.login.classList.add('hide');
    this.timer = setTimeout(() => {
      this.login.style.display = 'none';
    }, 200);
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
    this.login.classList.add('hide');

    this.login.innerHTML = `
      <div class='bar'>
        <h2><span>Password</span></h2>
        <input id='password' type='password' maxlength='20'>
        <div class='loading-bar'>
          ${new Array(10).fill('wave').map((className) => `<div class="${className}"></div>`).join('')}
        </div>
      </div>
    `;

    this.input = this.login.querySelector<HTMLInputElement>('#password')!;

    const title = this.login.querySelector('span')!;

    title.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    this.login.onmousedown = () => {
      this.login.classList.add('active');
    };

    this.login.onmouseup = () => {
      this.login.classList.remove('active');
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

    this.input.onkeydown = (e) => {
      if (e.key.toLowerCase() === 'enter') {
        this.submit();
      }
    }

    this.login.onclick = this.submit;
  }
}

export default Login;

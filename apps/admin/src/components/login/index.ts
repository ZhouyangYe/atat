import './index.less';

class Login {
  private login: HTMLDivElement;
  private password: string;
  private loading = false;
  onClick: (password: string) => Promise<void>;

  onSubmit(): void {
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

  render(): void {
    this.login = document.createElement('div');
    this.login.id = 'login';

    this.login.innerHTML = `
      <div class='bar'>
        <h2><span>Password</span></h2>
        <input id='password' type='password' maxlength='20'>
      </div>
    `;

    const
      title = this.login.querySelector('span'),
      input = this.login.querySelector<HTMLInputElement>('#password');

    title.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    input.onclick = (e) => {
      e.stopPropagation();
    }

    this.login.onclick = () => {
      if (this.loading) return;

      if (!input.value) {
        input.focus();
        return;
      }

      this.loading = true;
      this.login.classList.add('loading');
      this.password = input.value;
      this.onSubmit();
    }
  }
}

export default Login;

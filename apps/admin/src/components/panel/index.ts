import './index.less';

class Panel {
  private panel: HTMLDivElement;
  private resume: HTMLDivElement;
  private logout: HTMLDivElement;
  private timer: NodeJS.Timer;
  resumeClick: () => void;
  logoutClick: () => void;

  getDom(): HTMLDivElement {
    return this.panel;
  }

  show(): void {
    clearTimeout(this.timer);

    this.panel.style.display = 'flex';
    setTimeout(() => {
      this.panel.className = 'show';
    }, 18);
  }

  hide(): void {
    clearTimeout(this.timer);

    this.panel.className = 'hide';
    this.timer = setTimeout(() => {
      this.panel.style.display = 'none';
    }, 500);
  }

  constructor() {
    this.render();
  }

  private render(): void {
    this.panel = document.createElement('div');
    this.resume = document.createElement('div');
    this.logout = document.createElement('div');

    this.panel.id = 'panel';
    this.panel.className = 'hide';
    this.resume.className = 'resume';
    this.logout.className = 'logout';

    const photo = document.createElement('img');
    photo.src = '/@resources/static/resume/photo.jpg';
    photo.alt = 'Edit resume';
    photo.title = 'Edit resume';
    this.resume.append(photo);

    const icon = document.createElement('img');
    icon.src = '/@resources/static/icons/logout.svg';
    icon.alt = 'Log out';
    icon.title = 'Log out';
    this.logout.append(icon);

    this.panel.append(this.logout, this.resume);

    photo.onclick = () => {
      if (this.resumeClick) this.resumeClick();
    };
    icon.onclick = () => {
      if (this.logoutClick) this.logoutClick();
    };
  }
}

export default Panel;

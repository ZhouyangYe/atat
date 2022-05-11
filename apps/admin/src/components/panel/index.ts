import './index.less';

class Panel {
  private panel: HTMLDivElement;
  private resume: HTMLDivElement;
  private timer: NodeJS.Timer;
  resumeClick: () => void;

  getDom(): HTMLDivElement {
    return this.panel;
  }

  show(): void {
    clearTimeout(this.timer);

    this.panel.style.display = 'flex';
    setTimeout(() => {
      this.panel.className = 'show';
    }, 0);
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

    this.panel.id = 'panel';
    this.panel.className = 'hide';
    this.resume.className = 'resume';
    const photo = document.createElement('img');
    photo.src = '/@resources/static/resume/photo.jpg';
    photo.alt = 'Edit resume';
    photo.title = 'Edit resume';
    this.resume.append(photo);

    this.panel.append(this.resume);

    photo.onclick = () => {
      if (this.resumeClick) this.resumeClick();
    };
  }
}

export default Panel;

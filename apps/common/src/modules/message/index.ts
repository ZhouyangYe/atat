import './index.less';

const delay = 3000;

export enum MODE {
  SUCCESS = 'success',
  ERROR = 'error',
  ALERT = 'alert',
  INFO = 'info',
}

const icons = {
  success: '/@resources/static/icons/cat.svg',
  error: '/@resources/static/icons/dragon.svg',
  alert: '/@resources/static/icons/dog.svg',
  info: '/@resources/static/icons/pigeon.svg',
};

for (const key in icons) {
  const img = new Image();
  img.src = (icons as any)[key];
}

class Message {
  private timer: NodeJS.Timeout;

  private static showMessage(msg: string, mode: MODE): void {
    const message = document.createElement('div'), icon = document.createElement('img');
    icon.src = icons[mode];
    message.className = 'atat-message hide';
    message.innerHTML = '';
    message.append(icon, msg);
    document.body.append(message);
    const resize = () => {
      message.style.left = `${(screen.width - message.clientWidth) / 2}px`;
    };
    setTimeout(() => {
      resize();
      message.className = `atat-message ${mode} show`;
    }, 18);
    message.onmousedown = (e) => {
      e.preventDefault();
    }

    window.addEventListener('resize', resize, false);
    setTimeout(() => {
      message.className = 'atat-message hide';
      window.removeEventListener('resize', resize, false);
      setTimeout(() => {
        message.remove();
      }, 500);
    }, delay);
  }

  static success(msg: string): void {
    this.showMessage(msg, MODE.SUCCESS);
  }
  
  static error(msg: string): void {
    this.showMessage(msg, MODE.ERROR);
  }

  static info(msg: string): void {
    this.showMessage(msg, MODE.INFO);
  }

  static alert(msg: string): void {
    this.showMessage(msg, MODE.ALERT);
  }
}

export default Message;

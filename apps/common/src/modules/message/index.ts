import './index.less';

const delay = 3000;

export enum MODE {
  SUCCESS = 'success',
  ERROR = 'error',
  ALERT = 'alert',
  INFO = 'info',
}

class Message {
  private message: HTMLDivElement;
  private icons = {
    success: document.createElement('img'),
    error: document.createElement('img'),
    alert: document.createElement('img'),
    info: document.createElement('img'),
  };
  private timer: NodeJS.Timeout;

  getDom(): HTMLDivElement {
    return this.message;
  }

  resize(): void {
    this.message.style.left = `${(screen.width - this.message.clientWidth) / 2}px`;
  }

  constructor() {
    this.message = document.createElement('div');
    this.message.id = 'message';
    this.message.className = 'hide';
    this.icons.success.src = '/@resources/static/icons/cat.svg';
    this.icons.error.src = '/@resources/static/icons/dragon.svg';
    this.icons.alert.src = '/@resources/static/icons/dog.svg';
    this.icons.info.src = '/@resources/static/icons/pigeon.svg';
  }

  private hideAfterDelay(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.message.className = 'hide';
    }, delay);
  }

  private showMessage(msg: string, mode: MODE): void {
    this.message.className = 'hide';
    this.message.innerHTML = '';
    this.message.append(this.icons[mode], msg);
    this.message.style.left = `calc(50% - ${this.message.clientWidth}px / 2)`;
    this.message.className = `${mode} show`;
    this.hideAfterDelay();
  }

  success(msg: string): void {
    this.showMessage(msg, MODE.SUCCESS);
  }
  
  error(msg: string): void {
    this.showMessage(msg, MODE.ERROR);
  }

  info(msg: string): void {
    this.showMessage(msg, MODE.INFO);
  }

  alert(msg: string): void {
    this.showMessage(msg, MODE.ALERT);
  }
}

export default Message;

import './index.less';

const delay = 3000;

class Message {
  private message: HTMLDivElement;
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
  }

  private hideAfterDelay(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.message.className = 'hide';
    }, delay);
  }

  private showMessage(msg: string): void {
    this.message.className = 'hide';
    this.message.innerHTML = msg;
    this.message.style.left = `${(screen.width - this.message.clientWidth) / 2}px`;
    this.hideAfterDelay();
  }

  success(msg: string): void {
    this.showMessage(msg);
    this.message.className = 'success show';
  }
  
  error(msg: string): void {
    this.showMessage(msg);
    this.message.className = 'error show';
  }

  info(msg: string): void {
    this.showMessage(msg);
    this.message.className = 'info show';
  }

  alert(msg: string): void {
    this.showMessage(msg);
    this.message.className = 'alert show';
  }
}

export default Message;

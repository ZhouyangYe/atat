import './index.less';

export enum TYPE {
  EMAIL = 'email',
  PHONE = 'phone',
  LINK = 'link',
  TEXT = 'text',
}

export interface Item {
  text: string;
  type: string;
  prefix?: string;
  link?: string;
}

export interface Config {
  title: string;
  items: Item[];
  autoHide?: boolean;
  background?: string;
}

class Scroll {
  private scroll: HTMLDivElement;
  private title: string;
  private items: Item[];
  private autoHide: boolean;
  private isMouseOverScroll = false;
  private autoHideTimer: NodeJS.Timer;

  getDom(): HTMLDivElement {
    return this.scroll;
  }

  constructor(config: Config) {
    const {
      items,
      background,
      title = 'Hello',
      autoHide = true,
    } = config;
    this.title = title;
    this.items = items;
    this.autoHide = autoHide;

    this.createScroll(background);
  }

  hide(): void {
    clearTimeout(this.autoHideTimer);
    this.scroll.className = 'hide';
  }

  show(): void {
    if (!this.autoHide || this.isMouseOverScroll) return;
    
    this.scroll.className = 'show';
    this.hideScrollAfterDelay();
  }

  private hideScrollAfterDelay = (): void => {
    clearTimeout(this.autoHideTimer);
    this.autoHideTimer = setTimeout(() => {
      this.scroll.className = 'hide';
    }, 3000);
  };

  private createScroll(background?: string): void {
    this.scroll = document.createElement('div');
    this.scroll.id = 'scroll';
    this.scroll.className = 'hide';
    this.scroll.onmousedown = (e) => { e.stopPropagation(); };

    this.scroll.onmouseenter = () => {
      if (!this.autoHide) return;

      this.isMouseOverScroll = true;
      this.scroll.className = 'show';
      clearTimeout(this.autoHideTimer);
    };

    const
      list = document.createElement('div'),
      lStrip = document.createElement('span'),
      rStrip = document.createElement('span'),
      title = document.createElement('h3'),
      boxRoot = document.createElement('div'),
      boxes = [boxRoot];

    if (background) title.style.background = background;

    list.id = 'list';
    lStrip.className = 'strip';
    rStrip.className = 'strip';
    title.innerHTML = `<span>${this.title}</span>`;
    let currentBox: HTMLDivElement = boxRoot;
    this.items.forEach((item, i) => {
      const wrap = document.createElement('span');
      switch (item.type) {
        case TYPE.TEXT:
          wrap.innerHTML = item.text;
          break;
        case TYPE.PHONE:
          wrap.innerHTML = `Tel: <a href='tel:${item.text}'>${item.text}</a>`;
          break;
        case TYPE.EMAIL:
          wrap.innerHTML = `Email: <a href='mailto:${item.text}'>${item.text}</a>`;
          break;
        case TYPE.LINK:
          wrap.innerHTML = `${item.prefix}: <a href='${item.link || 'javascript:void(0)'}' ${item.link ? `target='_blank'` : ''}>${item.text}</a>`;
          break;
        default:
          break;
      }
      currentBox.className = `box-${i}`;
      currentBox.appendChild(wrap);

      if (i === this.items.length - 1) return;

      const box = document.createElement('div');
      boxes.push(box);
      currentBox.appendChild(box);
      currentBox = box;
    });

    list.appendChild(lStrip);
    list.appendChild(rStrip);
    list.appendChild(title);
    list.appendChild(boxRoot);

    this.scroll.appendChild(list);

    this.scroll.style.width = `${title.offsetWidth} rem`;
    this.scroll.style.height = `${title.offsetHeight + 60} rem`;
    this.doScroll(list, boxes, title);
    this.doRotate(list);
  }

  private doScroll(list: HTMLDivElement, boxes: HTMLDivElement[], title: HTMLHeadingElement): void {
    const length = boxes.length;
    let index = -1;
    let oTimer: NodeJS.Timeout = null;
    list.onmouseenter = () => {
      boxes.forEach((box) => {
        box.onmouseover = (e) => {
          e.stopPropagation();
          box.style.background = 'rgba(223,246,247,1.0)';
        }
        box.onmouseout = (e) => {
          e.stopPropagation();
          box.style.background = 'rgba(255,255,255,0.9)';
        }
      });
      this.scroll.style.height = `${boxes.length * (boxes[0].offsetHeight + 4 / 10) + title.offsetHeight + 30 / 10} rem`;
      if (oTimer) {
        clearInterval(oTimer);
      }
      if (index < 0) {
        index = 0;
      }
      oTimer = setInterval(() => {
        if (index === length) {
          clearInterval(oTimer);
          oTimer = null;
        } else {
          boxes[index].classList.remove('hide');
          boxes[index].classList.add('show');
          index++;
        }
      }, 160);
    };

    this.scroll.addEventListener('mouseleave', () => {
      this.scroll.style.height = `${title.offsetHeight + 60 / 10} rem`;
      if (oTimer) {
        clearInterval(oTimer);
        oTimer = null;
      }
      if (index >= length) {
        index = length - 1;
      }
      oTimer = setInterval(function () {
        if (index < 0) {
          clearInterval(oTimer);
          oTimer = null;
        } else {
          boxes[index].onmouseover = null;
          boxes[index].onmouseout = null;
          boxes[index].classList.remove('show');
          boxes[index].classList.add('hide');
          index--;
        }
      }, 160);
    }, false);
  }

  private doRotate(list: HTMLDivElement): void {
    let timer: NodeJS.Timeout = null;
    this.scroll.onmouseenter = () => {
      clearTimeout(timer);
      this.scroll.onmousemove = (ev) => {
        const l = ev.clientX - this.scroll.offsetLeft;
        const width = this.scroll.clientWidth;
        const p = (l - width / 2) / width;
        const deg = 60 * p;
        list.style.cssText = `transform:rotateY(${deg}deg);transition:transform 0.2s ease;`;
      }

      if (!this.autoHide) return;
      this.isMouseOverScroll = true;
      this.scroll.className = 'show';
      clearTimeout(this.autoHideTimer);
    };
    this.scroll.addEventListener('mouseleave', () => {
      this.scroll.onmousemove = null;
      timer = setTimeout(function () {
        list.style.cssText = 'transform:rotateY(0deg);transition:transform 1.2s ease;';
      }, 1000);

      
      if (!this.autoHide) return;
      this.isMouseOverScroll = false;
      this.hideScrollAfterDelay();
    }, false);
  }

}

export default Scroll;

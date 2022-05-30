import './index.less'

export interface Config {
  backgrounds?: string[];
  autoHide?: boolean;
}

class Crystal {
  private backgrounds: string[];
  private crystal: HTMLDivElement;
  private autoHide: boolean;
  private isMouseOverCrystal: boolean;
  private autoHideTimer: NodeJS.Timer | undefined = undefined;

  getDom(): HTMLDivElement {
    return this.crystal;
  }

  hide(): void {
    clearTimeout(this.autoHideTimer);
    this.crystal.className = 'hide';
  }

  show(): void {
    if (!this.autoHide || this.isMouseOverCrystal) return;

    this.crystal.className = 'show';
    this.hideCrystalAfterDelay();
  }

  constructor(config?: Config) {
    const {
      backgrounds = [
        '/@resources/static/materials/crystal/bg1.gif',
        '/@resources/static/materials/crystal/bg2.gif',
        '/@resources/static/materials/crystal/bg3.gif',
      ],
      autoHide = true,
    } = config || {};

    this.autoHide = autoHide;
    this.backgrounds = backgrounds;
    this.render();
  }

  private hideCrystalAfterDelay = (): void => {
    clearTimeout(this.autoHideTimer);
    this.autoHideTimer = setTimeout(() => {
      this.crystal.className = 'hide';
    }, 3000);
  };

  private render(): void {
    const lButton = document.createElement('div'), rButton = document.createElement('div');
    this.crystal = document.createElement('div');
    this.crystal.id = 'crystal';
    this.crystal.className = 'hide';
    lButton.className = 'prev';
    rButton.className = 'next';
    for (let i = 0; i < 4; i++) {
      const arrow = document.createElement('img');
      arrow.alt = '';
      arrow.src = `/@resources/static/materials/crystal/${i < 2 ? 'prev' : 'next'}.png`;
      if (i < 2) {
        lButton.appendChild(arrow);
      } else {
        rButton.appendChild(arrow);
      }
    }
    const list = document.createElement('ul');
    const classNames = ['middle', 'left', 'right'];
    const lis: HTMLLIElement[] = [];
    this.backgrounds.forEach((bg, i) => {
      const li = document.createElement('li');
      li.className = classNames[i];
      li.innerHTML = `
        <span>
          <img src="${bg}" alt=""/>
        </span>
        <div></div>
        <img class="shadow" src="/@resources/static/materials/crystal/shadow.png" alt=""/>
      `;
      lis.push(li);
      list.appendChild(li);
    });

    lButton.onclick = fn_prev;
    rButton.onclick = fn_next;

    lButton.onmousedown = (e) => {
      e.stopPropagation();
    }
    rButton.onmousedown = (e) => {
      e.stopPropagation();
    }

    function fn_prev(e: MouseEvent) {
      e.stopPropagation();
      lButton.onclick = (ev) => { ev.stopPropagation(); };
      rButton.onclick = (ev) => { ev.stopPropagation(); };
      classNames.push(classNames.shift()!);
      for (var i = 0; i < lis.length; i++) {
        lis[i].className = classNames[i];
      }
      setTimeout(function () {
        lButton.onclick = fn_prev;
        rButton.onclick = fn_next;
      }, 1000);
    }

    function fn_next(e: MouseEvent) {
      e.stopPropagation();
      lButton.onclick = (ev) => { ev.stopPropagation(); };
      rButton.onclick = (ev) => { ev.stopPropagation(); };
      classNames.unshift(classNames.pop()!);
      for (var i = 0; i < lis.length; i++) {
        lis[i].className = classNames[i];
      }
      setTimeout(function () {
        lButton.onclick = fn_prev;
        rButton.onclick = fn_next;
      }, 1000);
    }
    
    this.crystal.onmouseenter = () => {
      if (!this.autoHide) return;

      this.isMouseOverCrystal = true;
      this.crystal.className = 'show';
      clearTimeout(this.autoHideTimer);

    };

    this.crystal.onmouseleave = () => {
      if (!this.autoHide) return;

      this.isMouseOverCrystal = false;
      this.hideCrystalAfterDelay();
    };

    this.crystal.appendChild(lButton);
    this.crystal.appendChild(rButton);
    this.crystal.appendChild(list);
  }
}

export default Crystal;

import './index.less';

export interface Config {
  autoHide?: boolean;
  onSwitch?: (on: boolean) => void;
}

class Lamp {
  private lamp: HTMLDivElement;
  private autoHide: boolean;
  private isMouseOverLamp: boolean;
  private autoHideTimer: NodeJS.Timer = null;
  private onSwitch: (on: boolean) => void;
  private on = false;

  getDom(): HTMLDivElement {
    return this.lamp;
  }

  hide(): void {
    clearTimeout(this.autoHideTimer);
    this.lamp.className = 'hide';
  }

  show(): void {
    if (!this.autoHide || this.isMouseOverLamp) return;

    this.lamp.className = 'show';
    this.hideLampAfterDelay();
  }

  constructor(config?: Config) {
    const {
      onSwitch,
      autoHide = true,
    } = config || {};

    this.autoHide = autoHide;
    this.onSwitch = onSwitch;
    this.render();
  }

  private hideLampAfterDelay = (): void => {
    clearTimeout(this.autoHideTimer);
    this.autoHideTimer = setTimeout(() => {
      this.lamp.className = 'hide';
    }, 3000);
  };

  private getLeft(obj: HTMLElement): number {
    let left = 0;
    while (obj) {
      left += obj.offsetLeft;
      obj = obj.offsetParent as HTMLElement;
    }
    return left;
  }

  private render(): void {
    this.lamp = document.createElement('div');
    this.lamp.id = 'lamp';
    this.lamp.className = 'hide';
    const
      knot = document.createElement('div'),
      combine = document.createElement('div'),
      cover = document.createElement('div'),
      pole = document.createElement('img'),
      bulb = document.createElement('img'),
      wrap = document.createElement('div'),
      flare = document.createElement('span'),
      glow = document.createElement('span');

    bulb.src = '/@resources/static/materials/lamp/bulb.png';
    bulb.className = 'bulb';
    bulb.alt = '';
    wrap.className = 'wrap';
    flare.className = 'flareOff';
    glow.className = 'glowOff';
    combine.appendChild(bulb);
    wrap.appendChild(flare);
    wrap.appendChild(glow);
    combine.appendChild(wrap);
    knot.className = 'knot';
    combine.className = 'combine';
    cover.className = 'cover';
    pole.className = 'pole';
    pole.alt = '';
    pole.src = '/@resources/static/materials/lamp/pole.png';

    let toggleL = true;
    let toggleR = true;
    const swing = (e: MouseEvent) => {
      const left = this.getLeft(combine);
      if (e.clientX > (left + 15)) {
        if (toggleL) {
          combine.className = 'combine swingl1';
          toggleL = !toggleL;
        } else {
          combine.className = 'combine swingl2';
          toggleL = !toggleL;
        }
      } else {
        if (toggleR) {
          combine.className = 'combine swingr1';
          toggleR = !toggleR;
        } else {
          combine.className = 'combine swingr2';
          toggleR = !toggleR;
        }
      }
    }
    cover.onmouseenter = swing;

    cover.onmousedown = (e) => {
      e.stopPropagation();
    };

    const onToggle = () => {
      cover.onclick = null;
      if (!this.on) {
        flare.className = 'flareOn';
        glow.className = 'glowOn';
        cover.onclick = onToggle;
        this.on = true;
      } else {
        flare.className = 'flareOff';
        glow.className = 'glowOff';
        cover.onclick = onToggle;
        this.on = false;
      }
      if (this.onSwitch) this.onSwitch(this.on);
    }
    cover.onclick = onToggle;

    this.lamp.onmouseenter = () => {
      if (!this.autoHide) return;

      this.isMouseOverLamp = true;
      this.lamp.className = 'show';
      clearTimeout(this.autoHideTimer);

    };

    this.lamp.onmouseleave = () => {
      if (!this.autoHide || this.on) return;

      this.isMouseOverLamp = false;
      this.hideLampAfterDelay();
    };

    this.lamp.appendChild(knot);
    this.lamp.appendChild(combine);
    this.lamp.appendChild(cover);
    this.lamp.appendChild(pole);
  }
}

export default Lamp;

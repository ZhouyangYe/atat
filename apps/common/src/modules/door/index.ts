import './index.less';

export interface IBaseConfig {
  autoHide?: boolean;
  text?: string;
  backgroundUrl?: string;
  doorColor?: string;
  rimColor?: string;
  stoneColor?: string;
  stoneSurfaceColor?: string;
  signColor?: string;
  signBorderColor?: string;
  signMessageColor?: string;
  roadColor?: string;
}

export interface IConfig extends IBaseConfig {
  href: string;
}

class Door {
  private defaultConfig: IBaseConfig = {
    autoHide: true,
    text: 'Entry',
    backgroundUrl: '@resources/static/materials/path3.png',
    doorColor: '#77685b',
    rimColor: '#333',
    stoneColor: '#333',
    stoneSurfaceColor: '#555',
    signColor: 'rgb(80, 9, 94)',
    signBorderColor: '#000',
    signMessageColor: '#ddd',
    roadColor: '#888c8d',
  };

  private config: IConfig;

  private door: HTMLAnchorElement;

  private sign: HTMLElement;

  private edges: HTMLElement[] = [];

  private overlaps: HTMLElement[] = [];

  private lEdge: HTMLElement;

  private tEdge: HTMLElement;

  private cover: HTMLElement;

  private stone: HTMLElement;

  private roads: HTMLElement[] = [];

  private stoneDiv: HTMLElement;

  private autoHide: boolean;

  private autoHideTimer: NodeJS.Timer;

  private isMouseOverDoor = false;

  constructor(config: IConfig) {
    this.config = config;
    this.autoHide = config.autoHide || this.defaultConfig.autoHide;
    this.createDoor();
    this.bindAutoHide();
  }

  getDom = (): HTMLElement => {
    return this.door;
  };

  setText = (text: string): void => {
    this.sign.innerHTML = text;
  };

  hide = (): void => {
    clearTimeout(this.autoHideTimer);
    this.door.className = 'hide';
  };

  toggleAutoHide = (): void => {
    this.autoHide = !this.autoHide;
    if (!this.autoHide) {
      this.show();
    }
  };

  dye = (config: IBaseConfig): void => {
    const {
      backgroundUrl,
      doorColor,
      rimColor,
      stoneColor,
      stoneSurfaceColor,
      signColor,
      signBorderColor,
      signMessageColor,
      roadColor,
    } = config;

    if (backgroundUrl) {
      this.door.style.background = `url(${backgroundUrl}) no-repeat`;
      this.door.style.backgroundSize = 'cover';
    }

    if (signColor) {
      this.sign.style.background = signColor;
    }

    if (signBorderColor) {
      this.sign.style.borderColor = signBorderColor;
    }

    if (signMessageColor) {
      this.sign.style.color = signMessageColor;
    }

    if (doorColor) {
      this.edges.forEach((edge) => {
        edge.style.background = doorColor;
      });
      this.overlaps.forEach((overlap) => {
        overlap.style.background = doorColor;
      });
    }

    if (doorColor) {
      this.lEdge.style.background = doorColor;
      this.tEdge.style.background = doorColor;
    }

    if (rimColor) {
      this.cover.style.borderColor = rimColor;
    }

    if (stoneColor) {
      this.stone.style.background = stoneColor;
    }

    if (stoneSurfaceColor) {
      this.stoneDiv.style.background = stoneSurfaceColor;
    }

    if (roadColor) {
      this.roads.forEach((road) => {
        road.style.background = roadColor;
      });
    }
  };

  show(): void {
    if (!this.autoHide || this.isMouseOverDoor) return;

    this.door.className = 'show';
    this.hideDoorAfterDelay();
  }

  private hideDoorAfterDelay = (): void => {
    clearTimeout(this.autoHideTimer);
    this.autoHideTimer = setTimeout(() => {
      this.door.className = 'hide';
    }, 3000);
  };

  private bindAutoHide = () => {
    this.door.className = this.autoHide ? 'hide' : 'show';

    this.door.onmouseenter = () => {
      if (!this.autoHide) return;

      this.isMouseOverDoor = true;
      this.door.className = 'show';
      clearTimeout(this.autoHideTimer);

    };

    this.door.onmouseleave = () => {
      if (!this.autoHide) return;

      this.isMouseOverDoor = false;
      this.hideDoorAfterDelay();
    };
  };

  private createDoor = (): void => {
    this.door = document.createElement('a');
    this.door.id = 'door';
    this.door.href = this.config.href;

    this.door.onmousedown = (evt: MouseEvent) => { evt.stopPropagation(); };

    // pivot
    for (let i = 0; i < 2; i++) {
      const pivot = document.createElement('div');
      pivot.className = 'pivot';
      this.door.appendChild(pivot);
    }

    // sign
    this.sign = document.createElement('div');
    this.sign.className = 'sign';
    this.door.appendChild(this.sign);

    // inner
    const inner = document.createElement('div');
    inner.className = 'inner';
    for (let i = 0; i < 4; i++) {
      const window = document.createElement('div');
      window.className = 'window';
      for (let j = 0; j < 4; j++) {
        const edge = document.createElement('div');
        edge.className = 'edge';
        this.edges.push(edge);
        window.appendChild(edge);
      }
      inner.appendChild(window);
    }

    // over
    const over = document.createElement('div');
    over.id = 'over';
    for (let j = 0; j < 6; j++) {
      const overlap = document.createElement('div');
      overlap.className = 'overlap';
      this.overlaps.push(overlap);
      over.appendChild(overlap);
    }
    inner.appendChild(over);

    // left edge
    this.lEdge = document.createElement('div');
    this.lEdge.className = 'lEdge';
    inner.appendChild(this.lEdge);

    // top edge
    this.tEdge = document.createElement('div');
    this.tEdge.className = 'tEdge';
    inner.appendChild(this.tEdge);

    // top edge
    const handler = document.createElement('div');
    handler.className = 'handler';
    inner.appendChild(handler);

    this.door.appendChild(inner);

    // cover
    this.cover = document.createElement('div');
    this.cover.className = 'cover';
    this.door.appendChild(this.cover);

    // stone
    this.stone = document.createElement('div');
    this.stone.className = 'stone';
    this.stoneDiv = document.createElement('div');
    this.stone.appendChild(this.stoneDiv);
    this.door.appendChild(this.stone);

    // roads
    const roads = document.createElement('div');
    roads.id = 'roads';
    for (let j = 0; j < 4; j++) {
      const road = document.createElement('div');
      road.className = 'road';
      this.roads.push(road);
      roads.appendChild(road);
    }
    this.door.appendChild(roads);

    // dye
    const {
      text = this.defaultConfig.text,
      backgroundUrl = this.defaultConfig.backgroundUrl,
      doorColor = this.defaultConfig.doorColor,
      rimColor = this.defaultConfig.rimColor,
      stoneColor = this.defaultConfig.stoneColor,
      stoneSurfaceColor = this.defaultConfig.stoneSurfaceColor,
      signColor = this.defaultConfig.signColor,
      signBorderColor = this.defaultConfig.signBorderColor,
      signMessageColor = this.defaultConfig.signMessageColor,
      roadColor = this.defaultConfig.roadColor,
    } = this.config;
    this.setText(text);
    this.dye({
      text,
      backgroundUrl,
      doorColor,
      rimColor,
      stoneColor,
      stoneSurfaceColor,
      signColor,
      signBorderColor,
      signMessageColor,
      roadColor,
    });
  };
}

export default Door;

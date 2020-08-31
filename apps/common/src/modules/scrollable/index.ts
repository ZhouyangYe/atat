import './index.less';

export interface IConfig {
  /** scroll speed */
  speed?: number;
  /** scroll bar color */
  color?: string;
  /** mouse sensitivity to open scroll bar */
  sensitiveIndicator?: number;
  /** auto hide scroll bar delay */
  delay?: number;
  /** indicate whether to scroll smoothly when dragging scroll bar */
  smoothScrolling?: boolean;
}

class ScrollableContainer {
  private defaultConfig: IConfig = {
    sensitiveIndicator: 30,
    delay: 3000,
    speed: 200,
    color: '#000',
    smoothScrolling: false,
  };

  private config: IConfig;

  /** scrollable container */
  private dom: HTMLElement;

  /** scrollable content container */
  private wrap: HTMLElement;

  /** scroll bar container */
  private scrollContainer: HTMLElement;

  /** indicates if scroll bar container is opened */
  private isOpened = false;

  /** scroll bar */
  private scrollBar: HTMLElement;

  /** indicates if scroll bar is pressed */
  private isScrollBarMouseDown = false;

  /** timer to auto collapse scroll bar container */
  private collapseTimer: NodeJS.Timeout = null;

  /** indicates if cursor is over scroll bar container */
  private isCursorOverBarContainer = false;

  constructor(dom: HTMLElement, config?: IConfig) {
    this.dom = dom;
    this.config = config || this.defaultConfig;
    this.buildScrollContainer();
    this.buildScrollBar();

    const fragment = new DocumentFragment();
    fragment.appendChild(this.wrap);
    fragment.appendChild(this.scrollContainer);
    this.dom.appendChild(fragment);
  }

  getDom = (): HTMLElement => {
    return this.dom;
  };

  getContainer = (): HTMLElement => {
    return this.wrap;
  };

  onResize = (): void => {
    const height = this.dom.clientHeight;
    const wrapHeight = this.wrap.clientHeight;

    // Need to add scroll bar
    if (height < wrapHeight) {
      this.scrollContainer.style.display = 'block';
      this.onScrollBarResize(height, wrapHeight);
    } else {
      this.scrollContainer.style.display = 'none';
    }
  };

  private openContainer = () => {
    clearTimeout(this.collapseTimer);
    if (!this.isScrollBarMouseDown && !this.isOpened) {
      this.isOpened = true;
      this.scrollContainer.style.width = '12px';
      this.scrollBar.style.opacity = '0.5';
    }
  };

  private collapseContainer = () => {
    if (this.isOpened) {
      this.isOpened = false;
      this.scrollContainer.style.width = '0';
      this.scrollBar.style.opacity = '0';
    }
  }

  private hideContainerAfterDelay = () => {
    const { delay = this.defaultConfig.delay } = this.config;
    if (!this.isScrollBarMouseDown && this.isOpened) {
      clearTimeout(this.collapseTimer);
      this.collapseTimer = setTimeout(() => {
        this.collapseContainer();
      }, delay);
    }
  };

  private buildScrollContainer = (): void => {
    const {
      sensitiveIndicator = this.defaultConfig.sensitiveIndicator,
    } = this.config;

    this.dom.style.overflow = 'hidden';
    this.dom.style.position = 'relative';

    /** scroll content */
    this.wrap = document.createElement('div');
    this.wrap.className = 'scroll-content';

    /** whether scroll bar has been opened */
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.className = 'scroll-bar-container';

    let prevX: number;
    this.wrap.onmousemove = (evt) => {
      if (!prevX) {
        prevX = evt.clientX;
      }
      const delta = evt.clientX - prevX
      prevX = evt.clientX;
      if (delta > sensitiveIndicator) {
        this.openContainer();
        this.hideContainerAfterDelay();
      }
    };

    this.scrollContainer.onmouseenter = () => {
      this.isCursorOverBarContainer = true;
      this.openContainer();
      clearTimeout(this.collapseTimer);
    };

    this.scrollContainer.onmouseleave = () => {
      this.isCursorOverBarContainer = false;
      this.hideContainerAfterDelay();
    };

    // make sure scroll bar is opened when wheel event is triggered
    const handleWheel = () => {
      this.openContainer();
      this.hideContainerAfterDelay();
    };
    this.wrap.addEventListener('wheel', handleWheel, false);
  };

  /**
   * @description recalculate the size of scroll bar and update events handler
   * @param containerHeight height of container
   * @param contentHeight height of content
   */
  private onScrollBarResize = (containerHeight: number, contentHeight: number) => {
    const {
      speed = this.defaultConfig.speed,
      smoothScrolling = this.defaultConfig.smoothScrolling,
    } = this.config;

    const ratio = containerHeight / contentHeight;
    /** scroll bar height */
    const height = this.scrollContainer.clientHeight * ratio;
    this.scrollBar.style.height = height > 10 ? `${Math.floor(height)}px` : '10px';
    /** scroll container height minus scroll content height */
    const delta = containerHeight - contentHeight;
    /** scroll bar container height minus scroll bar height */
    const deltaHeight = containerHeight - height;

    // wheel
    const getTop = (top: number) => {
      if (top > 0) {
        return 0;
      } else if (top < delta) {
        return delta;
      }

      return top;
    };

    const scrollTo = (yAxis: number) => {
      this.wrap.style.top = `${Math.floor(yAxis)}px`;
    };

    let y = getTop(this.wrap.offsetTop);
    scrollTo(y);

    this.dom.onwheel = (evt) => {
      if (evt.deltaY > 0) {
        y -= speed;
      } else {
        y += speed;
      }

      y = getTop(y);

      const barRatio = y / delta;
      const barTop = deltaHeight * barRatio;
      this.scrollBar.style.top = `${barTop}px`;

      scrollTo(y);
    };

    // drag
    const barDelta = containerHeight - height;
    const getBarTop = (barY: number) => {
      if (barY < 0) {
        return 0;
      } else if (barY > barDelta) {
        return barDelta;
      }

      return barY;
    };

    this.scrollBar.onmousedown = (event) => {
      const initY = event.clientY;
      const initTop = this.scrollBar.offsetTop;
      this.scrollBar.style.transition = 'none';
      this.scrollBar.style.opacity = '0.7';
      this.isScrollBarMouseDown = true;
      if (!smoothScrolling) {
        this.wrap.style.transition = 'none';
      }

      document.onmousemove = (evt) => {
        const bDelta = evt.clientY - initY;
        const top = getBarTop(initTop + bDelta);
        const barRatio = top / deltaHeight;
        y = getTop(barRatio * delta);
        this.scrollBar.style.top = `${top}px`;
        scrollTo(y);
      }

      document.onmouseup = () => {
        this.isScrollBarMouseDown = false;
        if (!this.isCursorOverBarContainer) {
          this.hideContainerAfterDelay();
        }
        document.onmousemove = undefined;
        document.onmouseup = undefined;
        this.scrollBar.style.transition = 'all 0.7s ease';
        this.scrollBar.style.opacity = '0.5';
        if (!smoothScrolling) {
          this.wrap.style.transition = 'top 0.7s ease';
        }
      };
    }
  };

  private buildScrollBar = () => {
    const {
      color = this.defaultConfig.color,
    } = this.config;

    this.scrollBar = document.createElement('div');
    this.scrollBar.className = 'scroll-bar';
    this.scrollBar.style.background = color;

    this.scrollContainer.appendChild(this.scrollBar);
  };
}

export default ScrollableContainer;

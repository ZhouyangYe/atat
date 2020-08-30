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

const getScrollBar = (scrollContainer: HTMLElement, config?: IConfig) => {
  const { speed = 200, color = '#000', smoothScrolling = false } = config || {};

  const scrollBar = document.createElement('div');
  scrollBar.className = 'scroll-bar';
  scrollBar.style.background = color;

  scrollContainer.appendChild(scrollBar);

  const onResize = (container: HTMLElement, content: HTMLElement) => {
    const containerHeight = container.clientHeight;
    const contentHeight = content.clientHeight;
    const ratio = containerHeight / contentHeight;
    /** scroll bar height */
    const height = scrollContainer.clientHeight * ratio;
    scrollBar.style.height = height > 10 ? `${Math.floor(height)}px` : '10px';
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
      content.style.top = `${Math.floor(yAxis)}px`;
    };

    let y = getTop(content.offsetTop);
    scrollTo(y);

    container.onwheel = (evt) => {
      if (evt.deltaY > 0) {
        y -= speed;
      } else {
        y += speed;
      }

      y = getTop(y);

      const barRatio = y / delta;
      const barTop = deltaHeight * barRatio;
      scrollBar.style.top = `${barTop}px`;

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

    scrollBar.onmousedown = (event) => {
      const initY = event.clientY;
      const initTop = scrollBar.offsetTop;
      scrollBar.style.transition = 'none';
      scrollBar.style.opacity = '0.7';
      if (!smoothScrolling) {
        content.style.transition = 'none';
      }

      document.onmousemove = (evt) => {
        const bDelta = evt.clientY - initY;
        const top = getBarTop(initTop + bDelta);
        const barRatio = top / deltaHeight;
        y = getTop(barRatio * delta);
        scrollBar.style.top = `${top}px`;
        scrollTo(y);
      }

      document.onmouseup = () => {
        document.onmousemove = undefined;
        document.onmouseup = undefined;
        scrollBar.style.transition = 'all 0.7s ease';
        scrollBar.style.opacity = '0.5';
        if (!smoothScrolling) {
          content.style.transition = 'top 0.7s ease';
        }
      };
    }
  };

  return {
    scrollBar,
    onResize,
  };
};

/**
 * @description make dom scrollable
 * @param dom scrollable content container
 * @param config scroll configuration
 */
export const getScrollContainer = (dom: HTMLElement, config?: IConfig): { onResize: () => void; container: HTMLElement } => {
  const { sensitiveIndicator = 4, delay = 3000 } = config || {};

  dom.style.overflow = 'hidden';
  dom.style.position = 'relative';

  /** scroll content */
  const wrap = document.createElement('div');
  wrap.className = 'scroll-content';
  
  /** whether scroll bar is clicked */
  let isMouseDown = false;
  /** whether scroll bar has been opened */
  let isOpened = false;
  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'scroll-bar-container';
  const { onResize: onScrollBarResize, scrollBar } = getScrollBar(scrollContainer, config);
  let collapseTimer: NodeJS.Timeout = null;
  // handle scroll bar collapse
  const collapseContainer = () => {
    if (isOpened) {
      isOpened = false;
      scrollContainer.style.width = '0';
      scrollBar.style.opacity = '0';
    }
  };
  const hideContainerAfterDelay = () => {
    if (!isMouseDown && isOpened) {
      clearTimeout(collapseTimer);
      collapseTimer = setTimeout(() => {
        collapseContainer();
      }, delay);
    }
  };
  // handle scroll bar open
  const openContainer = () => {
    clearTimeout(collapseTimer);
    if (!isMouseDown && !isOpened) {
      isOpened = true;
      scrollContainer.style.width = '12px';
      scrollBar.style.opacity = '0.5';
    }
  };

  dom.appendChild(wrap);
  dom.appendChild(scrollContainer);

  let prevX: number;
  wrap.onmousemove = (evt) => {
    if (!prevX) {
      prevX = evt.clientX;
    }
    const delta = evt.clientX - prevX
    prevX = evt.clientX;
    if (Math.abs(delta) > sensitiveIndicator) {
      openContainer();
      hideContainerAfterDelay();
    }
  };

  let isInside = false;
  scrollContainer.onmouseenter = () => {
    isInside = true;
    openContainer();
    clearTimeout(collapseTimer);
  };

  scrollContainer.onmouseleave = () => {
    isInside = false;
    hideContainerAfterDelay();
  };

  // make sure scroll bar not hide after mouse pressed
  const handleScrollBarDown = () => {
    isMouseDown = true;
    const handleScrollBarUp = () => {
      isMouseDown = false;
      if (!isInside) {
        hideContainerAfterDelay();
      }
      document.removeEventListener('mouseup', handleScrollBarUp, false);
    }
    document.addEventListener('mouseup', handleScrollBarUp, false);
  };
  scrollBar.addEventListener('mousedown', handleScrollBarDown, false);

  // make sure scroll bar is opened when wheel event is triggered
  const handleWheel = () => {
    openContainer();
    hideContainerAfterDelay();
  };
  wrap.addEventListener('wheel', handleWheel, false);

  const onResize = () => {
    const height = dom.clientHeight;
    const wrapHeight = wrap.clientHeight;

    // Need to add scroll bar
    if (height < wrapHeight) {
      scrollContainer.style.display = 'block';
      onScrollBarResize(dom, wrap);
    } else {
      scrollContainer.style.display = 'none';
    }
  };

  return {
    onResize,
    container: wrap,
  };
};

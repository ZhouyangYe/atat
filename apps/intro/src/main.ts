import { getIntroInfo } from 'atat-common/lib/services/intro';
import { getFullUrl } from 'atat-common/lib/utils';

const createWelcomeSection = () => {
  const welcomeSection = document.createElement('section');
  welcomeSection.id = 'welcome';

  return welcomeSection;
};

const createAboutSection = () => {
  const aboutSection = document.createElement('section');
  aboutSection.id = 'about';

  const content = document.createElement('main');
  content.className = 'why';

  const p1 = document.createElement('p');
  p1.innerHTML = '做这个网站并没有特别明确的目的性，只是感觉工作以后多了许多束缚，没有办法随心所欲地做自己想做的事情。';
  const p2 = document.createElement('p');
  p2.innerHTML = '希望可以通过这个网站做点自己觉得有意思的东西，同时锻炼一下自己的能力。';
  const p3 = document.createElement('p');
  const reference = document.createElement('a');
  reference.className = 'reference';
  reference.target = '_blank';
  reference.href = 'https://github.com/ZhouyangYe/atat';
  reference.innerHTML = 'https://github.com/ZhouyangYe/atat';
  p3.innerHTML = '代码地址：';
  p3.appendChild(reference);

  content.appendChild(p1);
  content.appendChild(p2);
  content.appendChild(p3);

  aboutSection.appendChild(content);

  return aboutSection;
};

const createContentSection = () => {
  const contentSection = document.createElement('section');
  contentSection.id = 'content';

  return contentSection;
};

interface Config {
  speed?: number;
  color?: string;
  width?: number;
}
const getScrollBar = (scrollContainer: HTMLElement, config?: Config) => {
  const scrollBar = document.createElement('div');
  scrollBar.className = 'scroll-bar';

  scrollContainer.appendChild(scrollBar);

  const speed = config?.speed || 200;

  const onResize = (container: HTMLElement, content: HTMLElement) => {
    const containerHeight = container.clientHeight;
    const contentHeight = content.clientHeight;
    const ratio = containerHeight / contentHeight;
    const height = scrollContainer.clientHeight * ratio;
    scrollBar.style.height = height > 10 ? `${Math.floor(height)}px` : '10px';
    const delta = containerHeight - contentHeight;
    const deltaHeight = containerHeight - height;

    const getTop = (top: number) => {
      if (top > 0) {
        return 0;
      } else if (top < delta) {
        return delta;
      }

      return top;
    };

    const onScroll = (yAxis: number) => {
      content.style.top = `${yAxis}px`;
    };

    let y = getTop(content.offsetTop);
    onScroll(y);

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

      onScroll(y);
    };

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

      document.onmousemove = (evt) => {
        const bDelta = evt.clientY - initY;
        const top = getBarTop(initTop + bDelta);
        const barRatio = top / deltaHeight;
        y = getTop(barRatio * delta);
        scrollBar.style.top = `${top}px`;
        onScroll(y);
      }

      document.onmouseup = () => {
        document.onmousemove = undefined;
        document.onmouseup = undefined;
        scrollBar.style.transition = 'all 0.7s ease';
      };
    }
  };

  return {
    scrollBar,
    onResize,
  };
};

const getScrollContainer = (dom: HTMLElement) => {
  dom.style.overflow = 'hidden';
  dom.style.position = 'relative';
  const wrap = document.createElement('div');
  wrap.className = 'scroll-content';

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'scroll-bar-container';
  const { onResize: onScrollBarResize } = getScrollBar(scrollContainer);

  dom.appendChild(wrap);
  dom.appendChild(scrollContainer);

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

const main = (app: HTMLElement): void => {
  const { container, onResize } = getScrollContainer(app);
  const welcomeSection = createWelcomeSection();
  const aboutSection = createAboutSection();
  const contentSection = createContentSection();

  container.appendChild(welcomeSection);
  container.appendChild(aboutSection);
  container.appendChild(contentSection);

  getIntroInfo().then((res) => {
    if (res.success) {
      if (!res.data) {
        return;
      }

      const { backgrounds } = res.data;

      const background1 = backgrounds?.find(item => item.orders === 1);
      if (background1) {
        welcomeSection.style.backgroundImage = `url(${getFullUrl(`${background1.path}/${background1.name}`)})`;
      }

      const background2 = backgrounds?.find(item => item.orders === 2);
      if (background2) {
        contentSection.style.backgroundImage = `url(${getFullUrl(`${background2.path}/${background2.name}`)})`;
      }
    }
  });

  onResize();

  window.onresize = () => {
    onResize();
  };
};

export default main;

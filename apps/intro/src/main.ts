import { getIntroInfo } from 'atat-common/lib/services/intro';
import { getFullUrl } from 'atat-common/lib/utils';
import ScrollableContainer from 'atat-common/lib/modules/scrollable';
import Door from 'atat-common/lib/modules/door';
import Audio from 'atat-common/lib/modules/audio';
import Scroll, { TYPE } from 'atat-common/lib/modules/scroll';
import Crystal from 'atat-common/lib/modules/crystal';
import Lamp from 'atat-common/lib/modules/lamp';
import BouncingStar from './components/BouncingStar';
import Resume from './components/Resume';

import 'atat-common/lib/modules/scrollable/index.css';
import 'atat-common/lib/modules/door/index.css';
import 'atat-common/lib/modules/audio/index.css';
import 'atat-common/lib/modules/scroll/index.css';
import 'atat-common/lib/modules/crystal/index.css';
import 'atat-common/lib/modules/lamp/index.css';

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
  p1.innerHTML = '做这个网站并没有什么特别明确的目的性，想写些什么就写些什么，主要用来尝试一些自己感兴趣的技术。';
  const p2 = document.createElement('p');
  p2.innerHTML = `There is no specific plan for creating this website, just trying to come up with some interesting ideas and implement them here using web technologies as a practice.`;
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

const render = (app: HTMLElement): void => {
  const scrollableContainer = new ScrollableContainer(app);
  const container = scrollableContainer.getContainer();
  const { onResize } = scrollableContainer;

  const welcomeSection = createWelcomeSection();
  const aboutSection = createAboutSection();
  const contentSection = createContentSection();

  const door = new Door({ href: '/home' });
  const doorDom = door.getDom();

  const star = new BouncingStar(container);
  const starDom = star.getDom();

  const resume = new Resume(window.location.hash === '#resume');
  const resumeDom = resume.getDom();

  const audio = new Audio({
    src: '/@resources/dynamic/audios/sword.mp3',
    title: '武林群侠传·剑庐',
  });
  const audioDom = audio.getDom();

  const scroll = new Scroll({
    title: 'Hello!',
    items: [
      {
        type: TYPE.EMAIL,
        text: 'zye0821@gmail.com',
      },
      {
        type: TYPE.PHONE,
        text: '15268159839',
      },
      {
        type: TYPE.LINK,
        text: 'bewhat1wannabe',
        prefix: 'WeChat',
      },
      {
        type: TYPE.LINK,
        text: 'Zhouyang Ye',
        prefix: 'LinkedIn',
        link: 'https://ca.linkedin.com/in/zhouyang-ye-35445311a',
      },
      {
        type: TYPE.LINK,
        text: 'Zhouyang Ye',
        prefix: 'GitHub',
        link: 'https://github.com/ZhouyangYe/',
      },
      {
        type: TYPE.LINK,
        text: 'Zhouyang Ye',
        prefix: 'Resume',
      },
    ]
  });
  const scrollDom = scroll.getDom();
  const resumeBox = scrollDom.querySelector<HTMLDivElement>('.box-5');
  resumeBox.onclick = () => {
    resume.show();
  };

  const crystal = new Crystal();
  const crystalDom = crystal.getDom();

  const lamp = new Lamp();
  const lampDom = lamp.getDom();

  let prevX: number, prevY: number;
  const handleMouseMove = (evt: MouseEvent) => {
    const { clientX, clientY } = evt;
    if (!prevX) {
      prevX = clientX;
    }
    if (!prevY) {
      prevY = clientY;
    }
    const deltaX = clientX - prevX, deltaY = clientY - prevY;
    prevX = clientX;
    prevY = clientY;
    if (deltaX < -40) {
      door.show();
      lamp.show();
    }
    if (deltaY < -40) {
      audio.show();
      scroll.show();
    } else if (deltaY > 40) {
      crystal.show();
    }
  };
  document.addEventListener('mousemove', handleMouseMove, false);

  const fragment = new DocumentFragment();
  fragment.appendChild(audioDom);
  fragment.appendChild(doorDom);
  fragment.appendChild(starDom);
  fragment.appendChild(resumeDom);
  fragment.appendChild(scrollDom);
  fragment.appendChild(crystalDom);
  fragment.appendChild(lampDom);
  fragment.appendChild(welcomeSection);
  fragment.appendChild(aboutSection);
  fragment.appendChild(contentSection);
  container.appendChild(fragment);
  // recalculate size after container has been filled
  onResize();
  resume.onResize();

  const handleDoubleClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };
  document.addEventListener('dblclick', handleDoubleClick, false);

  const handleRightClick = (evt: MouseEvent) => {
    evt.preventDefault();
    scrollableContainer.showBar();
    door.show();
    audio.show();
    scroll.show();
    lamp.show();
    crystal.show();
  };
  document.addEventListener('contextmenu', handleRightClick, false);

  const handleClick = () => {
    scrollableContainer.hideBar();
    door.hide();
    audio.hide();
    scroll.hide();
    lamp.hide();
    crystal.hide();
  };
  document.addEventListener('click', handleClick, false);

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

  window.onresize = () => {
    onResize();
    resume.onResize();
  };
};

export default render;

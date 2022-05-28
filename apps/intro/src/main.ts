import { getIntroInfo, getResumeData } from 'atat-common/lib/services/intro';
import message from 'atat-common/lib/modules/message';
import { getFullUrl } from 'atat-common/lib/utils';
import ScrollableContainer from 'atat-common/lib/modules/scrollable';
import Door from 'atat-common/lib/modules/door';
import Audio from 'atat-common/lib/modules/audio';
import Scroll, { TYPE } from 'atat-common/lib/modules/scroll';
import Crystal from 'atat-common/lib/modules/crystal';
import Lamp from 'atat-common/lib/modules/lamp';
import BouncingStar from './components/BouncingStar';
import Resume from 'atat-common/lib/modules/resume';

import 'atat-common/lib/modules/scrollable/index.css';
import 'atat-common/lib/modules/door/index.css';
import 'atat-common/lib/modules/audio/index.css';
import 'atat-common/lib/modules/scroll/index.css';
import 'atat-common/lib/modules/crystal/index.css';
import 'atat-common/lib/modules/lamp/index.css';
import 'atat-common/lib/modules/resume/index.css';

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
  p1.innerHTML = `做这个网站并没有什么特别明确的目的性，想到什么就写些什么，主要用来尝试一些自己感兴趣的技术。`;
  const clarification = document.createElement('p');
  clarification.innerHTML = `网站的素材：图片，音乐，都来自于网上，如有涉及侵权请联系删除更换：<a class='reference' href='mailto:810036635@qq.com'>810036635@qq.com</a>。`;
  const email = clarification.querySelector('a');
  email!.onmousedown = (e) => { e.stopPropagation(); };
  const p2 = document.createElement('p');
  p2.innerHTML = `There is no specific plan for creating this website, just trying to come up with some interesting ideas and implement them here using web technologies as a practice.`;
  const p3 = document.createElement('p');
  const reference = document.createElement('a');
  reference.className = 'reference';
  reference.target = '_blank';
  reference.href = 'https://github.com/ZhouyangYe/atat';
  reference.innerHTML = 'Github';
  reference.onmousedown = (e) => { e.stopPropagation(); };
  reference.onclick = (e) => { e.stopPropagation(); };
  p3.innerHTML = '代码：';
  p3.appendChild(reference);
  const p4 = document.createElement('p'), p5 = document.createElement('p'), p6 = document.createElement('p');
  p4.innerHTML = `主页：<a class='reference' href='/stories'>Blog</a>`;
  p4.onmousedown = (e) => { e.stopPropagation(); };
  p5.className = 'resume';
  p5.innerHTML = `简历：<a class='reference' href='javascript:void(0)'>Resume</a>`;
  p6.className = 'admin';
  p6.innerHTML = `Admin：<a class='reference' href='/admin'>Entry</a>`;

  const wrap = document.createElement('div');
  const wrap2 = document.createElement('div');
  wrap2.append(
    p1,
    clarification,
    p2,
    p5,
    p3,
    p4,
    p6,
  );
  wrap.append(wrap2);
  content.append(wrap);

  aboutSection.append(content);

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
  const { resize } = scrollableContainer;

  const welcomeSection = createWelcomeSection();
  const aboutSection = createAboutSection(), aboutResume = aboutSection.querySelector<HTMLDivElement>('.resume .reference')!;
  const contentSection = createContentSection();

  const door = new Door({ href: '/home' });
  const doorDom = door.getDom();

  const star = new BouncingStar(container);
  const starDom = star.getDom();

  const resume = new Resume({ show: window.location.hash === '#resume' });
  const resumeDom = resume.getDom();

  getResumeData().then((res) => {
    if (!res.success) {
      message.error('Failed to get resume.');
      return;
    }

    resume.setResumeData(res.data);
  });

  const audio = new Audio({
    src: '/@resources/dynamic/audios/sword.mp3',
    title: '武林群侠传·剑庐',
    autoplay: window.innerWidth > 700,
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
        type: TYPE.LINK,
        text: 'bewhat1wannabe',
        prefix: 'WeChat',
      },
      {
        type: TYPE.PHONE,
        text: '15268159839',
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
        text: 'Entry',
        prefix: 'Admin',
        link: '/admin',
      },
      {
        type: TYPE.LINK,
        text: 'Zhouyang Ye',
        prefix: 'Resume',
      },
    ],
  });
  const scrollDom = scroll.getDom();
  const resumeBox = scrollDom.querySelector<HTMLAnchorElement>('.box-6 a')!;
  resumeBox.onclick = () => {
    resume.show();
  };
  aboutResume.onclick = () => {
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
      audio.hide();
      scroll.hide();
      crystal.hide();
    }
    if (deltaY < -40) {
      audio.show();
      scroll.show();
      door.hide();
      lamp.hide();
      crystal.hide();
    } else if (deltaY > 40) {
      crystal.show();
      audio.hide();
      scroll.hide();
      door.hide();
      lamp.hide();
    }
  };
  document.addEventListener('mousemove', handleMouseMove, false);

  const fragment = new DocumentFragment();
  fragment.append(
    audioDom,
    doorDom,
    starDom,
    resumeDom,
    scrollDom,
    crystalDom,
    lampDom,
    welcomeSection,
    aboutSection,
    contentSection,
  );
  container.appendChild(fragment);
  // recalculate size after container has been filled
  resize();
  resume.resize();

  const handleDoubleClick = () => {
    if (window.innerWidth < 700) {
      return;
    }
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
    } else {
      welcomeSection.style.backgroundImage = `url(@resources/dynamic/images/album/dream.jpg)`;
      contentSection.style.backgroundImage = `url(@resources/dynamic/images/album/land.jpg)`;
    }
  }).catch(() => {
    welcomeSection.style.backgroundImage = `url(@resources/dynamic/images/album/dream.jpg)`;
    contentSection.style.backgroundImage = `url(@resources/dynamic/images/album/land.jpg)`;
  });

  window.onresize = () => {
    resize();
    resume.resize();
  };
};

export default render;

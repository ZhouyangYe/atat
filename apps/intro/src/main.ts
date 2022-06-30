import { getIntroInfo, getResumeData } from 'atat-common/lib/services/intro';
import message from 'atat-common/lib/modules/message';
import { getFullUrl, getLeft, getTop } from 'atat-common/lib/utils';
import ScrollableContainer from 'atat-common/lib/modules/scrollable';
import Door from 'atat-common/lib/modules/door';
import Audio from 'atat-common/lib/modules/audio';
import Scroll, { TYPE } from 'atat-common/lib/modules/scroll';
import Crystal from 'atat-common/lib/modules/crystal';
import Lamp from 'atat-common/lib/modules/lamp';
import BouncingStar from './components/BouncingStar';
import Resume from 'atat-common/lib/modules/resume';

const createWelcomeSection = () => {
  const welcomeSection = document.createElement('section');
  welcomeSection.id = 'welcome';
  
  const poem = '男儿到死心如铁 看试手 补天裂';
  const sentences = poem.split(' ');
  welcomeSection.innerHTML = `
    <div class="poem">
      ${sentences.map((sentence) => {
        const words = sentence.split('');
        return `<div class="sentence"><span>${words.join('</span><span>')}</span></div>`;
      }).join('')}
    </div>
  `;

  return welcomeSection;
};

const createAboutSection = () => {
  const aboutSection = document.createElement('section');
  aboutSection.id = 'about';

  const content = document.createElement('main');
  content.className = 'why';

  const profile = document.createElement('div');
  profile.className = 'profile';
  const p1 = document.createElement('p');
  p1.innerHTML = `开发这个网站没有什么特别明确的目的性，想到什么就写些什么，用来尝试一些自己感兴趣的技术。`;
  const clarification = document.createElement('p');
  clarification.innerHTML = `网站的一部分素材：图片，音乐，canvas背景等来自于网上（代码中有标注license和地址），如有涉及侵权请联系删除更换：<a class='reference' href='mailto:810036635@qq.com'>810036635@qq.com</a>。`;
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
  p4.innerHTML = `主页：<a class='reference' href='/'>Blog</a>`;
  p4.onmousedown = (e) => { e.stopPropagation(); };
  p5.className = 'resume';
  p5.innerHTML = `简历：<a class='reference' href='javascript:void(0)'>Resume</a>`;
  p6.className = 'admin';
  p6.innerHTML = `管理：<a class='reference' href='/admin'>Admin</a>`;

  const wrap = document.createElement('div');
  const wrap2 = document.createElement('div');
  wrap2.append(
    profile,
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
  
  const poem = '朝如青丝暮成雪 高堂明镜悲白发 君不见 奔流到海不复回 黄河之水天上来 君不见';
  const sentences = poem.split(' ');
  contentSection.innerHTML = `
    <div class="poem">
      ${sentences.map((sentence) => {
        const words = sentence.split('');
        return `<div class="sentence"><span>${words.join('</span><span>')}</span></div>`;
      }).join('')}
    </div>
  `;

  return contentSection;
};

const handleCat = () => {
  const hole = document.getElementById('hole') as HTMLDivElement;
  const cat = hole.querySelector<HTMLDivElement>('#cat')!;
  const home = cat.querySelector<HTMLDivElement>('#home')!;
  const handle = cat.querySelector<HTMLDivElement>('.handle')!;
  let disabled = false, timer: NodeJS.Timeout;

  const
    catWidth = cat.clientWidth, catHeight = cat.clientHeight;

  const holeRadius = 200, holeRadius2 = 40000;
  let holeCenter = { x: window.innerWidth / 2, y: window.innerHeight - 20 - holeRadius };

  const detect = (left: number, top: number) => {
    const topLeftIn = Math.pow(left - holeCenter.x, 2) + Math.pow(top - holeCenter.y, 2) < holeRadius2;
    const topRightIn = Math.pow(left + catWidth - holeCenter.x, 2) + Math.pow(top - holeCenter.y, 2) < holeRadius2;
    const bottomLeftIn = Math.pow(left - holeCenter.x, 2) + Math.pow(top + catHeight - holeCenter.y, 2) < holeRadius2;
    const bottomRightIn = Math.pow(left + catWidth - holeCenter.x, 2) + Math.pow(top + catHeight - holeCenter.y, 2) < holeRadius2;

    const contain = topLeftIn && topRightIn && bottomLeftIn && bottomRightIn;
    const collide = topLeftIn || topRightIn || bottomLeftIn || bottomRightIn;

    return {
      contain,
      collide,
    };
  };

  cat.onmouseenter = (e) => {
    e.stopPropagation();
  };

  cat.onmouseleave = (e) => {
    e.stopPropagation();
  };

  hole.onmousedown = (e) => {
    e.stopPropagation();
  };

  const offsetPos1 = 200, offsetPos2 = 155;

  const x1 = -153, y1 = -118;
  const x2 = -108, y2 = -73;
  hole.onclick = () => {
    hole.classList.remove('hide');
    cat.style.left = `${x1 + offsetPos1}px`;
    cat.style.top = `${y1 + offsetPos1}px`;
    disabled = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      disabled = false;
    }, 200);
  };
  hole.onmouseleave = () => {
    hole.classList.add('hide');
    cat.style.left = `${x2}px`;
    cat.style.top = `${y2}px`;
    disabled = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      disabled = false;
    }, 200);
  }

  hole.addEventListener('click', (e) => {
    e.stopPropagation();
  }, false);

  hole.addEventListener('contextmenu', (e) => {
    e.stopPropagation();
  }, false);

  window.addEventListener('click', () => {
    if (disabled) return;
    disabled = true;
    if (cat.classList.contains('hide') && !hole.classList.contains('hidden')) {
      const
        currentX = cat.offsetLeft,
        currentY = cat.offsetTop,
        delta = 45;
      cat.style.left = `${currentX - delta}px`;
      cat.style.top = `${currentY - delta}px`;
    }
    hole.classList.add('hidden');

    setTimeout(() => {
      disabled = false;
    }, 200);
  }, false);

  window.addEventListener('contextmenu', () => {
    if (disabled) return;
    disabled = true;
    if (cat.classList.contains('hide') && hole.classList.contains('hidden')) {
      const
        currentX = cat.offsetLeft,
        currentY = cat.offsetTop,
        delta = 45;
      cat.style.left = `${currentX + delta}px`;
      cat.style.top = `${currentY + delta}px`;
    }
    hole.classList.remove('hidden');

    setTimeout(() => {
      disabled = false;
    }, 200);
  }, false);

  handle.onmousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (cat.classList.contains('hide')) {
      hole.onclick = null;
      hole.onmouseleave = null;
      cat.classList.remove('hide');
      home.style.boxShadow = '2px 2px 6px 3px rgb(0, 0, 0, 0.8)';
      setTimeout(() => {
        cat.style.left = `${cat.offsetLeft + holeCenter.x - holeRadius}px`;
        cat.style.top = `${cat.offsetTop + holeCenter.y - holeRadius}px`;
        cat.style.position = 'fixed';
      }, 18);
    }
    const
      originX = e.clientX, originY = e.clientY,
      deltaX = originX - getLeft(cat), deltaY = originY - getTop(cat),
      windowWidth = window.innerWidth, windowHeight = window.innerHeight,
      boundX = windowWidth - catWidth, boundY = windowHeight - catHeight;

    let left = originX - deltaX, top = originY - deltaY, isContain = false;

    const handleMove = (event: MouseEvent) => {
      left = event.clientX - deltaX, top = event.clientY - deltaY;
      left = left < 0 ? 0 : left > boundX ? boundX : left;
      top = top < 30 ? 30 : top > boundY ? boundY : top;

      const { contain, collide } = detect(left, top);
      isContain = contain;
      if (contain) {
        hole.classList.add('active');
      } else {
        hole.classList.remove('active');
      }

      if (collide) {
        hole.classList.remove('hidden', 'hide');
      } else {
        hole.classList.add('hidden');
      }

      cat.style.left = `${left}px`;
      cat.style.top = `${top}px`;
    };
    window.addEventListener('mousemove', handleMove, false);

    const handleUp = () => {
      if (isContain) {
        const currentX = left - holeCenter.x + holeRadius, currentY = top - holeCenter.y + holeRadius;
        cat.style.left = `${currentX}px`;
        cat.style.top = `${currentY}px`;
        cat.style.position = 'absolute';
        home.style.boxShadow = 'none';
        hole.onclick = () => {
          hole.classList.remove('hide');
          cat.style.left = `${currentX}px`;
          cat.style.top = `${currentY}px`;
          disabled = true;
          clearTimeout(timer);
          timer = setTimeout(() => {
            disabled = false;
          }, 200);
        };
        hole.onmouseleave = () => {
          hole.classList.add('hide');
          cat.classList.add('hide');
          cat.style.left = `${currentX - offsetPos2}px`;
          cat.style.top = `${currentY - offsetPos2}px`;
          disabled = true;
          clearTimeout(timer);
          timer = setTimeout(() => {
            disabled = false;
          }, 200);
        }
        disabled = true;
        setTimeout(() => {
          hole.classList.add('hide');
          cat.classList.add('hide');
          cat.style.left = `${currentX - offsetPos2}px`;
          cat.style.top = `${currentY - offsetPos2}px`;
          clearTimeout(timer);
          timer = setTimeout(() => {
            disabled = false;
          }, 200);
        }, 200);
      } else {
        hole.classList.add('hide');
      }
      window.removeEventListener('mousemove', handleMove, false);
      window.removeEventListener('mouseup', handleUp, false);
    }
    window.addEventListener('mouseup', handleUp, false);
  };

  return () => {
    if (!cat.classList.contains('hide')) {
      const
        windowWidth = window.innerWidth, windowHeight = window.innerHeight,
        boundX = windowWidth - catWidth, boundY = windowHeight - catHeight;

      let l = cat.offsetLeft, t = cat.offsetTop;
      l = l < 0 ? 0 : l > boundX ? boundX : l;
      t = t < 30 ? 30 : t > boundY ? boundY : t;

      cat.style.left = `${l}px`;
      cat.style.top = `${t}px`;
    }

    holeCenter = { x: window.innerWidth / 2, y: window.innerHeight - 20 - holeRadius };
  };
};

const render = (app: HTMLElement): void => {
  let moveDisabled = false;
  const catResize = handleCat();
  const scrollableContainer = new ScrollableContainer(app);
  const container = scrollableContainer.getContainer();
  const { resize } = scrollableContainer;

  const welcomeSection = createWelcomeSection(), poem = welcomeSection.querySelector<HTMLDivElement>('.poem')!;
  const aboutSection = createAboutSection(), aboutResume = aboutSection.querySelector<HTMLDivElement>('.resume .reference')!, about = aboutSection.querySelector<HTMLDivElement>('.why>div')!;
  const contentSection = createContentSection(), poem2 = contentSection.querySelector<HTMLDivElement>('.poem')!;

  const door = new Door({ href: '/home' });
  const doorDom = door.getDom();

  const star = new BouncingStar(container);
  const starDom = star.getDom();

  const audio = new Audio({
    src: '/@resources/dynamic/audios/sword.mp3',
    title: '武林群侠传·剑庐',
    autoplay: window.innerWidth > 700,
  });
  const audioDom = audio.getDom();

  const scroll = new Scroll({
    title: '你 好',
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
        text: 'Link',
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
  let scrollTimer: NodeJS.Timeout, scrollTimer2: NodeJS.Timeout;
  const
    scrollDom = scroll.getDom(),
    resumeBox = scrollDom.querySelector<HTMLAnchorElement>('.box-6 a')!;
  scrollDom.addEventListener('mouseenter', () => {
    clearTimeout(scrollTimer);
    clearTimeout(scrollTimer2);
    moveDisabled = true;
  }, false);
  scrollDom.addEventListener('mouseleave', () => {
    moveDisabled = true;
    clearTimeout(scrollTimer);
    clearTimeout(scrollTimer2);
    scrollTimer = setTimeout(() => {
      moveDisabled = false;
    }, 3000);
  }, false);

  const resume = new Resume({ show: window.location.hash === '#resume' });
  const resumeDom = resume.getDom();

  resume.onToggle = (open: boolean) => {
    if (open) {
      doorDom.style.display = 'none';
      scrollDom.style.display = 'none';
      poem.style.display = 'none';
      aboutSection.style.height = `${about.clientHeight}px`;
      about.style.display = 'none';
      poem2.style.display = 'none';
    } else {
      doorDom.style.display = 'block';
      scrollDom.style.display = 'block';
      poem.style.display = 'flex';
      aboutSection.style.height = 'auto';
      about.style.display = 'block';
      poem2.style.display = 'flex';
    }
  }

  getResumeData().then((res) => {
    if (!res.success) {
      message.error('Failed to get resume.');
      return;
    }

    resume.setResumeData(res.data);
  });

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

    if (moveDisabled) {
      return;
    }

    if (deltaX < -60) {
      door.show();
      lamp.show();
      audio.hide();
      scroll.hide();
      crystal.hide();

      moveDisabled = true;
  
      scrollTimer2 = setTimeout(() => {
        moveDisabled = false;
      }, 1000);
    } else if (deltaY < -60) {
      audio.show();
      scroll.show();
      door.hide();
      lamp.hide();
      crystal.hide();

      moveDisabled = true;
  
      scrollTimer2 = setTimeout(() => {
        moveDisabled = false;
      }, 1000);
    } else if (deltaY > 60) {
      crystal.show();
      audio.hide();
      scroll.hide();
      door.hide();
      lamp.hide();

      moveDisabled = true;
  
      scrollTimer2 = setTimeout(() => {
        moveDisabled = false;
      }, 1000);
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
  poem.classList.add('show');

  let containerHeight = container.clientHeight, windowHeight = window.innerHeight;
  scrollableContainer.onScroll = (top) => {
    if (top === 0) {
      poem.classList.add('show');
      return;
    } else if (containerHeight + top === windowHeight) {
      poem2.classList.add('show');
      return;
    }
    poem.classList.remove('show');
    poem2.classList.remove('show');
  };

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
      welcomeSection.style.backgroundImage = `url(@resources/static/wallpaper/grass.jpg)`;
      contentSection.style.backgroundImage = `url(@resources/static/wallpaper/room.jpg)`;
    }
  }).catch(() => {
    welcomeSection.style.backgroundImage = `url(@resources/static/wallpaper/grass.jpg)`;
    contentSection.style.backgroundImage = `url(@resources/static/wallpaper/room.jpg)`;
  });

  window.onresize = () => {
    resize();
    resume.resize();
    catResize();
    containerHeight = container.clientHeight;
    windowHeight = window.innerHeight;
  };
};

export default render;

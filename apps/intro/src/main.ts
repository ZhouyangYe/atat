import { getIntroInfo } from 'atat-common/lib/services/intro';
import { getFullUrl } from 'atat-common/lib/utils';
import { getScrollContainer } from 'atat-common/lib/modules/scrollable';

import 'atat-common/lib/modules/scrollable/index.css';

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

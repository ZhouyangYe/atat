import React, { useEffect, useRef, useState } from 'react';
import BasePage from '@/BasePage';
import SourceCode from '@/utils/SourceCode';

import 'atat-common/lib/modules/message/index.css';
import './index.less';

const Home: React.FC<any> = () => {
  const [ maxHeight, setMaxHeight ] = useState<string>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setMaxHeight(`calc(${ref.current.clientHeight}px - 98px)`);
      }
    };
    window.addEventListener('resize', handleResize, false);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize, false);
    };
  }, []);

  return (
    <BasePage className='home'>
      <aside ref={ref}>
        <p>
          这个网站是自己开发的一个个人网站, 使用了包括TypeScript, JavaScript, NodeJs, HTML, CSS, LESS, React, WebGL, THREE.js, Webpack, MySQL等一系列web相关技术。想要练习一些自己感兴趣的技术的时候就会把它们(强行<img src='@resources/static/materials/doge.png' />)使用在这个网站上用于练手。顺便作为开发技术博客的素材。
        </p>
        <p>
          本网站使用的部分资源(图片、音乐、canvas背景等)大都来自于网上和一些开源社区, 使用的外部代码都放在vendors目录并标有license和出处。所有内容仅用于个人, 不会作为商用, 如有涉及侵权请联系删除或更换：<a href="mailto:810036635@qq.com">810036635@qq.com</a>
        </p>
      </aside>
      <main>
        <SourceCode maxHeight={maxHeight} />
      </main>
    </BasePage>
  );
};

export default Home;

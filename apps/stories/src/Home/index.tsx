import React from 'react';
import BasePage from '@/BasePage';
import SourceCode from '@/utils/SourceCode';

import 'atat-common/lib/modules/message/index.css';
import './index.less';

const Home: React.FC<any> = () => {
  return (
    <BasePage className='home'>
      <aside>
        <p>
          这是基于TypeScript, JavaScript, NodeJs, HTML, CSS, LESS, React, Vue, WebGL, Webpack, MySQL等一系列web相关技术开发的一个个人网站。主要用来练手, 练习一些自己感兴趣和想要了解的技术算法等。
        </p>
        <p>
          本网站使用的部分资源(图片、音乐、canvas背景等)大都来自于网上和一些开源社区, 使用的外部代码都放在vendors目录并标有license和出处。所有内容仅用于个人, 不会作为商用, 如有涉及侵权请联系删除或更换：<a href="mailto:810036635@qq.com">810036635@qq.com</a>
        </p>
      </aside>
      <main>
        <SourceCode maxHeight={'calc(100vh - 12px)'} />
      </main>
    </BasePage>
  );
};

export default Home;

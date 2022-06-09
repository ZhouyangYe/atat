import React, { useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Articles from './Articles';
import Visualization from './Visualization';
import Album from './Album';
import NotFound from './NotFound';

import 'atat-common/lib/styles/index.css';
import './Root.less';

const RootComponent: React.FC = () => {
  const onClick = useCallback(() => {
    const
      basePage = document.querySelectorAll<HTMLDivElement>('.base-page'),
      app = document.querySelector<HTMLDivElement>('#app')!,
      header = document.querySelector<HTMLDivElement>('#blog-header')!;
    basePage.forEach((dom) => {
      dom.style.opacity = '0';
    });
    const height = header.clientHeight;
    app.onscroll = () => {
      const scrollTop = app.scrollTop;
      if (scrollTop >= height) {
        app.onscroll = () => {
          if (app.scrollTop < height) {
            basePage.forEach((dom) => {
              dom.style.opacity = '1';
            });
            app.onscroll = null;
          }
        }
      }
    }
    app.scrollTop = height;
  }, []);

  return (
    <BrowserRouter>
      <Header onClick={onClick} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path='/articles/:id' element={<Articles />} />
        <Route path='/album' element={<Album />} />
        <Route path='/album/:id' element={<Album />} />
        <Route path='/visualization' element={<Visualization />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer id="footer">
        <a href='https://beian.miit.gov.cn' rel="noreferrer" target="_blank" >浙ICP备2022016691号</a>
      </footer>
    </BrowserRouter>
  );
};

export default RootComponent;

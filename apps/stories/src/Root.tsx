import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Articles from './Articles';
import Visualization from './Visualization';
import Album from './Album';
import ArticleDetail from './detail/ArticleDetail';
import VisualizationDetail from './detail/VisualizationDetail';
import NotFound from './NotFound';

import 'atat-common/src/styles/normalize.css';
import 'atat-common/src/styles/index.less';
import './Root.less';

const RootComponent: React.FC = () => {
  return (
    <BrowserRouter basename='/stories'>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path='/album' element={<Album />} />
        <Route path='/visualization' element={<Visualization />} />
        <Route path="/detail/article/:id" element={<ArticleDetail />} />
        <Route path="/detail/visualization/:id" element={<VisualizationDetail/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RootComponent;

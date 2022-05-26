import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import Home from './Home';
import Article from './Article';

import 'atat-common/src/styles/normalize.css';
import 'atat-common/src/styles/index.less';
import './Root.less';

const RootComponent: React.FC = () => {
  return (
    <>
      <Menu />
      <BrowserRouter>
        <Routes>
          <Route path="/stories" element={<Home />} />
          <Route path="/stories/article" element={<Article />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RootComponent;

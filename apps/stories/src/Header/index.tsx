import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PAGE } from '@/enum';

import './index.less';

const colorMapping = {
  [PAGE.HOME]: 'rgba(0, 66, 97, 0.6)',
  [PAGE.ARTICLES]: 'rgba(22, 133, 46, 0.6)',
  [PAGE.ALBUM]: 'rgba(109, 0, 0, 0.6)',
  [PAGE.VISUALIZATION]: 'rgba(231, 133, 67, 0.6)',
  [PAGE.NOTFOUND]: 'rgba(0, 0, 0, 0.6)',
};

interface Params {
  onClick: () => void;
}

const Header: React.FC<Params> = ({ onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [bgColor, setBgColor] = useState<string>();

  useLayoutEffect(() => {
    const page = location.pathname.split('/')[1];
    const key = page === '' ? PAGE.HOME : page as PAGE;
    setBgColor(colorMapping[key] || colorMapping[PAGE.NOTFOUND]);
  }, [location]);

  const handleActive = useCallback(({ isActive }: { isActive: boolean }) => {
    return isActive ? 'nav active' : 'nav';
  }, []);

  return (
    <header id="blog-header" className='info'>
      <nav style={{ backgroundColor: bgColor }}>
        <a className='main' href="/intro"><img src="@resources/static/icons/home.svg" /></a>
        <div ref={ref} className='links'>
          <NavLink className={handleActive} to='/'>
            <div>
              <span className='ch'>主页</span> <span className='dot'>·</span> Home<div className='underline'></div>
            </div>
          </NavLink>
          <NavLink className={handleActive} to='/articles'>
            <div>
              <span className='ch'>日志</span> <span className='dot'>·</span> Articles<div className='underline'></div>
            </div>
          </NavLink>
          <NavLink className={handleActive} to='/album'>
            <div>
              <span className='ch'>相册</span> <span className='dot'>·</span> Album<div className='underline'></div>
            </div>
          </NavLink>
          <NavLink className={handleActive} to='/visualization'>
            <div>
              <span className='ch'>可视化</span> <span className='dot'>·</span> Visualization<div className='underline'></div>
            </div>
          </NavLink>
        </div>
      </nav>
      <div className='content'>
        <div className='profile' onClick={onClick}></div>
        <p>Web开发 · Game dev · 猫</p>
        <h3>常快活，便是功夫</h3>
      </div>
    </header>
  )
};

export default Header;

import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import './index.less';

const Header: React.FC<any> = () => {
  const handleActive = useCallback(({ isActive }: { isActive: boolean }) => {
    return isActive ? 'nav active' : 'nav';
  }, []);

  return (
    <header className='info'>
      <a className='main' href="/intro"><img src="@resources/static/icons/home.svg" /></a>
      <div className='profile'></div>
      <p>Web开发 · Game dev · 猫</p>
      <nav>
        <NavLink className={handleActive} to='/'><div>主页 <span>·</span> Home<div className='underline'></div></div></NavLink>
        <NavLink className={handleActive} to='/articles'><div>日志 <span>·</span> Articles<div className='underline'></div></div></NavLink>
        <NavLink className={handleActive} to='/album'><div>相册 <span>·</span> Album<div className='underline'></div></div></NavLink>
        <NavLink className={handleActive} to='/visualization'><div>可视化 <span>·</span> Visualization<div className='underline'></div></div></NavLink>
      </nav>
    </header>
  )
};

export default Header;

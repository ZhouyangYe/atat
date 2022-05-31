import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getLeft, getTop } from 'atat-common/lib/utils';

import './index.less';

interface Param {
  className: string;
  children: string | React.ReactElement | React.ReactElement[];
}

enum State {
  HIDE_RIGHT = 'hide-right',
  HIDE_LEFT = 'hide-left',
  SHOW = 'show',
}

const pages = ['home', 'articles', 'article-detail', 'album', 'visualization', 'visualization-detail', 'not-found'];

let prevPage: string;
let prevPageDom: HTMLDivElement | null = null;

const BasePage: React.FC<Param> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState(!prevPage ? State.SHOW : pages.indexOf(className) < pages.indexOf(prevPage) ? State.HIDE_LEFT : State.HIDE_RIGHT);

  prevPage = className;

  useEffect(() => {
    const root = document.querySelector<HTMLDivElement>('#app')!;
    const hold = ref.current!;

    let left: number, top: number, width: number;
    setTimeout(() => {
      left = getLeft(hold);
      top = getTop(hold);
      width = hold.clientWidth;
    }, 300);

    const handleResize = () => {
      left = getLeft(ref.current!);
      top = getTop(ref.current!);
      width = hold.clientWidth;
    };
    window.addEventListener('resize', handleResize, false);

    if (prevPageDom) {
      setTimeout(() => {
        prevPageDom!.style.left = state === State.HIDE_RIGHT ? '-100%' : '100%';
        prevPageDom!.style.opacity = '0';
      }, 18);
      setTimeout(() => {
        root.removeChild(prevPageDom!);
      }, 318);
    }
    setState(State.SHOW);

    return () => {
      window.removeEventListener('resize', handleResize, false);
      if (hold) {
        hold.style.position = 'absolute';
        hold.style.left = `${left}px`;
        hold.style.top = `${top}px`;
        hold.style.width = `${width}px`;
        root.appendChild(hold);

        prevPageDom = hold;
      }
    };
  }, []);

  return (
    <div ref={ref} className={`base-page ${state} ${className}`}>
      {children}
    </div>
  );
};

export default BasePage;

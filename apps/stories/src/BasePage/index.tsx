import React, { useEffect, useRef, useState } from 'react';
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
const toBeDestroyed: HTMLDivElement[] = [];
let timer: NodeJS.Timeout;

const BasePage: React.FC<Param> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState(!prevPage ? State.SHOW : pages.indexOf(className) < pages.indexOf(prevPage) ? State.HIDE_LEFT : State.HIDE_RIGHT);
  const [minHeight, setMinHeight] = useState<string | number>(0);

  prevPage = className;

  useEffect(() => {
    const
      root = document.querySelector<HTMLDivElement>('#app')!,
      header = document.querySelector<HTMLHeadingElement>('#blog-header')!,
      hold = ref.current!;

    requestAnimationFrame(() => {
      if (toBeDestroyed.length) {
        const prev = toBeDestroyed[toBeDestroyed.length - 1];
        prev.style.left = state === State.HIDE_RIGHT ? '-100%' : '100%';
        prev.style.opacity = '0';
      }

      clearTimeout(timer);
      timer = setTimeout(() => {
        while (toBeDestroyed.length) {
          const dom = toBeDestroyed.pop()!;

          root.removeChild(dom);
        }
      }, 300);
    });

    setMinHeight(`calc(100% - ${header.clientHeight}px)`);
    setState(State.SHOW);

    return () => {
      if (hold) {
        const
          width = header.clientWidth,
          left = getLeft(header),
          top = getTop(header) + header.clientHeight;

        hold.style.position = 'absolute';
        hold.style.left = `${left}px`;
        hold.style.top = `${top}px`;
        hold.style.width = `${width}px`;
        root.appendChild(hold);

        toBeDestroyed.push(hold);
      }
    };
  }, []);

  return (
    <div ref={ref} style={{ minHeight }} className={`base-page ${state} ${className}`}>
      {children}
    </div>
  );
};

export default BasePage;

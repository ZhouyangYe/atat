import React, { useEffect, useRef, useState } from 'react';
import { debounce, getLeft } from 'atat-common/lib/utils';

import './index.less';

interface Params {
  panelWidth?: number;
  width: number;
  setWidth: (num: number) => void;
}

const max = 550;

const Menu: React.FC<Params> = ({ setWidth, width, panelWidth = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<[number, number]>();
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const right = panelWidth > max ? max : panelWidth;
    setRange([100, right]);

    if (width > right) {
      setLeft(200);
      return;
    }

    setLeft((width - 100) / (right - 100) * 200);
  }, [panelWidth, width]);

  useEffect(() => {
    if (range) {
      debounce<number>(setWidth, left / 200 * (range[1] - range[0]) + range[0]);
    }
  }, [left]);

  const handleDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const l = e.clientX - getLeft(ref.current!);
    const clamp = l < 0 ? 0 : l > 200 ? 200 : l;
    setLeft(clamp);

    let delta = 0;
    const startX = e.clientX;

    const handleMove = (e: MouseEvent) => {
      delta = e.clientX - startX;
      const l = clamp + delta;
      setLeft(l < 0 ? 0 : l > 200 ? 200 : l);
    }
    window.addEventListener('mousemove', handleMove, false);

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove, false);
      window.removeEventListener('mouseup', handleUp, false);
    };
    window.addEventListener('mouseup', handleUp, false);
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    const l = e.touches[0].clientX - getLeft(ref.current!);
    const clamp = l < 0 ? 0 : l > 200 ? 200 : l;
    setLeft(clamp);

    let delta = 0;
    const startX = e.touches[0].clientX;

    const handleMove = (e: TouchEvent) => {
      delta = e.touches[0].clientX - startX;
      const l = clamp + delta;
      setLeft(l < 0 ? 0 : l > 200 ? 200 : l);
    }
    window.addEventListener('touchmove', handleMove, false);

    const handleUp = () => {
      window.removeEventListener('touchmove', handleMove, false);
      window.removeEventListener('touchend', handleUp, false);
    };
    window.addEventListener('touchend', handleUp, false);
  };

  return (
    <div className='album-menu'>
      <div className='title'>宽度：</div>
      <div
        ref={ref}
        className='bar'
        onMouseDown={handleDown}
        onTouchStart={handleTouch}
      >
        <div className='switch' style={{ left: left - 6 }}></div>
      </div>
    </div>
  );
};

export default Menu;

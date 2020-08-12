import React, { useState } from 'react';

import './index.less';

interface IProps {
  children?: any;
}

const SvgComponent: React.FC<IProps> = () => {
  const [style, setStyle] = useState<any>({
    display: 'block',
  });
  const [cn, setCn] = useState<string>('');

  const handleToggle = () => {
    if (style.display === 'none') {
      setStyle({
        display: 'block',
      });
      return;
    }
    setStyle({
      display: 'none',
    });
  };

  const handleHighlight = () => {
    if (cn === 'active') {
      setCn('');
      return;
    }
    setCn('active');
  };

  return (
    <svg viewBox="0 0 300 300" style={{
      width: '100%',
      height: 800,
      background: '#888',
    }} xmlns="http://www.w3.org/2000/svg">
      <foreignObject transform="translate(100,20)" width="100" height="60">
        <div className="item">
          <button onClick={handleToggle}>toggle</button>
          <button onClick={handleHighlight}>change color</button>
        </div>
      </foreignObject>
      <g className={`group ${cn}`} style={style} transform="translate(100,20)">
        <foreignObject transform="translate(-60,80)" width="100" height="60">
          <div className="item">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed mollis mollis mi ut ultricies. Nullam magna ipsum,
            porta vel dui convallis, rutrum imperdiet eros. Aliquam
            erat volutpat.
          </div>
        </foreignObject>
        <g transform="translate(-60,80)">
          <foreignObject transform="translate(-60,80)" width="100" height="60">
            <div className="item">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed mollis mollis mi ut ultricies. Nullam magna ipsum,
              porta vel dui convallis, rutrum imperdiet eros. Aliquam
              erat volutpat.
          </div>
          </foreignObject>
          <foreignObject transform="translate(60,80)" width="100" height="60">
            <div className="item">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed mollis mollis mi ut ultricies. Nullam magna ipsum,
              porta vel dui convallis, rutrum imperdiet eros. Aliquam
              erat volutpat.
          </div>
          </foreignObject>
        </g>
        <foreignObject transform="translate(60,80)" width="100" height="60">
          <div className="item">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed mollis mollis mi ut ultricies. Nullam magna ipsum,
            porta vel dui convallis, rutrum imperdiet eros. Aliquam
            erat volutpat.
          </div>
        </foreignObject>
      </g>
    </svg>
  )
};

export default SvgComponent;

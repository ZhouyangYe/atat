import React, { useMemo } from 'react';

import './index.less';

interface Params {
  rows?: number;
}

export const Loading: React.FC<Params> = ({ rows = 8 }) => {
  const list = useMemo(() => {
    return new Array(rows).fill('').map((row, i) =>{
      if (i === 0) {
        return <div key={i} className='head'></div>
      }
      return <div key={i} className='line'></div>;
    });
  }, [rows]);

  return (
    <div className='atat-loading' >
      {list}
    </div>
  );
};

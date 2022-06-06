import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BasePage from '@/BasePage';
import SourceCode from '@/utils/SourceCode';
import { SORT } from './enum';

import './index.less';

const sortList = Object.values(SORT);

const components = {
  [SORT.MERGE]: lazy(() => import('./MergeSort')),
  [SORT.BUBBLE]: lazy(() => import('./BubbleSort')),
};

const getFiles = (name: string) => {
  if ((sortList as string[]).includes(name)) {
    return ['SortPanel', name];
  }
  return undefined;
};

const Visualization: React.FC<any> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [algorithm, setAlgorithm] = useState(SORT.MERGE);
  const [height, setHeight] = useState(43);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, []);

  const handleToggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const Component = useMemo(() => {
    return components[algorithm];
  }, [algorithm]);

  const sourceCode = useMemo(() => {
    return <SourceCode key={algorithm} root='apps^stories^src^Visualization' filter={getFiles(algorithm)} maxHeight={800} minHeight={500} />
  }, [algorithm]);

  return (
    <BasePage className='visualization'>
      <header style={{ height: collapsed ? 42 : height }} >
        <img onClick={handleToggle} src={collapsed ? '@resources/static/icons/expand.svg' : '@resources/static/icons/collapse.svg'} />
        <div ref={ref} className='menu'>
          {sortList.map((item) => (
            <a key={item} className={algorithm === item ? 'active' : ''} onClick={() => { setAlgorithm(item) }}>{item}</a>
          ))}
        </div>
      </header>
      <Suspense>
        <Component key={algorithm} />
      </Suspense>
      <div className='source-code-wrap'>
        {sourceCode}
      </div>
    </BasePage>
  );
};

export default Visualization;

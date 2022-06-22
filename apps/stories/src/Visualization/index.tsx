import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BasePage from '@/BasePage';
import SourceCode from '@/utils/SourceCode';
import { Loading } from '@/utils';
import { SORT } from './enum';
import ErrorBoundary from '@/utils/ErrorBoundary';

import './index.less';

const sortList = Object.values(SORT);

const retry = (fn: () => Promise<any>, retriesLeft = 5, interval = 1000): Promise<any> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

const components = {
  [SORT.MERGE]: lazy(() => retry(() => import('./MergeSort'))),
  [SORT.QUICK]: lazy(() => retry(() => import('./QuickSort'))),
  [SORT.BUBBLE]: lazy(() => retry(() => import('./BubbleSort'))),
  [SORT.INSERTION]: lazy(() => retry(() => import('./InsertionSort'))),
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
  const [height, setHeight] = useState(40);

  useEffect(() => {
    const handleResize = () => {
      setHeight(ref.current!.clientHeight);
    };
    window.addEventListener('resize', handleResize, false);
    handleResize();
    setTimeout(() => {
      // fix mobile clientHeight bug
      handleResize();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize, false);
    };
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
      <header style={{ height: collapsed ? 40 : height }} >
        <img onClick={handleToggle} src={collapsed ? '@resources/static/icons/expand.svg' : '@resources/static/icons/collapse.svg'} />
        <div ref={ref} className='menu'>
          {sortList.map((item) => (
            <a key={item} className={algorithm === item ? 'active' : ''} onClick={() => { setAlgorithm(item) }}>{item}</a>
          ))}
        </div>
      </header>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Component key={algorithm} />
        </Suspense>
      </ErrorBoundary>
      <div className='source-code-wrap'>
        {sourceCode}
      </div>
    </BasePage>
  );
};

export default Visualization;

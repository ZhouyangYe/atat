import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ORDER } from '../enum';

import './index.less';

interface Params<T> {
  desc: string;
  initState: T;
  sort: (numbers: number[], stat: T, compareFunc: (num1: number, num2: number) => number) => boolean;
  render: (stat: T, index: number, nums: number[]) => { className: string; };
  renderTree?: (stat: T, nums: number[]) => { tree: [number, number][][], current: { depth: number; index: number } };
  temp?: {
    numbers: number[];
    render: (stat: T, index: number, nums: number[], compareFunc: (num1: number, num2: number) => number) => { className: string; };
  };
}

const orderFunc = {
  [ORDER.ASCEND]: (num1: number, num2: number) => {
    if (num1 < num2) {
      return 1;
    }

    if (num1 > num2) {
      return -1;
    }

    return 0;
  },
  [ORDER.DESCEND]: (num1: number, num2: number) => {
    if (num1 > num2) {
      return 1;
    }

    if (num1 < num2) {
      return -1;
    }

    return 0;
  },
};
let timer: NodeJS.Timeout, delay = 0;

function SortPanel<T>({ desc, initState, temp, sort, render, renderTree }: Params<T>) {
  const [status, setStatus] = useState<T>({ ...initState });
  const [tempNumbers, setTempNumbers] = useState<number[]>(temp ? new Array(200).fill(0) : []);
  const [numbers, setNumbers] = useState(new Array(200).fill(0).map(() => Math.ceil(Math.random() * 200)));
  const [delayValue, setDelayValue] = useState(delay);
  const [order, setOrder] = useState(ORDER.ASCEND);
  const [done, setDone] = useState(true);
  const [paused, setPaused] = useState(true);
  const [width, setWidth] = useState(`0.5%`);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const width = ref.current.clientWidth;
        if (width < 800) {
          const num = Math.floor(width / 5);
          if (temp) {
            setTempNumbers(new Array(num).fill(0));
            temp.numbers.length = 0;
          }
          setNumbers(new Array(num).fill(0).map(() => Math.ceil(Math.random() * 200)));
          setWidth(`${100 / num}%`);
          setDone(true);
          setPaused(true);
          setStatus({ ...initState });
        }
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize, false);

    return () => {
      window.removeEventListener('resize', handleResize, false);
      clearTimeout(timer);
      if (temp) temp.numbers.length = 0;
    };
  }, []);

  useEffect(() => {
    if (paused || done) return;

    const stat = { ...status };
    const shouldContinue = sort(numbers, stat, orderFunc[order]);
    setNumbers([...numbers]);
    if (temp) {
      setTempNumbers(tempNumbers.map((num, i) => {
        return temp.numbers[i] === undefined ? num : temp.numbers[i];
      }));
    }
    timer = setTimeout(() => {
      setStatus({ ...stat });
    }, delay);

    if (!shouldContinue) {
      setDone(true);
      setPaused(true)
    }
  }, [status, order, paused, done]);

  const list = useMemo(() => {
    return numbers.map((num, i) => {
      const params = render(status, i, numbers);
      return <div key={i} title={`${num}`} className={`bar ${params.className}`} style={{ height: num, width }}></div>;
    });
  }, [numbers]);

  const tempList = temp ? useMemo(() => {
    return tempNumbers.map((num, i) => {
      const params = temp.render(status, i, numbers, orderFunc[order]);
      return <div key={i} title={`${num}`} className={`bar ${params.className}`} style={{ height: num, width }}></div>;
    });
  }, [tempNumbers]) : undefined;

  const treeGraph = renderTree ? useMemo(() => {
    const { tree, current } = renderTree(status, numbers);
    return tree.map((level, depth) => (
      <div key={depth} className='tree-level'>
        {level.map((node, i) => (
          <div
            key={i}
            className={`tree-node ${depth === current.depth && i === current.index ? 'active' : ''}`}
            title={`${node[0]} - ${node[1]}`}
            style={{ width: `${(node[1] - node[0] + 1) * parseFloat(width)}%` }}
          ></div>
        ))}
      </div>
    ));
  }, [numbers]) : undefined;

  const handleToggle = useCallback(() => {
    if (!paused) {
      clearTimeout(timer);
    } else {
      if (done) setDone(false);
    }

    setPaused(!paused);
  }, [paused, done]);

  const handleDelay = useCallback((e: React.ChangeEvent) => {
    let value = (e.target as HTMLInputElement).value;
    if (!/^[0-9]*$/.test(value)) {
      return;
    }

    value = Number(value) > 1000 ? '1000' : !value ? '0' : value;
    const result = Number(value);
    delay = result;
    setDelayValue(result);
  }, []);

  const handleAscend = useCallback(() => {
    if (!done) return;
    setOrder(ORDER.ASCEND);
  }, [done]);

  const handleDescend = useCallback(() => {
    if (!done) return;
    setOrder(ORDER.DESCEND);
  }, [done]);

  const handleReset = useCallback(() => {
    if (!done) return;
    const { length } = numbers;
    if (temp) {
      temp.numbers.length = 0;
      setTempNumbers(new Array(length).fill(0));
    }
    setNumbers(new Array(length).fill(0).map(() => Math.ceil(Math.random() * 200)));
    setStatus({ ...initState });
  }, [done, width]);

  return (
    <div className='atat-algorithm'>
      <header>
        <img onClick={handleToggle} className='play' title={paused ? 'Play' : 'Pause'} src={paused ? '@resources/static/icons/play-button-1.svg' : '@resources/static/icons/pause-1.svg'} />
        <img onClick={handleReset} className={`reset ${done ? '' : 'forbidden'}`} title="Reset" src="@resources/static/icons/reset.svg" />
        <div className={`order ${done ? '' : 'forbidden'}`}>
          <a className={order === ORDER.ASCEND ? 'active' : ''} onClick={handleAscend}>Asc</a>
          <a className={order === ORDER.DESCEND ? 'active' : ''} onClick={handleDescend}>Desc</a>
        </div>
        <div className='delay'>Delay: <input value={delayValue} onChange={handleDelay} /></div>
      </header>
      {renderTree && (
        <>
          <div className='tree-panel'>
            {treeGraph}
          </div>
          <h3>Path tree</h3>
        </>
      )}
      {temp && (
        <>
          <div className='panel'>
            {tempList}
          </div>
          <h3>Temp array</h3>
        </>
      )}
      <div className='panel' ref={ref}>
        {list}
      </div>
      <h3>Result</h3>
      <p>{desc}</p>
    </div>
  );
}

export default SortPanel;

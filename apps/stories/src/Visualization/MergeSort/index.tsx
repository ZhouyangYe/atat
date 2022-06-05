import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ORDER } from '../enum';

import './index.less';

interface MergeSortState {
  level: number;
  sectionIndex: number;
  tempPointer: number;
  pointer1: number;
  pointer2: number;
  start: number;
  mid: number;
  end: number;
}

const tempArray: number[] = [];

const merge = (arr: number[], state: MergeSortState, compare: (num1: number, num2: number) => number) => {
  if (state.pointer1 <= state.mid || state.pointer2 <= state.end) {
    if (state.pointer1 > state.mid) {
      tempArray[state.tempPointer] = arr[state.pointer2];
      state.pointer2++;
      state.tempPointer++;
    } else if (state.pointer2 > state.end) {
      tempArray[state.tempPointer] = arr[state.pointer1];
      state.pointer1++;
      state.tempPointer++;
    } else {
      if (compare(arr[state.pointer1], arr[state.pointer2]) > 0) {
        tempArray[state.tempPointer] = arr[state.pointer1];
        state.pointer1++;
      } else {
        tempArray[state.tempPointer] = arr[state.pointer2];
        state.pointer2++;
      }
      state.tempPointer++;
    }

    return true;
  }

  for (let i = state.start; i <= state.end; i++) {
    arr[i] = tempArray[i];
  }

  return false;
};

const mergeSort = (arr: number[], state: MergeSortState, compare: (num1: number, num2: number) => number): boolean => {
  const mergeDone = !merge(arr, state, compare);
  if (mergeDone) {
    const l = Math.pow(2, state.level);
    const offset = l * 2, delta1 = l - 1, delta2 = offset - 1;
    state.sectionIndex += offset;

    if (state.sectionIndex < arr.length) {
      state.start = state.sectionIndex;
      state.mid = state.sectionIndex + delta1;
      state.mid = state.mid < arr.length ? state.mid : arr.length - 1; // clamp
      state.end = state.sectionIndex + delta2;
      state.end = state.end < arr.length ? state.end : arr.length - 1; // clamp

      const start2 = state.mid + 1;
      state.tempPointer = state.start;
      state.pointer1 = state.start;
      state.pointer2 = start2;
    } else {
      state.level += 1;

      if (Math.pow(2, state.level - 1) >= arr.length) {
        return false;
      }

      const l = Math.pow(2, state.level);
      const offset = l * 2, delta1 = l - 1, delta2 = offset - 1;

      state.sectionIndex = 0;

      state.start = state.sectionIndex;
      state.mid = state.sectionIndex + delta1;
      state.mid = state.mid < arr.length ? state.mid : arr.length - 1; // clamp
      state.end = state.sectionIndex + delta2;
      state.end = state.end < arr.length ? state.end : arr.length - 1; // clamp

      const start2 = state.mid + 1;
      state.tempPointer = state.start;
      state.pointer1 = state.start;
      state.pointer2 = start2;
    }
  }

  return true;
};

const state = { level: 0, sectionIndex: 0, tempPointer: 0, pointer1: 0, pointer2: 1, start: 0, mid: 0, end: 1, };

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

const MergeSort: React.FC<any> = () => {
  const [status, setStatus] = useState<MergeSortState>({ ...state });
  const [tempNumbers, setTempNumbers] = useState<number[]>(new Array(200).fill(0));
  const [numbers, setNumbers] = useState(new Array(200).fill(0).map(() => Math.ceil(Math.random() * 200)));
  const [delayValue, setDelayValue] = useState(delay);
  const [order, setOrder] = useState(ORDER.ASCEND);
  const [done, setDone] = useState(true);
  const [paused, setPaused] = useState(true);
  const [width, setWidth] = useState(`0.5%`);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth;
      if (width < 800) {
        const num = Math.floor(width / 5);
        setTempNumbers(new Array(num).fill(0));
        setNumbers(new Array(num).fill(0).map(() => Math.ceil(Math.random() * 200)));
        setWidth(`${100 / num}%`);
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (paused || done) return;

    const stat = { ...status };
    const shouldContinue = mergeSort(numbers, stat, orderFunc[order]);
    if (shouldContinue) {
      setNumbers([...numbers]);
      setTempNumbers([...tempArray]);

      timer = setTimeout(() => {
        setStatus({ ...stat });
      }, delay);
    } else {
      setDone(true);
      setPaused(true)
    }
  }, [status, order, paused, done]);

  const list = useMemo(() => {
    return numbers.map((num, i) => {
      const
        pointer1 = status.pointer1 > status.mid ? null : status.pointer1,
        pointer2 = status.pointer2 > status.end ? null : status.pointer2;

      let className = '';
      if (pointer1 === i) {
        className = 'pointer1';
      } else if (pointer2 === i) {
        className = 'pointer2';
      } else if (i >= status.start && i <= status.mid) {
        className = 'range1';
      } else if (i > status.mid && i <= status.end) {
        className = 'range2';
      }

      if (pointer1 === null && pointer2 === null && i >= status.start && i <= status.end) {
        className = 'range';
      }

      return (
        <div key={i} className={`bar ${className}`} style={{ height: num, width }}></div>
      );
    });
  }, [numbers]);

  const tempList = useMemo(() => {
    return tempNumbers.map((num, i) => {
      const
        pointer1 = status.pointer1 > status.mid ? null : status.pointer1,
        pointer2 = status.pointer2 > status.end ? null : status.pointer2;

      let className = '';
      if (status.tempPointer === i) {
        if (pointer1 === null && pointer2 === null) {
          className = '';
        } else if (pointer1 === null) {
          className = 'pointer2';
        } else if (pointer2 === null) {
          className = 'pointer1';
        } else if (orderFunc[order](numbers[pointer1], numbers[pointer2]) > 0) {
          className = 'pointer1';
        } else {
          className = 'pointer2';
        }
      } else if (i >= status.start && i <= status.end) {
        className = 'range';
      }

      return (
        <div key={i} className={`bar ${className}`} style={{ height: num, width }}></div>
      );
    });
  }, [tempNumbers]);

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
    tempArray.length = 0;
    setNumbers(new Array(length).fill(0).map(() => Math.ceil(Math.random() * 200)));
    setTempNumbers(new Array(length).fill(0));
    setStatus({ ...state });
  }, [done, width]);

  return (
    <div className='atat-algorithm'>
      <header>
        <img onClick={handleToggle} className='play' src={paused ? '@resources/static/icons/play-button-1.svg' : '@resources/static/icons/pause-1.svg' } />
        <img onClick={handleReset} className={`reset ${done ? '' : 'forbidden'}`} src="@resources/static/icons/reset.svg" />
        <div className={`order ${done ? '' : 'forbidden'}`}>
          <a className={order === ORDER.ASCEND ? 'active' : ''} onClick={handleAscend}>Asc</a>
          <a className={order === ORDER.DESCEND ? 'active' : ''} onClick={handleDescend}>Desc</a>
        </div>
        <div className='delay'>Delay: <input value={delayValue} onChange={handleDelay} /></div>
      </header>
      <div className='panel' ref={ref}>
        {tempList}
      </div>
      <h3>Temp array</h3>
      <div className='panel'>
        {list}
      </div>
      <h3>Result</h3>
      <p>Merge sort, 时间复杂度O(nlogn)</p>
    </div>
  );
};

export default MergeSort;

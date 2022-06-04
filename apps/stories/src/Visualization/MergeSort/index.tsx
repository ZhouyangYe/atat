import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

const mergeSort = (arr: number[], state: MergeSortState, compare: (num1: number, num2: number) => number): { continue: boolean; mergeDone: boolean; } => {
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
        return { continue: false, mergeDone };
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

  return { continue: true, mergeDone };
};

const state = { level: 0, sectionIndex: 0, tempPointer: 0, pointer1: 0, pointer2: 1, start: 0, mid: 0, end: 1, };

let timer: NodeJS.Timeout, paused = true;

let compare = (num1: number, num2: number) => {
  if (num1 > num2) {
    return 1;
  }
  return -1;
};

const MergeSort: React.FC<any> = () => {
  const [status, setStatus] = useState<{ prev: MergeSortState; current: MergeSortState }>({ prev: { ...state }, current: { ...state } });
  const [tempNumbers, setTempNumbers] = useState<number[]>(new Array(200).fill(0));
  const [numbers, setNumbers] = useState(new Array(200).fill(0).map(() => Math.ceil(Math.random() * 200)));

  const list = useMemo(() => {
    return numbers.map((num, i) => {
      let className = '';

      if (status.prev.pointer1 === i) {
        className = 'pointer1';
      } else if (status.prev.pointer2 === i) {
        className = 'pointer2';
      } else if (i >= status.prev.start && i <= status.prev.mid) {
        className = 'range1';
      } else if (i > status.prev.mid && i <= status.prev.end) {
        className = 'range2';
      }

      return (
        <div key={i} className={`bar ${className}`} style={{ height: num }}></div>
      );
    });
  }, [numbers]);

  const tempList = useMemo(() => {
    return tempNumbers.map((num, i) => {
      const className = status.current.tempPointer === i ? (compare(numbers[status.prev.pointer1], numbers[status.prev.pointer2]) > 0 ? 'pointer1' : 'pointer2') : '';

      return (
        <div key={i} className={`bar ${className}`} style={{ height: num }}></div>
      );
    });
  }, [tempNumbers]);

  useEffect(() => {
    if (!status || paused) return;

    const stat = { ...status.current };
    const result = mergeSort(numbers, stat, compare);
    if (result.continue) {
      setNumbers([...numbers]);
      setTempNumbers([...tempArray]);

      timer = setTimeout(() => {
        setStatus({ prev: { ...status.current }, current: { ...stat } });
      }, 200);
    }
  }, [status]);

  const toggle = useCallback(() => {
    if (!paused) {
      clearTimeout(timer);
    } else {
      setStatus({ ...status });
    }

    paused = !paused;
  }, [paused, status]);

  return (
    <div className='atat-algorithm'>
      <header>
        <img onClick={toggle} className='play' src="@resources/static/icons/play-button-1.svg" />
      </header>
      <div className='panel'>
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

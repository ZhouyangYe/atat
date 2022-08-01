import React, { useCallback, lazy } from 'react';
import Async from '@/utils/Async';

const SortPanel = lazy(() => import('../Panels/SortPanel'));

interface InsertionSortState {
  pointer1: number;
  pointer2: number;
}

const swap = (arr: number[], i1: number, i2: number) => {
  const temp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = temp;
}

const insertionSort = (arr: number[], state: InsertionSortState, compare: (num1: number, num2: number) => number): boolean => {
  if (state.pointer1 >= arr.length) {
    return false;
  }
  const pointer3 = state.pointer2 - 1;

  if (compare(arr[state.pointer2], arr[pointer3]) > 0) {
    swap(arr, state.pointer2, pointer3);
  } else {
    state.pointer1++;
    state.pointer2 = state.pointer1;
    if (state.pointer1 === arr.length) {
      return false;
    }
    return true;
  }

  state.pointer2--;

  if (state.pointer2 < 1) {
    state.pointer1++;
    state.pointer2 = state.pointer1;
  }

  if (state.pointer1 === arr.length) {
    return false;
  }
  return true;
};

const state: InsertionSortState = { pointer1: 1, pointer2: 1 };

const InsertionSort: React.FC<any> = () => {
  const renderResult = useCallback((status: InsertionSortState, currentState: InsertionSortState, i: number, nums: number[], compare: (num1: number, num2: number) => number) => {
    let className = '';
    
    if (i <= currentState.pointer1) {
      className = 'range1';
    }

    if (i === currentState.pointer2) {
      className = 'pointer1';
    }

    return {
      className,
    };
  }, []);

  return (
    <Async>
      <SortPanel
        desc='Insertion sort, 时间复杂度O(n2)'
        info={[
          { className: 'range1', text: 'Sorted' },
          { className: 'pointer1', text: 'Pointer' },
        ]}
        initState={state}
        sort={insertionSort}
        render={renderResult}
      />
    </Async>
  );
};

export default InsertionSort;

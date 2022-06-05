import React, { useCallback } from 'react';
import SortPanel from '../SortPanel';

interface BubbleSortState {
  round: number;
  pointer: number;
}

let initialized = false;

const swap = (arr: number[], i1: number, i2: number) => {
  const temp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = temp;
}

const bubbleSort = (arr: number[], state: BubbleSortState, compare: (num1: number, num2: number) => number): boolean => {
  initialized = true;
  const length1 = arr.length - 1, length2 = length1 - state.round;

  if (compare(arr[state.pointer], arr[state.pointer + 1]) > 0) {
    swap(arr, state.pointer, state.pointer + 1);
  }
  state.pointer++;
  if (state.pointer >= length2) {
    state.round++;
    state.pointer = 0;
  }

  return state.round < length1;
};

const state = { round: 0, pointer: 0 };

const BubbleSort: React.FC<any> = () => {
  const renderResult = useCallback((status: BubbleSortState, num: number, i: number, width: string, nums: number[]) => {
    let className = '';
    const length1 = nums.length - 1, length2 = length1 - status.round;
    const pointer = initialized ? status.pointer + 1 >= length2 ? 0 : status.pointer + 1 : status.pointer;

    if (i === pointer) {
      className = 'pointer1';
    } else if (i === pointer + 1) {
      className = 'pointer2';
    } else if (i >= 0 && i <= length2) {
      className = 'range1';
    }

    return (
      <div key={i} className={`bar ${className}`} style={{ height: num, width }}></div>
    );
  }, []);

  return (
    <SortPanel desc='Bubble sort, 时间复杂度O(n2)' initState={state} sort={bubbleSort} render={renderResult} />
  );
};

export default BubbleSort;

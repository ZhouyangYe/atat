import React, { useCallback } from 'react';
import SortPanel from '../SortPanel';

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

const MergeSort: React.FC<any> = () => {
  const renderResult = useCallback((status: MergeSortState, num: number, i: number, width: string) => {
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
  }, []);

  const renderTemp = useCallback((status: MergeSortState, num: number, i: number, width: string, nums: number[], compareFunc: (num1: number, num2: number) => number) => {
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
      } else if (compareFunc(nums[pointer1], nums[pointer2]) > 0) {
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
  }, []);

  return (
    <SortPanel desc='Merge sort, 时间复杂度O(nlogn)' initState={state} sort={mergeSort} render={renderResult} temp={{ numbers: tempArray, render: renderTemp }} />
  );
};

export default MergeSort;

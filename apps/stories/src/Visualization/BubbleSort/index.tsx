import React, { useCallback, lazy, Suspense } from 'react';

const SortPanel = lazy(() => import('../SortPanel'));

interface BubbleSortState {
  round: number;
  pointer: number;
}

const swap = (arr: number[], i1: number, i2: number) => {
  const temp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = temp;
}

const bubbleSort = (arr: number[], state: BubbleSortState, compare: (num1: number, num2: number) => number): boolean => {
  const length1 = arr.length - 1, length2 = length1 - state.round;

  if (compare(arr[state.pointer + 1], arr[state.pointer]) > 0) {
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
  const renderResult = useCallback((status: BubbleSortState, i: number, nums: number[], compare: (num1: number, num2: number) => number) => {
    let className = '';
    const length1 = nums.length - 1, length2 = length1 - status.round;

    if (status.round === 0 && status.pointer === 0 && compare(nums[0], nums[1]) < 0) {
      if (i === 0) {
        className = 'pointer1';
      } else if (i === 1) {
        className = 'pointer2';
      } else if (i >= 0 && i <= length2) {
        className = 'range1';
      }
      return {
        className,
      };
    }

    if (i === status.pointer) {
      className = 'pointer3';
    } else if (i === status.pointer + 1) {
      className = 'pointer1';
    } else if (i === status.pointer + 2 && status.pointer + 2 <= length2) {
      className = 'pointer2';
    } else if (i >= 0 && i <= length2) {
      className = 'range1';
    }

    return {
      className,
    };
  }, []);

  return (
    <Suspense>
      <SortPanel
        desc='Bubble sort, 时间复杂度O(n2)'
        info={[
          { className: 'pointer3', text: 'Copied' },
          { className: 'pointer1', text: 'Pointer 1' },
          { className: 'pointer2', text: 'Pointer 2' },
          { className: 'range1', text: 'Range' },
        ]}
        initState={state}
        sort={bubbleSort}
        render={renderResult} />
    </Suspense>
  );
};

export default BubbleSort;

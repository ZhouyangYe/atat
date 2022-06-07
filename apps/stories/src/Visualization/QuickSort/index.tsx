import React, { useCallback, lazy, Suspense } from 'react';

const SortPanel = lazy(() => import('../SortPanel'));

interface QuickSortState {
  range?: [number, number][];
  pointer1: number;
  pointer2: number;
}

const swap = (arr: number[], i1: number, i2: number) => {
  const temp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = temp;
}

const quickSort = (arr: number[], state: QuickSortState, compare: (num1: number, num2: number) => number): boolean => {
  if (state.range === undefined) {
    state.range = [[0, arr.length - 1]];
  }

  const
    range = state.range[state.range.length - 1]

  if (range === undefined) {
    return false;
  }

  const pivot = range[range.length - 1];

  if (compare(arr[state.pointer1], arr[pivot]) > 0) {
    state.pointer1++;
    state.pointer2 = state.pointer1 + 1;
  } else if (state.pointer2 === pivot) {
    swap(arr, state.pointer1, pivot);
    state.pointer2++;
  } else if (compare(arr[state.pointer2], arr[pivot]) > 0) {
    swap(arr, state.pointer1, state.pointer2);
    state.pointer1++;
    state.pointer2++;
  } else {
    state.pointer2++;
  }

  if (state.pointer2 > pivot) {
    let nextRange: [number, number] = [range[0], state.pointer1 - 1];

    if (nextRange[0] >= nextRange[1]) {
      nextRange = [state.pointer1 + 1, range[1]];
    } else {
      state.pointer1 = nextRange[0];
      state.pointer2 = state.pointer1 + 1;
      state.range = [...state.range, nextRange];
      return true;
    }

    if (nextRange[0] >= nextRange[1]) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const range = state.range.pop()!;
        const parentRange = state.range[state.range.length - 1];
        if (!parentRange) {
          return false;
        } else if (range[1] !== parentRange[1]) {
          nextRange = [range[1] + 2, parentRange[1]];
          if (nextRange[0] < nextRange[1]) {
            state.pointer1 = nextRange[0];
            state.pointer2 = state.pointer1 + 1;
            state.range = [...state.range, nextRange];
            return true;
          }
        }
      }
    } else {
      state.pointer1 = nextRange[0];
      state.pointer2 = state.pointer1 + 1;
      state.range = [...state.range, nextRange];
      return true;
    }
  }

  return true;
};

const state: QuickSortState = { pointer1: 0, pointer2: 1, range: undefined };

const QuickSort: React.FC<any> = () => {
  const renderResult = useCallback((status: QuickSortState, i: number, nums: number[]) => {
    let className = '';
    const range = status.range ? status.range[status.range.length - 1] : [0, nums.length - 1];

    if (i === status.pointer1 && range && i <= range[1]) {
      className = 'pointer1';
    } else if (i === status.pointer2 && range && i <= range[1]) {
      className = 'pointer2';
    } else if (range && i === range[1]) {
      className = 'pointer3';
    } else if (range && i >= range[0] && i < range[1]) {
      className = 'range';
    }

    return {
      className,
    };
  }, []);

  let treeData: [number, number][][] = [];

  const renderTree = useCallback((status: QuickSortState, nums: number[]) => {
    if (status.range === undefined) {
      treeData = [];
    }

    const
      ranges = status.range ?? [[0, nums.length - 1]],
      depth = ranges.length - 1,
      range = ranges[depth];

    if (depth < 0) {
      return {
        tree: treeData,
        current: { depth: 0, index: 0 },
      };
    }

    if (!treeData[depth]) {
      treeData[depth] = [range];
      if (range[0] !== 0) {
        treeData[depth].unshift([0, range[0] - 1]);
      }
    } else {
      const
        level = treeData[depth],
        last = level[level.length - 1];
      if (last[0] < range[0]) {
        if (range[0] > last[1] + 1) {
          level.push([last[1] + 1, range[0] - 1]);
        }
        level.push(range);
      }
    }

    const current = { depth, index: treeData[depth].length - 1 };

    return {
      tree: treeData,
      current,
    }
  }, []);

  return (
    <Suspense>
      <SortPanel desc='Quick sort, 时间复杂度平均O(nlogn)' initState={state} sort={quickSort} render={renderResult} renderTree={renderTree} />
    </Suspense>
  );
};

export default QuickSort;

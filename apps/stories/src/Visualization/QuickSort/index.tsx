import React, { useCallback, lazy, Suspense } from 'react';

const SortPanel = lazy(() => import('../SortPanel'));

interface QuickSortState {
  range?: [number, number][];
  pointer1: number;
  pointer2: number;
}

const treeData: [number, number][][] = [];

const updateTreeData = (depth: number, range: [number, number]) => {
  if (!treeData[depth]) {
    treeData[depth] = [];
    if (range[0] !== 0) {
      treeData[depth] = [[0, range[0] - 1], ...treeData[depth]];
    }
    treeData[depth] = [...treeData[depth], range];
  } else {
    const
      level = treeData[depth],
      last = level[level.length - 1];

    if (last[0] < range[0]) {
      if (range[0] > last[1] + 1) {
        treeData[depth] = [...level, [last[1] + 1, range[0] - 1]];
      }
      treeData[depth] = [...treeData[depth], range];
    }
  }
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
  if (!state.range?.length) {
    return false;
  }

  const
    range = state.range[state.range.length - 1]

  updateTreeData(state.range.length - 1, range);

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
  const renderResult = useCallback((status: QuickSortState, currentState: QuickSortState, i: number, nums: number[]) => {
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

  const renderTree = useCallback((status: QuickSortState, currentState: QuickSortState, d: number, i: number, nums: number[]) => {
    const
      ranges = status.range ?? [[0, nums.length - 1]],
      depth = ranges.length - 1;

    let className = '';
    const range = treeData[d][i];

    const parent = d === 0 ? [] : treeData[d - 1].find((r) => {
      return range[0] >= r[0] && range[1] <= r[1];
    });

    if (range[0] === range[1] && range[0] !== parent![0] && range[1] !== parent![1]) {
      className = 'pointer3';
    }

    if (!parent || (range[0] === parent[0] && range[1] === parent[1]) || (range[0] === range[1] && (range[0] === parent[0] || range[1] === parent[1]))) {
      className = 'inactive';
    }

    if (depth < 0) {
      return {
        className,
      };
    }

    const index = treeData[depth].length - 1;

    if (d === depth && i === index) {
      className = 'active';
    }

    return {
      className,
    };
  }, []);

  return (
    <Suspense>
      <SortPanel
        desc='Quick sort, 时间复杂度平均O(nlogn)'
        info={[
          { className: 'pointer1', text: 'Pointer 1' },
          { className: 'pointer2', text: 'Pointer 2' },
          { className: 'pointer3', text: 'Pivot' },
          { className: 'range', text: 'Range' },
        ]}
        initState={state}
        sort={quickSort}
        render={renderResult}
        tree={{
          info: [
            { className: 'active', text: 'Current section' },
            { className: 'inactive', text: 'Not traversed' },
            { className: 'pointer3', text: 'Pivot' },
          ],
          data: treeData,
          render: renderTree,
        }}
      />
    </Suspense>
  );
};

export default QuickSort;

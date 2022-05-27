const map = new Map<(params: any) => void, () => void>();

export const debounce = <T>(cb: (params?: T) => void, params?: T, delay = 100): void => {
  const cancel = map.get(cb);
  if (cancel) cancel();

  const timer = setTimeout(() => {
    cb(params);
  }, delay);

  map.set(cb, () => {
    clearTimeout(timer);
  })
};

const map = new Map<() => void, { ready: boolean; initialized: boolean }>();

export const throttle = (cb: () => void, duration: number, immediately = true): boolean => {
  if (!map.get(cb)) {
    map.set(cb, {
      ready: true,
      initialized: false,
    });
  }

  const data = map.get(cb);

  if (data.ready) {
    if (immediately || data.initialized) {
      cb();
    }
    data.initialized = true;
    data.ready = false;
    setTimeout(() => {
      data.ready = true;
    }, duration);
  }
  return data.ready && (immediately || data.initialized);
};

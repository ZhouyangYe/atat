export const doAnimationDuration = (fn: () => void, duration = 0): () => void => {
  let timer: number = null;
  let start: number = null;
  let stop = false;

  function step(timestamp: number): void {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    fn();
    if (progress < duration && !stop) {
      timer = window.requestAnimationFrame(step);
    }
  }

  timer = window.requestAnimationFrame(step);

  return () => {
    stop = true;
    window.cancelAnimationFrame(timer);
  };
};

export const doAnimationInterval = (fn: () => void, interval = 0): () => void => {
  let timer: number = null;
  let stop = false;
  let start: number = null;

  function step(timestamp: number): void {
    if (!start) {
      start = timestamp;
      fn();
    }

    if (interval === 0) {
      fn();
    } else {
      const progress = timestamp - start;
      if (progress >= interval) {
        fn();
        start = timestamp;
      }
    }
  
    if (!stop) {
      timer = window.requestAnimationFrame(step);
    }
  }

  timer = window.requestAnimationFrame(step);

  return () => {
    stop = true;
    window.cancelAnimationFrame(timer);
  };
};

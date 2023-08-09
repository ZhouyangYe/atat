export const doAnimationDuration = (fn: (t?: number) => void, duration = 0): () => void => {
  let timer: number | undefined = undefined;
  let start: number | undefined = undefined;
  let stop = false;

  function step(timestamp: number): void {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    fn(timestamp);
    if (progress < duration && !stop) {
      timer = window.requestAnimationFrame(step);
    }
  }

  timer = window.requestAnimationFrame(step);

  return () => {
    stop = true;
    window.cancelAnimationFrame(timer!);
  };
};

export const doAnimationInterval = (fn: (t?: number) => void, interval = 0): () => void => {
  let timer: number | undefined = undefined;
  let stop = false;
  let start: number | undefined = undefined;

  function step(timestamp: number): void {
    if (!start) {
      start = timestamp;
      fn(timestamp);
    }

    if (interval === 0) {
      fn(timestamp);
    } else {
      const progress = timestamp - start;
      if (progress >= interval) {
        fn(timestamp);
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
    window.cancelAnimationFrame(timer!);
  };
};

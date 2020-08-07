import './index.less';

export interface ITaskMeta {
  percent: number;
  task: Promise<void>;
}

export const handleLoading = (tasks: ITaskMeta[], initPercent = 0): Promise<void> => {
  const body = document.querySelector<HTMLElement>('body');
  const main = document.querySelector<HTMLImageElement>('#main');
  const loading = document.createElement('DIV') as HTMLElement;
  const progress = document.createElement('DIV') as HTMLElement;
  loading.id = 'loading';
  progress.innerHTML = '0.00%';
  loading.appendChild(progress);
  body.appendChild(loading);

  let current = initPercent;

  const promises = tasks.map(meta => meta.task.then(() => {
    current += meta.percent;
    progress.innerHTML = `${current.toFixed(2)}%`;
  }));

  const delay = 666;
  return Promise.all(promises).then(() => {
    progress.innerHTML = '100%';
    setTimeout(() => {
      loading.style.display = 'none';
      main.style.display = 'block';
    }, delay);
    return;
  });
};

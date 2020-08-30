import './index.less';

export interface ITaskMeta {
  percent: number;
  task: Promise<any>;
}

const MAX = 100;

const body = document.querySelector<HTMLElement>('body');
const main = document.querySelector<HTMLImageElement>('#main');
const loading = document.createElement('DIV') as HTMLElement;
const progress = document.createElement('DIV') as HTMLElement;
loading.id = 'atat-loading';
progress.innerHTML = '0.00%';
loading.appendChild(progress);
body.appendChild(loading);

export const handleLoading = (tasks?: ITaskMeta[], finish = MAX, initPercent = 0): Promise<{ finish: number; values: any[] }> => {
  let current = initPercent;
  progress.innerHTML = `${current.toFixed(2)}%`;

  const deltaRatio = (finish - initPercent) / MAX;

  if (!tasks) {
    return Promise.resolve({ finish: initPercent, values: [] });
  }

  const promises = tasks.map(meta => meta.task.then((data) => {
    current += meta.percent * deltaRatio;
    progress.innerHTML = `${current.toFixed(2)}%`;
    return data;
  }));

  const delay = 666;
  return Promise.all(promises).then((values) => {
    console.log(values);
    progress.innerHTML = `${finish}%`;
    if (finish === 100) {
      setTimeout(() => {
        loading.style.display = 'none';
        main.style.display = 'block';
      }, delay);
    }
    return { finish, values };
  });
};

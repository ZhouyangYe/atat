import { getIntroInfo, IIntroInfoData } from 'atat-common/lib/services/intro';
import { IResponse } from 'atat-common/lib/services/interface';
import { getFullUrl } from 'atat-common/lib/utils';
import { handleLoading, ITaskMeta } from 'atat-common/lib/modules/loading';
import 'atat-common/src/modules/loading/index.less';

const getScreenHeight = () => {
  return `${window.innerHeight}px`;
}

const handleLoadResources = (pics: string[]): ITaskMeta[] => {
  const images = [
    ...pics,
    getFullUrl('/@resources/static/screenshots/package.png'),
    getFullUrl('/@resources/static/screenshots/scripts.png'),
    getFullUrl('/@resources/static/materials/water.png'),
    getFullUrl('/@resources/static/materials/maple.png'),
  ];

  const total = 100;
  const { length } = images;
  const percentage = total / length;

  const tasks = images.map(url => {
    const task = new Promise<void>((res) => {
      const img = document.createElement('IMG') as HTMLImageElement;

      img.src = url;
      img.onload = () => {
        res();
        img.onload = undefined;
      };
    });

    return {
      task,
      percent: percentage,
    };
  });

  return tasks;
};

const main = (): void => {
  const profileSection = document.querySelector<HTMLElement>('.profile');
  const profilePic = document.querySelector<HTMLImageElement>('.profile-pic');

  const homeSection = document.querySelector<HTMLElement>('.frontend-title');

  const algorithmsSection = document.querySelector<HTMLElement>('.backend-title');

  const appsSection = document.querySelector<HTMLElement>('.devtools-title');

  profileSection.style.height = getScreenHeight();

  handleLoading([{ task: getIntroInfo(), percent: 6 }], 6).then((result) => {
    const res = result.values[0] as IResponse<IIntroInfoData>;
    if (res.success) {
      if (!res.data) {
        return;
      }

      const { backgrounds, profile } = res.data;
      const pictures = [...backgrounds, profile].map(bg => getFullUrl(`${bg.path}/${bg.name}`));

      const tasks = handleLoadResources(pictures);

      // Loading screen
      handleLoading(tasks, 100, result.finish).then(() => {
        const background1 = backgrounds?.find(item => item.orders === 1);
        if (background1) {
          profileSection.style.backgroundImage = `url(${getFullUrl(`${background1.path}/${background1.name}`)})`;
        }

        const background2 = backgrounds?.find(item => item.orders === 2);
        if (background2) {
          homeSection.style.backgroundImage = `url(${getFullUrl(`${background2.path}/${background2.name}`)})`;
        }

        const background3 = backgrounds?.find(item => item.orders === 3);
        if (background3) {
          algorithmsSection.style.backgroundImage = `url(${getFullUrl(`${background3.path}/${background3.name}`)})`;
        }

        const background4 = backgrounds?.find(item => item.orders === 4);
        if (background4) {
          appsSection.style.backgroundImage = `url(${getFullUrl(`${background4.path}/${background4.name}`)})`;
        }

        profilePic.src = getFullUrl(`${profile.path}/${profile.name}`);
      }).catch((err: Error) => {
        console.error(err);
      });
    }
  });

  window.onresize = () => {
    profileSection.style.height = getScreenHeight();
  };
};

export default main;

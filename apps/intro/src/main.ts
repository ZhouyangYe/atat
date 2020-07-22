import { services, utils } from 'atat-common';

const main = (): void => {
  const profile = document.querySelector<HTMLElement>('.profile');

  services.getIntroInfo().then(data => {
    if (data.success) {
      profile.style.backgroundImage = `url(${utils.getFullUrl(data.data[0])})`;
    }
  });
};

export default main;

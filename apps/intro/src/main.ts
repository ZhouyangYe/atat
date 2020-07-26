import { services, utils } from 'atat-common';

const getScreenHeight = () => {
  return `${window.innerHeight}px`;
}

const main = (): void => {
  const profileSection = document.querySelector<HTMLElement>('.profile');
  const profilePic = document.querySelector<HTMLImageElement>('.profile-pic');

  profileSection.style.height = getScreenHeight();

  services.getIntroInfo().then(res => {
    if (res.success) {
      if (!res.data) {
        return;
      }
      // Background pictures
      const { backgrounds } = res.data;

      const background1 = backgrounds?.find(item => item.orders === 1);
      if (background1) {
        profileSection.style.backgroundImage = `url(${utils.getFullUrl(`${background1.path}/${background1.name}`)})`;
      }

      // Profile picture
      const { profile } = res.data;
      profilePic.src = utils.getFullUrl(`${profile.path}/${profile.name}`);
    }
  });

  window.onresize = () => {
    profileSection.style.height = getScreenHeight();
  };
};

export default main;

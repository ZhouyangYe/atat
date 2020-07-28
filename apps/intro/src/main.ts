import { services, utils } from 'atat-common';

const getScreenHeight = () => {
  return `${window.innerHeight}px`;
}

console.log('hello');

const main = (): void => {
  const profileSection = document.querySelector<HTMLElement>('.profile');
  const profilePic = document.querySelector<HTMLImageElement>('.profile-pic');

  const algorithmsSection = document.querySelector<HTMLElement>('.algorithms-title');

  const homeSection = document.querySelector<HTMLElement>('.home-title');
  
  const appsSection = document.querySelector<HTMLElement>('.apps-title');

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

      const background2 = backgrounds?.find(item => item.orders === 2);
      if (background2) {
        homeSection.style.backgroundImage = `url(${utils.getFullUrl(`${background2.path}/${background2.name}`)})`;
      }

      const background3 = backgrounds?.find(item => item.orders === 3);
      if (background3) {
        algorithmsSection.style.backgroundImage = `url(${utils.getFullUrl(`${background3.path}/${background3.name}`)})`;
      }

      const background4 = backgrounds?.find(item => item.orders === 4);
      if (background4) {
        appsSection.style.backgroundImage = `url(${utils.getFullUrl(`${background4.path}/${background4.name}`)})`;
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

import { doAnimationInterval } from '@/utils';

import './index.less';

export interface IConfig {
  src: string;
  title: string;
  autoplay?: boolean;
  loop?: boolean;
}

class Audio {
  private defaultConfig: IConfig = {
    src: '',
    title: '',
    autoplay: true,
    loop: true,
  };

  private audio: HTMLAudioElement;

  private controller: HTMLElement;

  private playButton: HTMLImageElement;

  private title: HTMLElement;

  private content: HTMLElement;

  private config: IConfig;

  private cancelScroll: () => void;

  private rollingTimer: NodeJS.Timer = null;

  private titleWidth: number;

  private titleContainerWidth: number;

  constructor(config: IConfig) {
    this.config = config;

    this.createAudio();
    this.createController();
  }

  getDom = (): HTMLElement => {
    return this.controller;
  };

  private createAudio = (): void => {
    const {
      src,
      autoplay = this.defaultConfig.autoplay,
      loop = this.defaultConfig.loop,
    } = this.config;

    this.audio = document.createElement('audio');
    this.audio.src = src;
    this.audio.autoplay = autoplay;
    this.audio.loop = loop;

    const handleAutoPlay = () => {
      if (autoplay && this.audio.paused) {
        this.play();
      }
    };
    document.addEventListener('click', handleAutoPlay, false);
  }

  private createController = () => {
    const {
      title,
    } = this.config;

    this.controller = document.createElement('div');
    this.controller.id = 'audio';
    this.controller.style.backgroundImage = `url('/@resources/static/materials/mountains.png')`;
    this.controller.style.backgroundSize = '100% 100%';
    this.controller.style.backgroundRepeat = 'no-repeat';

    this.playButton = document.createElement('img');
    this.playButton.className = 'play-button';
    this.playButton.src = '/@resources/static/icons/play-button-2.svg';

    this.title = document.createElement('div');
    this.content = document.createElement('div');
    this.title.className = 'audio-title';
    this.content.className = 'title-wrap';
    this.content.innerHTML = title;
    this.title.appendChild(this.content);

    this.controller.appendChild(this.playButton);
    this.controller.appendChild(this.title);

    this.controller.onclick = (evt: MouseEvent) => {
      evt.stopPropagation();
    };

    this.playButton.onclick = () => {
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    };
  };

  private rolling = () => {
    this.cancelScroll = doAnimationInterval(() => {
      if (!this.titleWidth) this.titleWidth = this.content.clientWidth;
      if (!this.titleContainerWidth) this.titleContainerWidth = this.title.clientWidth;
      const left = this.content.offsetLeft;
      this.content.style.left = `${left - 1}px`;

      if (left < -this.titleWidth) {
        this.content.style.left = `${this.titleContainerWidth}px`;
        this.cancelScroll();
        this.rollingTimer = setTimeout(() => {
          this.rolling();
        }, 2000);
      }
    });
  };

  private play = (): void => {
    this.rolling();
    this.audio.play();
    this.playButton.src = '/@resources/static/icons/pause-2.svg';
  }

  private pause = (): void => {
    clearTimeout(this.rollingTimer);
    this.cancelScroll();
    this.audio.pause();
    this.playButton.src = '/@resources/static/icons/play-button-2.svg';
  };
}

export default Audio;

import { doAnimationInterval } from '@/utils/animation';

import './index.less';

export interface IConfig {
  src: string;
  title: string;
  autoplay?: boolean;
  loop?: boolean;
  autoHide?: boolean;
}

class Audio {
  private defaultConfig: IConfig = {
    src: '',
    title: '',
    autoplay: true,
    loop: true,
    autoHide: true,
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

  private autoHide: boolean;

  private autoHideTimer: NodeJS.Timer = null;

  private isMouseOverController = false;

  private lock: HTMLElement;

  private handleDocumentClick: () => void;

  constructor(config: IConfig) {
    this.config = config;

    this.createAudio();
    this.createController();
  }

  getDom = (): HTMLElement => {
    return this.controller;
  };

  hide = (): void => {
    if (this.autoHide) {
      clearTimeout(this.autoHideTimer);
      this.controller.className = 'hide';
    }
  };

  show(): void {
    if (!this.autoHide || this.isMouseOverController) return;

    this.controller.className = 'show';
    this.hideControllerAfterDelay();
  }

  private createAudio = (): void => {
    const {
      src,
      autoplay = this.defaultConfig.autoplay,
      loop = this.defaultConfig.loop,
      autoHide = this.defaultConfig.autoHide,
    } = this.config;

    this.autoHide = autoHide;

    this.audio = document.createElement('audio');
    this.audio.src = src;
    this.audio.autoplay = autoplay;
    this.audio.loop = loop;
  };

  private hideControllerAfterDelay = (): void => {
    clearTimeout(this.autoHideTimer);
    this.autoHideTimer = setTimeout(() => {
      this.controller.className = 'hide';
    }, 3000);
  };

  private createController = () => {
    const {
      title,
      autoplay = this.defaultConfig.autoplay,
    } = this.config;

    this.controller = document.createElement('div');
    this.controller.id = 'audio';
    this.controller.style.backgroundImage = `url('/@resources/static/materials/mountains.png')`;
    this.controller.style.backgroundSize = '100% 100%';
    this.controller.style.backgroundRepeat = 'no-repeat';
    this.controller.className = this.autoHide ? 'hide' : 'show';

    if (this.autoHide && autoplay) {
      this.handleDocumentClick = () => {
        this.play();
        document.removeEventListener('click', this.handleDocumentClick, false);
        this.handleDocumentClick = undefined;
      };
      document.addEventListener('click', this.handleDocumentClick, false);
    }

    this.controller.onmouseenter = () => {
      if (!this.autoHide) return;

      this.isMouseOverController = true;
      this.controller.className = 'show';
      clearTimeout(this.autoHideTimer);
    };

    this.controller.onmouseleave = () => {
      if (!this.autoHide) return;

      this.isMouseOverController = false;
      this.hideControllerAfterDelay();
    };

    this.controller.onclick = (evt: MouseEvent) => {
      evt.stopPropagation();
    };

    const removeDocumentListener = () => {
      if (this.handleDocumentClick) {
        document.removeEventListener('click', this.handleDocumentClick, false);
        this.handleDocumentClick = undefined;
      }
    };
    this.playButton = document.createElement('img');
    this.playButton.className = 'play-button';
    this.audio.onplay = () => {
      removeDocumentListener();
      this.rolling();
      this.playButton.src = '/@resources/static/icons/pause-2.svg';
    };
    this.audio.onpause = () => {
      removeDocumentListener();
      clearTimeout(this.rollingTimer);
      if (this.cancelScroll) this.cancelScroll();
      this.playButton.src = '/@resources/static/icons/play-button-2.svg';
    }
    this.playButton.src = '/@resources/static/icons/play-button-2.svg';

    this.title = document.createElement('div');
    this.content = document.createElement('div');
    this.title.className = 'audio-title';
    this.content.className = 'title-wrap';
    this.content.innerHTML = title;
    this.title.appendChild(this.content);

    this.lock = document.createElement('dev');
    const lockTitle = document.createElement('div');
    lockTitle.innerHTML = '定';
    this.lock.className = this.autoHide ? 'lock' : 'lock active';
    
    this.lock.onmousedown = (evt: MouseEvent) => { evt.stopPropagation(); };
    this.lock.onclick = () => {
      if (this.autoHide) {
        this.lock.className = 'lock active';
      } else {
        this.lock.className = 'lock';
      }
      this.setAutoHide(!this.autoHide);
    };
    this.lock.appendChild(lockTitle);

    this.controller.appendChild(this.playButton);
    this.controller.appendChild(this.title);
    this.controller.appendChild(this.lock);

    this.controller.onclick = (evt: MouseEvent) => {
      evt.stopPropagation();
    };

    this.playButton.onmousedown = (evt: MouseEvent) => { evt.stopPropagation(); };
    this.playButton.onclick = () => {
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    };
  };

  private rolling = () => {
    if (this.cancelScroll) this.cancelScroll();
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
    this.audio.play();
  }

  private pause = (): void => {
    this.audio.pause();
  };

  private setAutoHide = (autoHide: boolean): void => {
    this.autoHide = autoHide;
  };
}

export default Audio;

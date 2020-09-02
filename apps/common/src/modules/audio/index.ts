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

  private config: IConfig;

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

    this.playButton = document.createElement('img');
    this.playButton.className = 'play-button';
    this.playButton.src = '/@resources/static/icons/play-button-1.svg';

    this.title = document.createElement('div');
    this.title.className = 'audio-title';
    this.title.innerHTML = title;

    this.controller.appendChild(this.playButton);
    this.controller.appendChild(this.title);

    this.controller.onclick = (evt: MouseEvent) => {
      evt.stopPropagation();
    };

    this.playButton.onclick = () => {
      console.log(this.audio.paused);
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    };
  };

  private play = (): void => {
    this.audio.play();
    this.playButton.src = '/@resources/static/icons/pause-1.svg';
  }

  private pause = (): void => {
    console.log('in');
    this.audio.pause();
    this.playButton.src = '/@resources/static/icons/play-button-1.svg';
  };
}

export default Audio;

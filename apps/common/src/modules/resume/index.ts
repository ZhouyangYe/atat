import { IResume, IResumeLan } from '@/services/intro';

import './index.less';

export interface CONFIG {
  show?: boolean;
  mode?: MODE;
}

export enum LANGUAGE {
  CH = 'ch',
  EN = 'en',
}

export enum MODE {
  EDIT = 'edit',
  PREVIEW = 'preview',
}

interface ILocale {
  save: string;
  close: string;
  lan: string;
  resume?: IResumeLan
}

class Resume {
  private data: IResume;
  private loading = false;
  private loadingBar: HTMLDivElement;
  private mode: MODE;
  private showOnDefault: boolean;
  private resume: HTMLDivElement;
  private content: HTMLDivElement;
  private lan = LANGUAGE.CH;
  private locale: { ch: ILocale; en: ILocale } = {
    ch: {
      save: '保存',
      close: '关闭',
      lan: 'English',
      resume: null,
    },
    en: {
      save: 'Save',
      close: 'Close',
      lan: '中文',
      resume: null,
    },
  };

  getDom(): HTMLDivElement {
    return this.resume;
  }

  constructor(getResumeData: Promise<IResume | undefined>, config?: CONFIG) {
    const {
      show = false,
      mode = MODE.PREVIEW,
    } = config;
    this.showOnDefault = show;
    this.mode = mode;
    this.render();
    getResumeData.then((res) => {
      if (!res) {
        return;
      }
      this.locale.ch.resume = res.ch;
      this.locale.en.resume = res.en;
      this.content.innerHTML = this.getResumeContent();
      this.loadingBar.style.display = 'none';
      this.resize();
    });
  }

  show(): void {
    this.resume.style.top = '0';
    setTimeout(() => {
      this.resume.className = 'show';
    }, 0);
  }

  resize(): void {
    const
      wrap = this.resume.querySelector<HTMLDivElement>('.wrap'),
      scrollBar = this.resume.querySelector<HTMLDivElement>('.scroll-bar'),
      containerHeight = wrap.clientHeight;

    const contentHeight = this.content.clientWidth * 1.4142;
    this.content.style.minHeight = `${contentHeight}px`;
    scrollBar.style.top = '0';

    const
      delta = containerHeight - this.content.clientHeight,
      deltaHeight = containerHeight - scrollBar.clientHeight;

    const getTop = (top: number) => {
      if (top > 0) {
        return 0;
      } else if (top < delta) {
        return delta;
      }

      return top;
    };

    const
      speed = 30,
      scrollTo = (yAxis: number) => {
        this.content.style.top = `${Math.floor(yAxis)}px`;
      };

    let y = getTop(wrap.offsetTop);
    scrollTo(y);

    wrap.onwheel = (evt) => {
      if (evt.deltaY > 0) {
        y -= speed;
      } else {
        y += speed;
      }

      y = getTop(y);

      const barRatio = y / delta;
      const barTop = deltaHeight * barRatio;
      scrollBar.style.top = `${barTop}px`;

      scrollTo(y);
    };

    const getBarTop = (barY: number) => {
      if (barY < 0) {
        return 0;
      } else if (barY > deltaHeight) {
        return deltaHeight;
      }

      return barY;
    };

    scrollBar.onmousedown = (event) => {
      event.preventDefault();
      const initY = event.clientY;
      const initTop = scrollBar.offsetTop;
      scrollBar.style.transition = 'none';
      this.content.style.transition = 'none';

      this.resume.onmousemove = (e) => {
        e.stopPropagation();
        const bDelta = e.clientY - initY;
        const top = getBarTop(initTop + bDelta);
        const barRatio = top / deltaHeight;
        y = getTop(barRatio * delta);
        scrollBar.style.top = `${top}px`;
        scrollTo(y);
      };

      this.resume.onmouseup = () => {
        this.resume.onmousemove = (e) => { e.stopPropagation(); };
        this.resume.onmouseup = null;
        scrollBar.style.transition = 'top 0.2s ease, opacity 0.2s ease';
        this.content.style.transition = 'top 0.2s ease';
      };
    }
  }

  private getText(str: [string, string]): string {
    const i = this.lan === LANGUAGE.CH ? 0 : 1;
    return str[i];
  }

  private getResumeContent(): string {
    const resume = this.locale[this.lan].resume;
    return `
      <div class='main'>
        <h2 id='education' class='education'>
          <img class='icon' src='/@resources/static/resume/education.png' />${this.getText(['教育经历', 'EDUCATION'])}
          ${this.mode === MODE.EDIT && `<div class='options'><img data-name='education' data-action='add' src='/@resources/static/icons/add.svg'></div>`}
        </h2>
        ${resume.education.map((e, i) => {
          return `
            <h3>
              ${e.major}
              ${this.mode === MODE.EDIT && `
                <div class='options'>
                  <img data-name='education' data-index='${i}' data-action='edit' src='/@resources/static/icons/edit.svg'>
                  <img data-name='education' data-index='${i}' data-action='delete' src='/@resources/static/icons/delete.svg'>
                </div>
              `}
            </h3>
            <p>
              <img src='/@resources/static/resume/calendar.png' />
              <span>${e.time}</span>
            </p>
            <p class='last'>
              <img src='/@resources/static/resume/school.png' />
              <span>${e.school}</span>
            </p>
          `;
        }).join('')}
        <h2 id='experience' class='experience'>
          <img class='icon' src='/@resources/static/resume/work.png' />${this.getText(['工作经历', 'EXPERIENCE'])}
          ${this.mode === MODE.EDIT && `<div class='options'><img data-name='experience' data-action='add' src='/@resources/static/icons/add.svg'></div>`}
        </h2>
        ${resume.experience.map((e, i) => {
          return `
            <h3>
              ${e.title}
              ${this.mode === MODE.EDIT && `
                <div class='options'>
                  <img data-name='experience' data-index='${i}' data-action='edit' src='/@resources/static/icons/edit.svg'>
                  <img data-name='experience' data-index='${i}' data-action='delete' src='/@resources/static/icons/delete.svg'>
                </div>
              `}
            </h3>
            <p>
              <img src='/@resources/static/resume/calendar.png' />
              <span>${e.time}</span>
            </p>
            <p>
              <img src='/@resources/static/resume/company.png' />
              <span>${e.company}</span>
            </p>
            <ul>
              ${e.disc.map((d) => {
                return `
                  <li><div class='dot'></div>${d}</li>
                `;
              }).join('')}
            </ul>
          `;
        }).join('')}
        <h2 id='skills' class='skills'>
          <img class='icon' src='/@resources/static/resume/skill.png' />${this.getText(['职业技能', 'TECHNICAL SKILLS'])}
          ${this.mode === MODE.EDIT && `<div class='options'><img data-name='techSkill' data-action='edit' src='/@resources/static/icons/edit.svg'></div>`}
        </h2>
        <p class='skills'>
          ${resume.techSkill.skill.map((ts) => {
            return `<span>${ts}</span>`;
          }).join(`<span class='dot'></span>`)}
        </p>
        <p class='skills'>
          <span>${this.getText(['熟悉', 'Familiar with'])}: </span>
          ${resume.techSkill.familiar.map((ts) => {
            return `<span>${ts}</span>`;
          }).join(`<span class='dot'></span>`)}
        </p>
      </div>
      <div class='side-bar'>
        <img class='photo' src='/@resources/static/resume/photo.jpg'>
        <h2 id='name' class='name'>
          ${resume.name}
          ${this.mode === MODE.EDIT && `<div class='options'><img data-name='name' data-action='edit' src='/@resources/static/icons/edit.svg'></div>`}
        </h2>
        <h3>${resume.title}</h3>
        <h2 id='title' class='title'>
          <img class='icon' src='/@resources/static/resume/about.png'>${this.getText(['关于', 'About'])}
          ${this.mode === MODE.EDIT && `<div class='options'><img data-name='about' data-action='edit' src='/@resources/static/icons/edit.svg'></div>`}
        </h2>
        ${resume.about.map((a, i) => {
          return `
            <p class='about-${i} about'>${a}</p>
          `;
        }).join('')}
        <p class='personality'>${this.getText(['个人能力', 'Personality'])}:&nbsp;&nbsp;&nbsp; ${resume.skill.map((s) => `<span>${s}</span>`).join(`<span class='dot'></span>`)}</p>
        <h2 id='contact' class='contact'>
          <img class='icon' src='/@resources/static/resume/contact.png'>${this.getText(['联系方式', 'Contact'])}
          ${this.mode === MODE.EDIT && `<div class='options'><img data-name='contact' data-action='edit' src='/@resources/static/icons/edit.svg'></div>`}
        </h2>
        <p class='info'><img src='/@resources/static/resume/phone.png'>${resume.contact.phone}</p>
        <p class='info email'><img src='/@resources/static/resume/email.png'>${resume.contact.email}</p>
        <p class='info'><img src='/@resources/static/resume/wechat.png'>${resume.contact.wechat}</p>
        <p class='info'><img src='/@resources/static/resume/location.png'>${resume.contact.location}</p>
        <p class='info'><img src='/@resources/static/resume/github.png'>${resume.contact.github}</p>
        <h2 id='interests' class='bottom'>
          <img class='icon' src='/@resources/static/resume/interests.png'>${this.getText(['兴趣爱好', 'Interests'])}
          ${this.mode === MODE.EDIT && `<div class='options'><img data-name='interests' data-action='edit' src='/@resources/static/icons/edit.svg'></div>`}
        </h2>
        <div class='interests'>
          ${resume.interests.map((i) => {
            return `
              <div><img src='${i}'></div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  private getTemplate(): string {
    return `
      <main class='wrap'>
        <div class='content'></div>
        <div class='loading-bar'>${new Array(10).fill('wave').map((className) => `<div class="${className}"></div>`).join('')}</div>
        <div class='scroll-bar'></div>
      </main>
      <footer>
        <div class='language'>English</div>
        <div class='button'>
          <div class='save'>${this.locale[this.lan].save}</div>
          <div class='close'>${this.locale[this.lan].close}</div>
        </div>
      </footer>
    `;
  }

  private render(): void {
    this.resume = document.createElement('div');
    this.resume.id = 'resume';
    this.resume.className = this.showOnDefault ? 'show' : 'hide';
    this.resume.style.top = this.showOnDefault ? '0' : '-100vh';


    this.resume.innerHTML = this.getTemplate();

    const
      language = this.resume.querySelector<HTMLDivElement>('.language'),
      save = this.resume.querySelector<HTMLDivElement>('.save'),
      close = this.resume.querySelector<HTMLDivElement>('.close'),
      content = this.resume.querySelector<HTMLDivElement>('.content');

    this.content = content;
    this.loadingBar = this.resume.querySelector<HTMLDivElement>('.loading-bar');

    content.onclick = (e) => {
      console.log(e.target);
    };

    language.onclick = () => {
      if (this.loading) return;
      this.lan = this.lan === LANGUAGE.CH ? LANGUAGE.EN : LANGUAGE.CH;
      const text = this.locale[this.lan];
      language.innerHTML = text.lan;
      save.innerHTML = text.save;
      close.innerHTML = text.close;
      content.innerHTML = this.getResumeContent();
      this.resize();
    };

    save.onclick = () => {
      if (this.loading) return;
      content.style.top = '0';
      this.resume.classList.add('print');
      window.print();
      this.resume.classList.remove('print');
    };

    close.onclick = () => {
      this.resume.className = 'hide';
      setTimeout(() => {
        this.resume.style.top = '-100vh';
      }, 600);
    };

    this.resume.onscroll = (e) => {
      e.stopPropagation();
    };
    this.resume.onwheel = (e) => {
      e.stopPropagation();
    };
    this.resume.onmousedown = (e) => {
      e.stopPropagation();
    };
    this.resume.onclick = (e) => {
      e.stopPropagation();
    };
    this.resume.oncontextmenu = (e) => {
      e.stopPropagation();
    };
    if (this.mode !== MODE.EDIT) {
      this.resume.onmousemove = (e) => {
        e.stopPropagation();
      };
    }
  }
}

export default Resume;

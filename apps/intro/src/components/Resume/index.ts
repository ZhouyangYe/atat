import res from './resume';

import './index.less';

export enum LANGUAGE {
  CH = 'ch',
  EN = 'en',
}

class Resume {
  private showOnDefault: boolean;
  private resume: HTMLDivElement;
  private content: HTMLDivElement;
  private lan = LANGUAGE.CH;
  private locale = {
    ch: {
      save: '保存',
      close: '关闭',
      lan: 'English',
      resume: res.ch,
    },
    en: {
      save: 'Save',
      close: 'Close',
      lan: '中文',
      resume: res.en,
    },
  };

  getDom(): HTMLDivElement {
    return this.resume;
  }

  constructor(show = false) {
    this.showOnDefault = show;
    this.render();
  }

  show(): void {
    this.resume.style.visibility = 'visible';
    setTimeout(() => {
      this.resume.className = 'show';
    }, 0);
  }

  onResize(): void {
    const
      wrap = this.resume.querySelector<HTMLDivElement>('.wrap'),
      scrollBar = this.resume.querySelector<HTMLDivElement>('.scroll-bar');

    const contentHeight = this.content.clientWidth * 1.4142;
    this.content.style.minHeight = `${contentHeight}px`;

    const getTop = (top: number) => {
      if (top > 0) {
        return 0;
      } else if (top < delta) {
        return delta;
      }

      return top;
    };

    const
      containerHeight = wrap.clientHeight,
      delta = containerHeight - this.content.clientHeight,
      deltaHeight = containerHeight - scrollBar.clientHeight,
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
        <h2 class='first'><img src='/@resources/static/resume/education.png' />${this.getText(['教育经历', 'EDUCATION'])}</h2>
        ${resume.education.map((e) => {
          return `
            <h3>${e.major}</h3>
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
        <h2><img src='/@resources/static/resume/work.png' />${this.getText(['工作经历', 'EXPERIENCE'])}</h2>
        ${resume.experience.map((e) => {
          return `
            <h3>${e.title}</h3>
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
        <h2><img src='/@resources/static/resume/skill.png' />${this.getText(['职业技能', 'TECHNICAL SKILLS'])}</h2>
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
        <h2 class='name'>${resume.name}</h2>
        <h3>${resume.title}</h3>
        <h2><img src='/@resources/static/resume/about.png'>${this.getText(['关于', 'About'])}</h2>
        ${resume.about.map((a, i) => {
          return `
            <p class='about-${i} about'>${a}</p>
          `;
        }).join('')}
        <h2><img src='/@resources/static/resume/contact.png'>${this.getText(['联系方式', 'Contact'])}</h2>
        <p class='info'><img src='/@resources/static/resume/phone.png'>${resume.contact.phone}</p>
        <p class='info email'><img src='/@resources/static/resume/email.png'>${resume.contact.email}</p>
        <p class='info'><img src='/@resources/static/resume/wechat.png'>${resume.contact.wechat}</p>
        <p class='info'><img src='/@resources/static/resume/location.png'>${resume.contact.location}</p>
        <p class='info'><img src='/@resources/static/resume/github.png'>${resume.contact.github}</p>
        <h2 class='bottom'><img src='/@resources/static/resume/interests.png'>${this.getText(['兴趣爱好', 'Interests'])}</h2>
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
        <div class='content'>
          ${this.getResumeContent()}
        </div>
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
    this.resume.style.visibility = this.showOnDefault ? 'visible' : 'collapse';

    this.resume.innerHTML = this.getTemplate();

    const
      language = this.resume.querySelector<HTMLDivElement>('.language'),
      save = this.resume.querySelector<HTMLDivElement>('.save'),
      close = this.resume.querySelector<HTMLDivElement>('.close'),
      content = this.resume.querySelector<HTMLDivElement>('.content');
    this.content = content;

    language.onclick = () => {
      this.lan = this.lan === LANGUAGE.CH ? LANGUAGE.EN : LANGUAGE.CH;
      const text = this.locale[this.lan];
      language.innerHTML = text.lan;
      save.innerHTML = text.save;
      close.innerHTML = text.close;
      content.innerHTML = this.getResumeContent();
      this.onResize();
    };

    save.onclick = () => {
      content.style.top = '0';
      this.resume.classList.add('print');
      window.print();
      this.resume.classList.remove('print');
    };

    close.onclick = () => {
      this.resume.className = 'hide';
      setTimeout(() => {
        this.resume.style.visibility = 'collapse';
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
    this.resume.onmousemove = (e) => {
      e.stopPropagation();
    };
  }
}

export default Resume;

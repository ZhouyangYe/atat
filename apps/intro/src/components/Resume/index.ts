import res from './resume';

import './index.less';

export enum LANGUAGE {
  CH = 'ch',
  EN = 'en',
}

class Resume {
  private resume: HTMLDivElement;
  private lan = LANGUAGE.EN;
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

  constructor() {
    this.render();
  }

  show(): void {
    this.resume.style.display = 'flex';
    setTimeout(() => {
      this.resume.className = 'show';
    }, 0);
  }

  onResize(): void {
    const
      wrap = this.resume.querySelector<HTMLDivElement>('.wrap'),
      content = this.resume.querySelector<HTMLDivElement>('.content'),
      scrollBar = this.resume.querySelector<HTMLDivElement>('.scroll-bar');

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
      contentHeight = content.clientHeight;
    const delta = containerHeight - contentHeight;
    const deltaHeight = containerHeight - scrollBar.clientHeight;
    const speed = 30;
    const scrollTo = (yAxis: number) => {
      content.style.top = `${Math.floor(yAxis)}px`;
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
      content.style.transition = 'none';

      this.resume.onmousemove = (e) => {
        const bDelta = e.clientY - initY;
        const top = getBarTop(initTop + bDelta);
        const barRatio = top / deltaHeight;
        y = getTop(barRatio * delta);
        scrollBar.style.top = `${top}px`;
        scrollTo(y);
      };

      this.resume.onmouseup = () => {
        this.resume.onmousemove = null;
        this.resume.onmouseup = null;
        scrollBar.style.transition = 'top 0.2s ease, opacity 0.2s ease';
        content.style.transition = 'top 0.2s ease';
      };
    }
  }

  private getResumeContent(): string {
    const resume = this.locale[this.lan].resume;
    return `
      <div class='main'>
        <h2 class='first'><img src='/@resources/static/resume/education.png' />EDUCATION</h2>
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
        <h2><img src='/@resources/static/resume/work.png' />EXPERIENCE</h2>
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
        <h2><img src='/@resources/static/resume/skill.png' />TECHNICAL SKILLS</h2>
        <p class='skills'>
          ${resume.techSkill.skill.map((ts) => {
            return `<span>${ts}</span>`;
          }).join(`<span class='dot'></span>`)}
        </p>
        <p class='skills'>
          <span>Familiar with: </span>
          ${resume.techSkill.familiar.map((ts) => {
            return `<span>${ts}</span>`;
          }).join(`<span class='dot'></span>`)}
        </p>
      </div>
      <div class='side-bar'>
        <img src='/@resources/static/resume/photo.jpg'>
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
    this.resume.className = 'show';

    this.resume.innerHTML = this.getTemplate();

    const
      language = this.resume.querySelector<HTMLDivElement>('.language'),
      save = this.resume.querySelector<HTMLDivElement>('.save'),
      close = this.resume.querySelector<HTMLDivElement>('.close'),
      content = this.resume.querySelector<HTMLDivElement>('.content');

    language.onclick = () => {
      this.lan = this.lan === LANGUAGE.CH ? LANGUAGE.EN : LANGUAGE.CH;
      const text = this.locale[this.lan];
      language.innerHTML = text.lan;
      save.innerHTML = text.save;
      close.innerHTML = text.close;
      content.innerHTML = this.getResumeContent();
    };

    close.onclick = () => {
      this.resume.className = 'hide';
      setTimeout(() => {
        this.resume.style.display = 'none';
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

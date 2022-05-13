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

export enum ACTION {
  ADD = 'add',
  DELETE = 'delete',
  EDIT = 'edit',
  UP = 'up',
  DOWN = 'down',
}

export enum SECTION {
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
  TECHSKILL = 'techSkill',
  NAME = 'name',
  ABOUT = 'about',
  CONTACT = 'contact',
  INTERESTS = 'interests',
}

interface ILocale {
  revert: string;
  ok: string;
  cancel: string;
  save: string;
  close: string;
  lan: string;
  resume?: IResumeLan
}

class Resume {
  private origin_data: IResume;
  private timer: NodeJS.Timeout;
  private loading = true;
  private loadingBar: HTMLDivElement;
  private mode: MODE;
  private showOnDefault: boolean;
  private resume: HTMLDivElement;
  private content: HTMLDivElement;
  private lan = LANGUAGE.CH;
  private locale: { ch: ILocale; en: ILocale } = {
    ch: {
      revert: '恢复',
      ok: '确定',
      cancel: '取消',
      save: '保存',
      close: '关闭',
      lan: 'English',
      resume: null,
    },
    en: {
      revert: 'Revert',
      ok: 'OK',
      cancel: 'Cancel',
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
      this.origin_data = JSON.parse(JSON.stringify(res));
      this.locale.ch.resume = res.ch;
      this.locale.en.resume = res.en;
      this.content.innerHTML = this.getResumeContent();
      this.loadingBar.style.display = 'none';
      this.loading = false;
      this.resize();
    });
  }

  private renderTools(str: string): string {
    return this.mode === MODE.EDIT ? str : '';
  }

  show(): void {
    this.resume.style.top = '0';
    this.resume.className = 'show';
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
          ${this.renderTools(`<div class='options'><img data-name='${SECTION.EDUCATION}' data-action='${ACTION.ADD}' src='/@resources/static/icons/add.svg'></div>`)}
        </h2>
        ${resume.education.map((e, i) => {
          return `
            <h3>
              ${e.major}
              ${this.renderTools(`
                <div class='options'>
                  <img data-name='${SECTION.EDUCATION}' data-index='${i}' data-action='${ACTION.EDIT}' src='/@resources/static/icons/edit.svg'>
                  <img data-name='${SECTION.EDUCATION}' data-index='${i}' data-action='${ACTION.DELETE}' src='/@resources/static/icons/delete.svg'>
                  ${i === 0 ? '' : `<img data-name='${SECTION.EDUCATION}' data-index='${i}' data-action='${ACTION.UP}' src='/@resources/static/icons/up.svg'>`}
                  ${i === resume.education.length - 1 ? '' : `<img data-name='${SECTION.EDUCATION}' data-index='${i}' data-action='${ACTION.DOWN}' src='/@resources/static/icons/down.svg'>`}
                </div>
              `)}
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
          ${this.renderTools(`<div class='options'><img data-name='${SECTION.EXPERIENCE}' data-action='${ACTION.ADD}' src='/@resources/static/icons/add.svg'></div>`)}
        </h2>
        ${resume.experience.map((e, i) => {
          return `
            <h3>
              ${e.title}
              ${this.renderTools(`
                <div class='options'>
                  <img data-name='${SECTION.EXPERIENCE}' data-index='${i}' data-action='${ACTION.EDIT}' src='/@resources/static/icons/edit.svg'>
                  <img data-name='${SECTION.EXPERIENCE}' data-index='${i}' data-action='${ACTION.DELETE}' src='/@resources/static/icons/delete.svg'>
                  ${i === 0 ? '' : `<img data-name='${SECTION.EXPERIENCE}' data-index='${i}' data-action='${ACTION.UP}' src='/@resources/static/icons/up.svg'>`}
                  ${i === resume.experience.length - 1 ? '' : `<img data-name='${SECTION.EXPERIENCE}' data-index='${i}' data-action='${ACTION.DOWN}' src='/@resources/static/icons/down.svg'>`}
                </div>
              `)}
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
          ${this.renderTools(`<div class='options'><img data-name='${SECTION.TECHSKILL}' data-action='${ACTION.EDIT}' src='/@resources/static/icons/edit.svg'></div>`)}
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
          ${this.renderTools(`<div class='options'><img data-name='${SECTION.NAME}' data-action='${ACTION.EDIT}' src='/@resources/static/icons/edit.svg'></div>`)}
        </h2>
        <h3 class='profession'>${resume.title}</h3>
        <p class='web'>${resume.web}</p>
        <h2 id='title' class='title'>
          <img class='icon' src='/@resources/static/resume/about.png'>${this.getText(['关于', 'About'])}
          ${this.renderTools(`<div class='options'><img data-name='${SECTION.ABOUT}' data-action='${ACTION.EDIT}' src='/@resources/static/icons/edit.svg'></div>`)}
        </h2>
        ${resume.about.map((a, i) => {
          return `
            <p class='about-${i} about'>${a}</p>
          `;
        }).join('')}
        <p class='personality'>${this.getText(['个人能力', 'Personality'])}:&nbsp;&nbsp;&nbsp; ${resume.skill.map((s) => `<span>${s}</span>`).join(`<span class='dot'></span>`)}</p>
        <h2 id='contact' class='contact'>
          <img class='icon' src='/@resources/static/resume/contact.png'>${this.getText(['联系方式', 'Contact'])}
          ${this.renderTools(`<div class='options'><img data-name='${SECTION.CONTACT}' data-action='${ACTION.EDIT}' src='/@resources/static/icons/edit.svg'></div>`)}
        </h2>
        <p class='info'><img src='/@resources/static/resume/phone.png'>${resume.contact.phone}</p>
        <p class='info email'><img src='/@resources/static/resume/email.png'>${resume.contact.email}</p>
        <p class='info'><img src='/@resources/static/resume/wechat.png'>${resume.contact.wechat}</p>
        <p class='info'><img src='/@resources/static/resume/location.png'>${resume.contact.location}</p>
        <p class='info'><img src='/@resources/static/resume/github.png'>${resume.contact.github}</p>
        <h2 id='interests' class='bottom'>
          <img class='icon' src='/@resources/static/resume/interests.png'>${this.getText(['兴趣爱好', 'Interests'])}
          ${this.renderTools(`<div class='options'><img data-name='${SECTION.INTERESTS}' data-action='${ACTION.EDIT}' src='/@resources/static/icons/edit.svg'></div>`)}
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
      ${this.renderTools(`
        <div class='panel'>
          <div class='editor'>
            <div class='editor_ch'></div>
            <div class='editor_en'></div>
          </div>
          <div class='button'>
            <div class='cancel'>${this.locale[this.lan].cancel}</div>
            <div class='ok'>${this.locale[this.lan].ok}</div>
          </div>
        </div>
      `)}
      <main class='wrap'>
        <div class='content'></div>
        <div class='loading-bar'>${new Array(10).fill('wave').map((className) => `<div class="${className}"></div>`).join('')}</div>
        <div class='scroll-bar'></div>
      </main>
      <footer>
        <div class='language'>English</div>
        <div class='button'>
          ${this.renderTools(`<div class='revert'>${this.locale[this.lan].revert}</div>`)}
          <div class='save'>${this.locale[this.lan].save}</div>
          <div class='close'>${this.locale[this.lan].close}</div>
        </div>
      </footer>
    `;
  }

  private swap(arr: any[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
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
      revert = this.resume.querySelector<HTMLDivElement>('.revert'),
      panel = this.resume.querySelector<HTMLDivElement>('.panel'),
      content = this.resume.querySelector<HTMLDivElement>('.content'),
      editorCh = this.resume.querySelector<HTMLDivElement>('.editor_ch'),
      editorEn = this.resume.querySelector<HTMLDivElement>('.editor_en'),
      ok = this.resume.querySelector<HTMLDivElement>('.ok'),
      cancel = this.resume.querySelector<HTMLDivElement>('.cancel');

    this.content = content;
    this.loadingBar = this.resume.querySelector<HTMLDivElement>('.loading-bar');

    let commit: () => boolean;

    if (this.mode === MODE.EDIT) {
      content.onclick = (e) => {
        if (this.loading) {
          return;
        }
  
        const target = e.target as HTMLDivElement;
        const text_ch = this.locale[LANGUAGE.CH];
        const text_en = this.locale[LANGUAGE.EN];
  
        const showEditor = () => {
          panel.style.display = 'block';
          setTimeout(() => {
            panel.classList.add('show');
          }, 18);
        };
  
        switch(target.dataset.name) {
          case SECTION.EDUCATION: {
            const templateCh = `
              <div class='line'><h3>中文</h3></div>
              <div class='line'><span class='title'>专业:</span><input type='text' ></div>
              <div class='line'><span class='title'>时间:</span><input type='text' ></div>
              <div class='line'><span class='title'>学校:</span><input type='text' ></div>
            `;
            const templateEn = `
              <div class='line'><h3>English</h3></div>
              <div class='line'><span class='title'>Major:</span><input type='text' ></div>
              <div class='line'><span class='title'>Time:</span><input type='text' ></div>
              <div class='line'><span class='title'>School:</span><input type='text' ></div>
            `;
            switch(target.dataset.action) {
              case ACTION.DELETE: {
                showEditor();
                editorCh.innerHTML = `<h3>确定要删除吗？</h3>`;
                editorEn.innerHTML = `<h3>Make sure you do want to delete.</h3>`;
  
                commit = () => {
                  const index = Number(target.dataset.index);
                  text_ch.resume.education.splice(index, 1);
                  text_en.resume.education.splice(index, 1);
                  return true;
                };
                break;
              }
              case ACTION.ADD: {
                showEditor();
                editorCh.innerHTML = templateCh;
                editorEn.innerHTML = templateEn;
                const 
                  inputsCh = editorCh.querySelectorAll('input'),
                  inputsEn = editorEn.querySelectorAll('input');
  
                commit = () => {
                  const [majorCh, timeCh, schoolCh] = Array.from(inputsCh).map((input) => input.value.trim());
                  const [majorEn, timeEn, schoolEn] = Array.from(inputsEn).map((input) => input.value.trim());
                  if (majorCh && timeCh && schoolCh && majorEn && timeEn && schoolEn) {
                    text_ch.resume.education.unshift({
                      major: majorCh,
                      time: timeCh,
                      school: schoolCh,
                    });
                    text_en.resume.education.unshift({
                      major: majorEn,
                      time: timeEn,
                      school: schoolEn,
                    });
  
                    return true;
                  }
                  return false;
                };
                break;
              }
              case ACTION.EDIT: {
                showEditor();
                editorCh.innerHTML = templateCh;
                editorEn.innerHTML = templateEn;
  
                const index = Number(target.dataset.index),
                  inputsCh = editorCh.querySelectorAll('input'),
                  inputsEn = editorEn.querySelectorAll('input'),
                  educationCh = text_ch.resume.education[index],
                  educationEn = text_en.resume.education[index];
  
                inputsCh[0].value = educationCh.major;
                inputsCh[1].value = educationCh.time;
                inputsCh[2].value = educationCh.school;
                inputsEn[0].value = educationEn.major;
                inputsEn[1].value = educationEn.time;
                inputsEn[2].value = educationEn.school;
  
                commit = () => {
                  const [majorCh, timeCh, schoolCh] = Array.from(inputsCh).map((input) => input.value.trim());
                  const [majorEn, timeEn, schoolEn] = Array.from(inputsEn).map((input) => input.value.trim());
                  if (majorCh && timeCh && schoolCh && majorEn && timeEn && schoolEn) {
                    educationCh.major = majorCh;
                    educationCh.time = timeCh;
                    educationCh.school = schoolCh;
                    educationEn.major = majorEn;
                    educationEn.time = timeEn;
                    educationEn.school = schoolEn;
                    return true;
                  }
                  return false;
                };
                break;
              }
              case ACTION.UP: {
                const index = Number(target.dataset.index);
                this.swap(text_ch.resume.education, index, index - 1);
                this.swap(text_en.resume.education, index, index - 1);
                this.content.innerHTML = this.getResumeContent();
                break;
              }
              case ACTION.DOWN: {
                const index = Number(target.dataset.index);
                this.swap(text_ch.resume.education, index, index + 1);
                this.swap(text_en.resume.education, index, index + 1);
                this.content.innerHTML = this.getResumeContent();
                break;
              }
              default:
                break;
            }
            break;
          }
          case SECTION.EXPERIENCE: {
            const templateCh = `
              <div class='line'><h3>中文</h3></div>
              <div class='line'><span class='title'>职位:</span><input type='text' ></div>
              <div class='line'><span class='title'>时间:</span><input type='text' ></div>
              <div class='line'><span class='title'>公司:</span><input type='text' ></div>
              <div class='line'><span class='title'>经历:</span><textarea cols='21' rows='3'></textarea></div>
            `;
            const templateEn = `
              <div class='line'><h3>English</h3></div>
              <div class='line'><span class='title'>Position:</span><input type='text' ></div>
              <div class='line'><span class='title'>Time:</span><input type='text' ></div>
              <div class='line'><span class='title'>Employer:</span><input type='text' ></div>
              <div class='line'><span class='title'>Experience:</span><textarea cols='21' rows='3'></textarea></div>
            `;
            switch(target.dataset.action) {
              case ACTION.ADD: {
                showEditor();
                editorCh.innerHTML = templateCh;
                editorEn.innerHTML = templateEn;
                const 
                  inputsCh = editorCh.querySelectorAll('input'),
                  inputsEn = editorEn.querySelectorAll('input'),
                  experienceCh = editorCh.querySelector('textarea'),
                  experienceEn = editorEn.querySelector('textarea');

                commit = () => {
                  const [positionCh, timeCh, employerCh] = Array.from(inputsCh).map((input) => input.value.trim());
                  const [positionEn, timeEn, employerEn] = Array.from(inputsEn).map((input) => input.value.trim());
                  const experienceChValue = experienceCh.value.trim();
                  const experienceEnValue = experienceCh.value.trim();
                  if (positionCh && timeCh && employerCh && experienceChValue && positionEn && timeEn && employerEn && experienceEnValue) {
                    const discCh = experienceCh.value.split('\n').map((str) => str.trim());
                    const discEn = experienceEn.value.split('\n').map((str) => str.trim());
                    text_ch.resume.experience.unshift({
                      title: positionCh,
                      time: timeCh,
                      company: employerCh,
                      disc: discCh,
                    });
                    text_en.resume.experience.unshift({
                      title: positionEn,
                      time: timeEn,
                      company: employerEn,
                      disc: discEn,
                    });

                    return true;
                  }
                  return false;
                };
                break;
              }
              case ACTION.EDIT: {
                showEditor();
                editorCh.innerHTML = templateCh;
                editorEn.innerHTML = templateEn;
                const 
                  inputsCh = editorCh.querySelectorAll('input'),
                  inputsEn = editorEn.querySelectorAll('input'),
                  experienceCh = editorCh.querySelector('textarea'),
                  experienceEn = editorEn.querySelector('textarea'),
                  index = Number(target.dataset.index);

                inputsCh[0].value = text_ch.resume.experience[index].title;
                inputsCh[1].value = text_ch.resume.experience[index].time;
                inputsCh[2].value = text_ch.resume.experience[index].company;
                experienceCh.value = text_ch.resume.experience[index].disc.join('\n\n');
                inputsEn[0].value = text_en.resume.experience[index].title;
                inputsEn[1].value = text_en.resume.experience[index].time;
                inputsEn[2].value = text_en.resume.experience[index].company;
                experienceEn.value = text_en.resume.experience[index].disc.join('\n\n');

                commit = () => {
                  const [positionCh, timeCh, employerCh] = Array.from(inputsCh).map((input) => input.value.trim());
                  const [positionEn, timeEn, employerEn] = Array.from(inputsEn).map((input) => input.value.trim());
                  const experienceChValue = experienceCh.value.trim();
                  const experienceEnValue = experienceCh.value.trim();
                  if (positionCh && timeCh && employerCh && experienceChValue && positionEn && timeEn && employerEn && experienceEnValue) {
                    const discCh = experienceCh.value.split('\n').map((str) => str.trim()).filter((str) => !!str);
                    const discEn = experienceEn.value.split('\n').map((str) => str.trim()).filter((str) => !!str);
                    text_ch.resume.experience[index].title = positionCh;
                    text_ch.resume.experience[index].time = timeCh;
                    text_ch.resume.experience[index].company = employerCh;
                    text_ch.resume.experience[index].disc = discCh;
                    text_en.resume.experience[index].title = positionEn;
                    text_en.resume.experience[index].time = timeEn;
                    text_en.resume.experience[index].company = employerEn;
                    text_en.resume.experience[index].disc = discEn;

                    return true;
                  }
                  return false;
                };
                break;
              }
              case ACTION.DELETE: {
                showEditor();
                editorCh.innerHTML = `<h3>确定要删除吗？</h3>`;
                editorEn.innerHTML = `<h3>Make sure you do want to delete.</h3>`;

                commit = () => {
                  const index = Number(target.dataset.index);
                  text_ch.resume.experience.splice(index, 1);
                  text_en.resume.experience.splice(index, 1);

                  return true;
                };
                break;
              }
              case ACTION.UP: {
                const index = Number(target.dataset.index);
                this.swap(text_ch.resume.experience, index, index - 1);
                this.swap(text_en.resume.experience, index, index - 1);
                this.content.innerHTML = this.getResumeContent();
                break;
              }
              case ACTION.DOWN: {
                const index = Number(target.dataset.index);
                this.swap(text_ch.resume.experience, index, index + 1);
                this.swap(text_en.resume.experience, index, index + 1);
                this.content.innerHTML = this.getResumeContent();
                break;
              }
              default:
                break;
            }
            break;
          }
          case SECTION.TECHSKILL: {
            showEditor();
            editorCh.innerHTML = `
              <div class='line'><h3>中文</h3></div>
              <div class='line'><span class='title'>专业技能:</span><textarea cols='21' rows='6' ></textarea></div>
              <div class='line'><span class='title'>熟悉:</span><textarea cols='21' rows='6' ></textarea></div>
            `;
            editorEn.innerHTML = `
              <div class='line'><h3>English</h3></div>
              <div class='line'><span class='title'>Professional:</span><textarea cols='21' rows='6' ></textarea></div>
              <div class='line'><span class='title'>Familiar with:</span><textarea cols='21' rows='6' ></textarea></div>
            `;

            const
              techSkillsCh = editorCh.querySelectorAll('textarea'),
              techSkillsEn = editorEn.querySelectorAll('textarea');

            techSkillsCh[0].value = text_ch.resume.techSkill.skill.join(', ');
            techSkillsCh[1].value = text_ch.resume.techSkill.familiar.join(', ');
            techSkillsEn[0].value = text_en.resume.techSkill.skill.join(', ');
            techSkillsEn[1].value = text_en.resume.techSkill.familiar.join(', ');

            commit = () => {
              const [skillCh, familiarCh] = Array.from(techSkillsCh).map((skills) => skills.value.trim().split(',').map((skill) => skill.trim()).filter((skill) => !!skill));
              const [skillEn, familiarEn] = Array.from(techSkillsEn).map((skills) => skills.value.trim().split(',').map((skill) => skill.trim()).filter((skill) => !!skill));
              if (skillCh?.length && skillEn?.length && familiarCh?.length && familiarEn?.length) {
                text_ch.resume.techSkill.skill = skillCh;
                text_ch.resume.techSkill.familiar = familiarCh;
                text_en.resume.techSkill.skill = skillEn;
                text_en.resume.techSkill.familiar = familiarEn;

                return true;
              }

              return false;
            };
            break;
          }
          case SECTION.NAME: {
            showEditor();
            editorCh.innerHTML = `
              <div class='line'><h3>中文</h3></div>
              <div class='line'><span class='title'>姓名:</span><input type='text'></div>
              <div class='line'><span class='title'>职位:</span><input type='text'></div>
              <div class='line'><span class='title'>网站:</span><input type='text'></div>
            `;
            editorEn.innerHTML = `
              <div class='line'><h3>English</h3></div>
              <div class='line'><span class='title'>Name:</span><input type='text'></div>
              <div class='line'><span class='title'>Title:</span><input type='text'></div>
            `;
            const
              infoCh = editorCh.querySelectorAll('input'),
              infoEn = editorEn.querySelectorAll('input');

            infoCh[0].value = text_ch.resume.name;
            infoCh[1].value = text_ch.resume.title;
            infoCh[2].value = text_ch.resume.web;
            infoEn[0].value = text_en.resume.name;
            infoEn[1].value = text_en.resume.title;

            commit = () => {
              const [nameCh, titleCh, webCh] = Array.from(infoCh).map((info) => info.value.trim());
              const [nameEn, titleEn] = Array.from(infoEn).map((info) => info.value.trim());

              if (nameCh && titleCh && nameEn && titleEn && webCh) {
                text_ch.resume.name = nameCh;
                text_ch.resume.title = titleCh;
                text_ch.resume.web = webCh;
                text_en.resume.name = nameEn;
                text_en.resume.title = titleEn;
                text_en.resume.web = webCh;
                return true;
              }
              return false;
            };
            break;
          }
          case SECTION.ABOUT: {
            showEditor();
            editorCh.innerHTML = `
              <div class='line'><h3>中文</h3></div>
              <div class='line'><span class='title'>关于:</span><textarea cols='21' rows='6' ></textarea></div>
              <div class='line'><span class='title'>个人能力:</span><textarea cols='21' rows='6' ></textarea></div>
            `;
            editorEn.innerHTML = `
              <div class='line'><h3>English</h3></div>
              <div class='line'><span class='title'>About:</span><textarea cols='21' rows='6' ></textarea></div>
              <div class='line'><span class='title'>Skills:</span><textarea cols='21' rows='6' ></textarea></div>
            `;
            const
              infoCh = editorCh.querySelectorAll('textarea'),
              infoEn = editorEn.querySelectorAll('textarea');

            infoCh[0].value = text_ch.resume.about.join('\n\n');
            infoCh[1].value = text_ch.resume.skill.join(', ');
            infoEn[0].value = text_en.resume.about.join('\n\n');
            infoEn[1].value = text_en.resume.skill.join(', ');

            commit = () => {
              const aboutCh = infoCh[0].value.trim().split('\n').filter((skill) => !!skill);
              const skillCh = infoCh[1].value.trim().split(',').map((info) => info.trim()).filter((info) => !!info);
              const aboutEn = infoEn[0].value.trim().split('\n').filter((skill) => !!skill);
              const skillEn = infoEn[1].value.trim().split(',').map((info) => info.trim()).filter((info) => !!info);

              if (aboutCh?.length && skillCh?.length && aboutEn?.length && skillEn?.length) {
                text_ch.resume.about = aboutCh;
                text_ch.resume.skill = skillCh;
                text_en.resume.about = aboutEn;
                text_en.resume.skill = skillEn;
                return true;
              }
              return false;
            };
            break;
          }
          case SECTION.CONTACT: {
            showEditor();
            editorCh.innerHTML = `
              <div class='line'><h3>中文</h3></div>
              <div class='line'><span class='title'>电话:</span><input type='text' ></div>
              <div class='line'><span class='title'>邮箱:</span><input type='text' ></div>
              <div class='line'><span class='title'>微信:</span><input type='text' ></div>
              <div class='line'><span class='title'>住址:</span><input type='text' ></div>
              <div class='line'><span class='title'>Github:</span><input type='text' ></div>
            `;
            editorEn.innerHTML = `
              <div class='line'><h3>English</h3></div>
              <div class='line'><span class='title'>Phone:</span><input type='text' ></div>
              <div class='line'><span class='title'>Email:</span><input type='text' ></div>
              <div class='line'><span class='title'>WeChat:</span><input type='text' ></div>
              <div class='line'><span class='title'>Address:</span><input type='text' ></div>
              <div class='line'><span class='title'>Github:</span><input type='text' ></div>
            `;

            const
              contactCh = editorCh.querySelectorAll('input'),
              contactEn = editorEn.querySelectorAll('input');
            
            contactCh[0].value = text_ch.resume.contact.phone;
            contactCh[1].value = text_ch.resume.contact.email;
            contactCh[2].value = text_ch.resume.contact.wechat;
            contactCh[3].value = text_ch.resume.contact.location;
            contactCh[4].value = text_ch.resume.contact.github;
            contactEn[0].value = text_en.resume.contact.phone;
            contactEn[1].value = text_en.resume.contact.email;
            contactEn[2].value = text_en.resume.contact.wechat;
            contactEn[3].value = text_en.resume.contact.location;
            contactEn[4].value = text_en.resume.contact.github;

            commit = () => {
              const infoCh = Array.from(contactCh).map((contact) => contact.value.trim()).filter((contact) => !!contact);
              const infoEn = Array.from(contactEn).map((contact) => contact.value.trim()).filter((contact) => !!contact);

              if (infoCh.length === 5 && infoEn.length === 5) {
                text_ch.resume.contact.phone = infoCh[0];
                text_ch.resume.contact.email = infoCh[1];
                text_ch.resume.contact.wechat = infoCh[2];
                text_ch.resume.contact.location = infoCh[3];
                text_ch.resume.contact.github = infoCh[4];
                text_en.resume.contact.phone = infoEn[0];
                text_en.resume.contact.email = infoEn[1];
                text_en.resume.contact.wechat = infoEn[2];
                text_en.resume.contact.location = infoEn[3];
                text_en.resume.contact.github = infoEn[4];

                return true;
              }
              return false;
            };
            break;
          }
          case SECTION.INTERESTS: {
            showEditor();
            editorCh.innerHTML = `
              <div class='line'><h3>中文</h3></div>
              <div class='line'><span class='title'>一:</span><input style='width: 360px' type='text' ></div>
              <div class='line'><span class='title'>二:</span><input style='width: 360px' type='text' ></div>
              <div class='line'><span class='title'>三:</span><input style='width: 360px' type='text' ></div>
              <div class='line'><span class='title'>四:</span><input style='width: 360px' type='text' ></div>
              <div class='line'><span class='title'>五:</span><input style='width: 360px' type='text' ></div>
              <div class='line'><span class='title'>六:</span><input style='width: 360px' type='text' ></div>
            `;

            const interests = editorCh.querySelectorAll('input');

            interests.forEach((interest, i) => {
              interest.value = text_ch.resume.interests[i];
            });

            commit = () => {
              const links = Array.from(interests).map((interest) => interest.value.trim()).filter((interest) => !!interest);

              if (links.length === 6) {
                text_ch.resume.interests = links;
                text_en.resume.interests = links;
                return true;
              }
              return false;
            }
            break;
          }
          default: 
            break;
        }
      };
    
      ok.onclick = () => {
        clearTimeout(this.timer);
        if (!commit()) {
          return;
        }
        
        this.content.innerHTML = this.getResumeContent();
        commit = null;
        panel.classList.remove('show');
        setTimeout(() => {
          panel.style.display = 'none';
        }, 200);
      };
  
      cancel.onclick = () => {
        clearTimeout(this.timer);
        commit = null;
        panel.classList.remove('show');
        setTimeout(() => {
          panel.style.display = 'none';
        }, 200);
      };

      revert.onclick = () => {
        const copy: IResume = JSON.parse(JSON.stringify(this.origin_data));
        this.locale.ch.resume = copy.ch;
        this.locale.en.resume = copy.en;
        content.innerHTML = this.getResumeContent();
      };
    }

    language.onclick = () => {
      if (this.loading) return;
      this.lan = this.lan === LANGUAGE.CH ? LANGUAGE.EN : LANGUAGE.CH;
      const text = this.locale[this.lan];
      language.innerHTML = text.lan;
      save.innerHTML = text.save;
      close.innerHTML = text.close;
      if (ok) ok.innerHTML = text.ok;
      if (cancel) cancel.innerHTML = text.cancel;
      if (revert) revert.innerHTML = text.revert;
      content.innerHTML = this.getResumeContent();
      this.resize();
    };

    save.onclick = () => {
      if (this.loading) return;

      if (this.mode === MODE.EDIT) {
        return;
      }

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

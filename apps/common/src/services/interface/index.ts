export interface IResponse<T> {
  success: boolean;
  data: T;
  errorCode: number;
  errorMessage: string;
}

export interface IResumeLan {
  name: string;
  title: string;
  web: string;
  about: string[];
  skill: string[],
  contact: {
    phone: string;
    email: string;
    wechat: string;
    location: string;
    github: string;
  },
  interests: string[];
  education: {
    major: string;
    time: string;
    school: string;
  }[],
  experience: {
    title: string;
    time: string;
    company: string;
    disc: string[];
  }[];
  techSkill: {
    skill: string[];
    familiar: string[];
  };
}

export interface IResume {
  ch: IResumeLan,
  en: IResumeLan;
}

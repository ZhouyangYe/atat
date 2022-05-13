import { get } from '@/ajax';
import { IResponse } from '../interface';

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

export const getResumeData = (): Promise<IResponse<IResume>> => {
  return get<IResponse<IResume>>('/api/intro/resume');
};

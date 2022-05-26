import { get } from '@/ajax';
import { IResponse } from '../interface';

export interface IArticle {
  picture: {
    link: string;
    ratio: number;
  };
  desc: string;
  id: string;
}

export const getArticles = (): Promise<IResponse<IArticle[]>> => {
  return get<IResponse<IArticle[]>>('/api/stories/articles');
};

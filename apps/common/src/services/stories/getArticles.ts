import { get } from '@/ajax';
import { IResponse } from '../interface';

export interface IArticle {
  id: string;
  title: string;
  desc: string;
  thumbnail: string;
}

export const getArticles = (): Promise<IResponse<IArticle[]>> => {
  return get<IResponse<IArticle[]>>('/api/stories/articles');
};

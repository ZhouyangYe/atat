import { get } from '@/ajax';
import { IResponse } from '../interface';

export interface IAlbum {
  picture: {
    link: string;
    ratio: number;
  };
  desc: string;
  id: string;
}

export const getAlbum = (): Promise<IResponse<IAlbum[]>> => {
  return get<IResponse<IAlbum[]>>('/api/stories/album');
};

import { get } from '@/ajax';
import { IResponse } from '../interface';

export type IIntroInfoData = Array<string>;

export const getIntroInfo = (): Promise<IResponse<IIntroInfoData>> => {
  return get<IResponse<IIntroInfoData>>('/api/intro/info');
};

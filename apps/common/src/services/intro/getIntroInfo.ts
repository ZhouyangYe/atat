import { get } from '@/ajax';
import { IResponse } from '../interface';

export interface IPicInfo {
  path: string;
  name: string;
  orders: number;
}

export interface IIntroInfoData {
  backgrounds: Array<IPicInfo>;
  profile: IPicInfo;
}

export const getIntroInfo = (): Promise<IResponse<IIntroInfoData>> => {
  return get<IResponse<IIntroInfoData>>('/api/intro/info');
};

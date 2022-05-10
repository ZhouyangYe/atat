import { post } from '@/ajax';
import { IResponse } from '../interface';

export interface Params {
  password: string;
}

export interface IPicInfo {
  path: string;
  name: string;
  orders: number;
}

export const login = (params: Params): Promise<IResponse<void>> => {
  return post<IResponse<void>>('/api/admin/login', { body: params });
};

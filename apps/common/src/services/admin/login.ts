import { post } from '@/ajax';
import { IResponse } from '../interface';

export interface Params {
  password: string;
}

export const login = (params: Params): Promise<IResponse<string>> => {
  return post<IResponse<string>>('/api/admin/login', { body: params });
};

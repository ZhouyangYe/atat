import { post } from '@/ajax';
import { IResponse } from '../interface';

export interface LoginParams {
  password: string;
}

export const login = (params?: LoginParams): Promise<IResponse<string>> => {
  return post<IResponse<string>>('/api/admin/login', { body: params });
};

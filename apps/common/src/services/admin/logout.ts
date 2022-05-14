import { post } from '@/ajax';
import { IResponse } from '../interface';

export const logout = (): Promise<IResponse<string>> => {
  return post<IResponse<string>>('/api/admin/logout');
};

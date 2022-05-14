import { post } from '@/ajax';
import { IResponse, IResume } from '../interface';

export interface ResumeParams {
  resume: IResume;
}

export const updateResume = (params?: ResumeParams): Promise<IResponse<void>> => {
  return post<IResponse<void>>('/api/admin/resume', { body: params });
};

import { get } from '@/ajax';
import { IResponse, IResume } from '../interface';

export const getResumeData = (): Promise<IResponse<IResume>> => {
  return get<IResponse<IResume>>('/api/intro/resume');
};

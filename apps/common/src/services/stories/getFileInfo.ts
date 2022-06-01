import { get } from '@/ajax';
import { IResponse } from '../interface';

export interface Params {
  path?: string;
}

export interface IFileInfo {
  isDir: boolean;
  files: string[];
  data: string;
}

export const getFileInfo = (params?: Params): Promise<IResponse<IFileInfo>> => {
  return get<IResponse<IFileInfo>>(`/api/file/${params?.path || ''}`);
};

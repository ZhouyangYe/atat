import { getFullUrl } from '@/utils';
import { REQUEST_TYPE } from './enum';

const ERROR_CODE = 900821;
const TIMEOUT = 10000;

const getMethod = (type: string) => {
  return <T>(url: string, params: { [key: string]: string | undefined } = {}): Promise<T> => {
    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
  
      xhr.timeout = TIMEOUT;
      xhr.responseType = 'json';
  
      if (type === REQUEST_TYPE.GET) {
        const urlWithQuery = new URL(getFullUrl(url));
        params && Object.keys(params).forEach(key => {
          if (params[key]) {
            urlWithQuery.searchParams.set(key, params[key]);
          }
        });
        xhr.open(REQUEST_TYPE.GET, urlWithQuery.toString());
      }
    
      xhr.send();
    
      xhr.onload = () => {
        if (xhr.status !== 200) {
          rej({
            errorCode: xhr.status,
            errorMessage: xhr.statusText,
          });
          return;
        }
        res(xhr.response);
      };
  
      xhr.onerror = () => {
        rej({
          errorCode: ERROR_CODE,
          errorMessage: 'Failed to connect to the server.',
        });
      };
    });
  };
};

export const get = getMethod(REQUEST_TYPE.GET);

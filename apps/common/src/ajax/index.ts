import { getFullUrl } from '@/utils';
import { REQUEST_TYPE } from './enum';

const ERROR_CODE = 900821;
const TIMEOUT = 10000;
const SUCCESS_CODE = 200;

export interface Options {
  params?: { [key: string]: string | undefined };
  body?: any;
}

const getMethod = (type: string) => {
  return <T>(url: string, options?: Options): Promise<T> => {
    const { params = {}, body } = options || {};
    return new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      let data: any = null;

      xhr.timeout = TIMEOUT;
      xhr.responseType = 'json';

      switch (type) {
        case REQUEST_TYPE.GET: {
          const urlWithQuery = new URL(getFullUrl(url));
          params && Object.keys(params).forEach(key => {
            if (params[key]) {
              urlWithQuery.searchParams.set(key, params[key]!);
            }
          });
          xhr.open(REQUEST_TYPE.GET, urlWithQuery.toString());
          break;
        }
        case REQUEST_TYPE.POST: {
          const urlWithQuery = new URL(getFullUrl(url));
          xhr.open(REQUEST_TYPE.POST, urlWithQuery.toString());
          if (body) {
            try {
              data = JSON.stringify(body);
            } catch (e) {
              rej({
                errorCode: ERROR_CODE,
                errorMessage: 'Invalid JSON format',
              });
              return;
            }
          }
          break;
        }
        default:
          break;
      }

      if (data != null) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
      }
      else {
        xhr.send();
      }

      xhr.onload = () => {
        if (xhr.status !== SUCCESS_CODE) {
          rej({
            sucess: false,
            errorCode: xhr.status,
            errorMessage: xhr.statusText,
          });
          return;
        }
        res(xhr.response);
      };

      xhr.onerror = () => {
        rej({
          success: false,
          errorCode: ERROR_CODE,
          errorMessage: 'Failed to connect to the server.',
        });
      };
    });
  };
};

export const get = getMethod(REQUEST_TYPE.GET);
export const post = getMethod(REQUEST_TYPE.POST);

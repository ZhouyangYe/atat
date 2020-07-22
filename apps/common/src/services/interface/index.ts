export interface IResponse<T> {
  success: boolean;
  data: T;
  errorCode: string;
  errorMessage: string;
}

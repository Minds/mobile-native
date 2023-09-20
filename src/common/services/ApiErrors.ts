import axios from 'axios';
export type FieldError = { field: string; message: string };

/**
 * Api Error
 */

export class ApiError extends Error {
  errId: string = '';
  status: number = 0;
  headers: any = null;
  errors?: FieldError[];
  errorId?: string;

  constructor(message: string, status: number, errors?: FieldError[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export class NetworkError extends Error {}

export class TwoFactorError extends Error {}

export const isApiError = function (err): err is ApiError {
  return err instanceof ApiError;
};

export const isNetworkError = function (err): err is NetworkError {
  return err instanceof NetworkError;
};

export const isApiForbidden = function (err) {
  return err.status === 403;
};

export const isAbort = error => {
  return axios.isCancel(error);
};

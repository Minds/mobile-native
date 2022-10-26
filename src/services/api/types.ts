import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';

export type ExtendedAxiosInstance = AxiosInstance & {
  refreshToken: () => Promise<string | undefined>;
  updateHeaders: (headers: Partial<AxiosRequestHeaders>) => void;
  getApiHeaders: () => AxiosRequestHeaders;
  stepUp: (username?: string, passcode?: string) => Promise<unknown>;
};

export type ConnectionConfig = AxiosRequestConfig & {
  apiKey?: string;
  autoRefreshToken?: boolean;
  stepUpAuthEnabled?: boolean;
  useIdempotency?: boolean;
  cancelOldRequest?: boolean;
  retryOnTimeout?: boolean;
  useResponseTime?: boolean;
  useEtag?: boolean;
  tokensPersist?: (tokens: RefreshTokenResponse) => Promise<unknown>;
  tokenRehydrate?: () => Promise<RefreshTokenResponse | undefined>;
};

export type AxiosErrorWithRetriableRequestConfig = AxiosError & {
  config: AxiosRequestConfig & ConfigMetaData;
};

export interface RefreshTokenResponse extends Record<string, unknown> {
  accessToken?: string;
  refreshToken?: string;
}

export interface FetchResult {
  status?: number;
  statusText?: string;
  data?: Partial<{ code?: string }>;
  headers: Record<string, string>;
  ok?: boolean;
  config: AxiosRequestConfig;
}

export interface EnhancedError extends Error {
  config: AxiosRequestConfig;
  code: string | number;
  response?: FetchResult;
  isAxiosError: true;
}

export type Resolve = (value: AxiosResponse) => void;

export type Reject = (reason: any) => void;

export interface AdapterOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string | number | boolean>;
}

export type AsyncResponse<T> = [T | undefined, ErrorResponse | undefined];

export type ErrorResponse = {
  code?: string | number;
  error?: string;
  message?: string;
  response?: FetchResult;
};

export type ConfigMetaData = {
  metadata?: Record<string, unknown>;
};

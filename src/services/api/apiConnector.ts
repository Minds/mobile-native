/* eslint-disable no-bitwise */
/* eslint-disable no-shadow */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { Cache, getHeaderCaseInsensitive } from './cache';
import {
  AsyncResponse,
  AxiosErrorWithRetriableRequestConfig,
  ConfigMetaData,
  ConnectionConfig,
  ErrorResponse,
  ExtendedAxiosInstance,
  RefreshTokenResponse,
} from './types';

const ACCESS_TOKEN_EXPIRED = 401;
const REFRESH_PATH = 'oauth2/refresh';

const DEFAULT_CONFIG = { timeout: 3000 };
const DEFAULT_HEADERS: AxiosRequestHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
const ApiConnector = (() => {
  const instances: Record<string, ExtendedAxiosInstance> = {};

  function createInstance(
    name: string,
    config: ConnectionConfig,
  ): ExtendedAxiosInstance {
    const {
      autoRefreshToken = true,
      useIdempotency = true,
      cancelOldRequest,
      retryOnTimeout = true,
      useResponseTime = false,
      useEtag = true,
      headers: inputHeaders,
      tokensPersist,
      tokenRehydrate,
      ...axiosConfig
    } = config;

    const { apiKey } = axiosConfig;

    const headers: AxiosRequestHeaders = {
      ...DEFAULT_HEADERS,
      // Add X-ApiKey header if it exists
      ...(apiKey ? { 'X-ApiKey': apiKey } : undefined),
      // Add any custom headers
      ...inputHeaders,
    };

    const currentExecutingRequests: Record<string, { cancel: () => void }> = {};
    const tokens: RefreshTokenResponse = {
      accessToken: undefined,
      refreshToken: undefined,
    };

    tokenRehydrate?.().then(
      (
        { accessToken, refreshToken } = {
          accessToken: undefined,
          refreshToken: undefined,
        },
      ) => {
        if (accessToken && refreshToken) {
          tokens.accessToken = accessToken;
          tokens.refreshToken = refreshToken;
        }
      },
    );

    /**
     * Create main instance. Can be an axios instance or a debugWebAxios instance with reactotron
     * support for web
     */
    const instance = axios.create({
      ...DEFAULT_CONFIG,
      ...axiosConfig,
    }) as ExtendedAxiosInstance;

    /**
     * Add Headers
     */
    instance.defaults.headers.common = headers;

    /**
     * Add Request Interceptors
     */
    instance.interceptors.request.use(authenticationInterceptor, undefined, {
      synchronous: true,
      runWhen: () => autoRefreshToken && !!tokens?.accessToken,
    });
    instance.interceptors.request.use(idempotencyInterceptor, undefined, {
      synchronous: true,
      runWhen: ({ method }: AxiosRequestConfig) =>
        useIdempotency && ['post', 'put', 'patch'].includes(method ?? ''),
    });
    instance.interceptors.request.use(cancelRequestInterceptor, undefined, {
      synchronous: true,
      runWhen: () => cancelOldRequest !== undefined,
    });
    instance.interceptors.request.use(
      (config: AxiosRequestConfig & ConfigMetaData) => {
        config.metadata = { ...config.metadata, startTime: +new Date() };
        return config;
      },
      undefined,
      {
        synchronous: true,
        runWhen: () => useResponseTime,
      },
    );

    instance.interceptors.request.use(etagRequestInterceptor, undefined, {
      synchronous: true,
      runWhen: ({ method }: AxiosRequestConfig) => useEtag && method === 'get',
    });

    /**
     * Add Response Interceptors
     */
    instance.interceptors.response.use(
      cancelResponseInterceptor,
      cancelErrorInterceptor,
      {
        runWhen: () => cancelOldRequest !== undefined,
      },
    );
    instance.interceptors.response.use(
      storeTokensInterceptor,
      refreshTokenInterceptor,
      {
        runWhen: () => autoRefreshToken,
      },
    );
    instance.interceptors.response.use(undefined, timeOutInterceptor, {
      runWhen: () => retryOnTimeout,
    });
    instance.interceptors.response.use(
      response => {
        if (useResponseTime) {
          updateResponseTime(response.config as ConfigMetaData);
        }
        return response;
      },
      error => {
        if (useResponseTime) {
          updateResponseTime(error.config);
        }
        return Promise.reject(error);
      },
      {
        runWhen: () => useResponseTime,
      },
    );
    instance.interceptors.response.use(
      etagResponseInterceptor,
      etagErrorInterceptor,
      {
        runWhen: ({ method }: AxiosRequestConfig) =>
          useEtag && method === 'get',
      },
    );

    /**
     * Private interceptor
     * Add Authorization header if accessToken was previously set by
     * storeTokensInterceptor
     */
    function authenticationInterceptor(
      requestConfig: AxiosRequestConfig,
    ): AxiosRequestConfig {
      if (
        autoRefreshToken &&
        requestConfig.headers &&
        !requestConfig.headers.Authorization
      ) {
        requestConfig.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return requestConfig;
    }

    /**
     * Private interceptor
     * Add Idempotency-Key to POST, PUT and PATCH methods
     */
    function idempotencyInterceptor(
      requestConfig: AxiosRequestConfig,
    ): AxiosRequestConfig {
      if (requestConfig.headers) {
        const { data, url } = requestConfig;
        requestConfig.headers['Idempotency-Key'] = idempotencyKeyFrom(
          data,
          url,
        );
      }
      return requestConfig;
    }

    /**
     * Private interceptor
     * Add cancelToken to request config to be able to cancel repeated
     * requests. If the url was already used and the cancelOldRequest flag is true,
     * the old request will be canceled and the new request will be performed, or
     * the new request will be canceled and the old will be preserved.
     */
    function cancelRequestInterceptor(
      requestConfig: AxiosRequestConfig,
    ): AxiosRequestConfig {
      const key = requestConfig?.url ?? '';
      if (currentExecutingRequests[key]) {
        const source = cancelOldRequest
          ? currentExecutingRequests[key]
          : axios.CancelToken.source();
        delete currentExecutingRequests[cancelOldRequest ? key : ''];
        source.cancel();
      }

      const source = axios.CancelToken.source();
      currentExecutingRequests[key] = source;
      return {
        ...requestConfig,
        cancelToken: source.token,
      };
    }

    /**
     * Private interceptor
     * Inspect every response and remove pending requests from
     * currentExecutingRequests object.
     * @param response: AxiosResponse<RefreshTokenResponse>
     */
    function cancelResponseInterceptor(
      response: AxiosResponse<RefreshTokenResponse>,
    ): AxiosResponse<RefreshTokenResponse> {
      if (cancelOldRequest !== undefined) {
        delete currentExecutingRequests[response.request?.responseURL];
      }
      return response;
    }

    /**
     * Private interceptor
     * If the request failed because it was canceled, the error will
     * be silently discarded. On any other error, it will remove pending
     * requests from currentExecutingRequests object.
     * @param error: AxiosErrorWithRetriableRequestConfig
     */
    function cancelErrorInterceptor(
      error: AxiosErrorWithRetriableRequestConfig,
    ) {
      if (cancelOldRequest !== undefined) {
        if (axios.isCancel(error)) {
          return Promise.resolve();
        }
        const {
          config: { url = '' },
        } = error;

        if (currentExecutingRequests[url]) {
          delete currentExecutingRequests[url];
        }
      }
      return Promise.reject(error);
    }

    /**
     * Private interceptor
     * Inspect every response for the accessToken, refreshToken pair
     * and store them if found
     * @param response: AxiosResponse<RefreshTokenResponse>
     */
    function storeTokensInterceptor(
      response: AxiosResponse<RefreshTokenResponse>,
    ): AxiosResponse<RefreshTokenResponse> {
      if (autoRefreshToken) {
        const { accessToken, refreshToken } = response?.data ?? {};

        if (accessToken) {
          tokens.accessToken = accessToken;
        }
        if (refreshToken) {
          tokens.refreshToken = refreshToken;
        }
        if (accessToken && refreshToken) {
          tokensPersist?.(tokens);
        }
      }
      return response;
    }

    /**
     * Private interceptor
     * If request failed with timeout or 504 timeout.
     * @param error: AxiosErrorWithRetriableRequestConfig
     */
    function timeOutInterceptor(error: AxiosErrorWithRetriableRequestConfig) {
      if (retryOnTimeout) {
        const { config, response, code, message } = error;
        const { status } = response ?? {};
        if (
          (code === 'ECONNABORTED' && message.match(/timeout/)) ||
          status === 504
        ) {
          const { timeout, ...request } = config;
          if ((timeout ?? 1e10) > 6e4) {
            return Promise.reject(error);
          }
          return instance.request({
            ...request,
            timeout: (timeout ?? 1e3) * 5,
          });
        }
      }
      return Promise.reject(error);
    }

    /**
     * Private interceptor
     * If request failed with status 401 accessToken expiration, refresh tokens.
     * @param error: AxiosErrorWithRetriableRequestConfig
     */
    function refreshTokenInterceptor(
      error: AxiosErrorWithRetriableRequestConfig,
    ) {
      const { response: { status, data = {} } = {}, config } = error;

      if (
        autoRefreshToken &&
        status === ACCESS_TOKEN_EXPIRED &&
        tokens.refreshToken
      ) {
        if (config.metadata?.didRetry) {
          return Promise.reject(data);
        }
        config.metadata = { ...config.metadata, didRetry: true };
        return refreshToken().then(accessToken => {
          config.headers
            ? (config.headers.Authorization = `Bearer ${accessToken}`)
            : null;
          return accessToken
            ? instance.request(config)
            : Promise.reject({ status: 403 });
        });
      }
      return Promise.reject(error);
    }

    /**
     * Private interceptor
     * On GET requests check if ETAG header is present and url in cache.
     * If found, add 'If-None-Match header to request config.
     * @param requestConfig: AxiosRequestConfig
     */
    function etagRequestInterceptor(requestConfig: AxiosRequestConfig) {
      if (requestConfig.method !== 'get') {
        return requestConfig;
      }

      const lastCachedResult = Cache.get(requestConfig.url ?? '');
      if (lastCachedResult) {
        requestConfig.headers = {
          ...requestConfig.headers,
          'If-None-Match': lastCachedResult.etag,
        };
      }
      return requestConfig;
    }
    /**
     * Private interceptor
     * Retrieve ETAG header from response and store it in cache along
     * with url and the response body.
     * @param response: AxiosResponse
     */
    function etagResponseInterceptor(response: AxiosResponse) {
      if (response.config.method !== 'get') {
        return response;
      }
      const responseETAG = getHeaderCaseInsensitive('etag', response.headers);
      if (responseETAG) {
        if (!response.config.url) {
          return null;
        }
        Cache.set(response.config.url, responseETAG, response.data);
      }
      return response;
    }
    /**
     * Private interceptor
     * If request failed with status 304 return the response from cache and 200 OK.
     * @param error: AxiosErrorWithRetriableRequestConfig
     */
    function etagErrorInterceptor(error: AxiosErrorWithRetriableRequestConfig) {
      if (error.response?.status === 304) {
        return Promise.reject(error);
      }
      const { url } = error.response?.config ?? {};
      const getCachedResult = url ? Cache.get(url) : undefined;

      if (!getCachedResult) {
        return Promise.reject(error);
      }

      const newResponse = error.response as AxiosResponse;
      newResponse.status = 200;
      newResponse.data = getCachedResult.value;

      return Promise.resolve(newResponse);
    }

    /**
     * Create a separate axions instance for auth refresh token
     */
    const refreshInstance: AxiosInstance = axios.create({
      ...DEFAULT_CONFIG,
      ...axiosConfig,
      headers,
    });

    /**
     * The refreshToken handler will be accessible from the instance
     * to be called when we need to force an Auth Token refresh.
     */
    async function refreshToken(): Promise<string | undefined> {
      const { refreshToken } = tokens;
      return refreshInstance
        .post<RefreshTokenResponse>(REFRESH_PATH, { refreshToken })
        .then(({ data }) => data)
        .then(({ accessToken, refreshToken }) => {
          tokens.accessToken = accessToken;
          tokens.refreshToken = refreshToken;
          return tokens.accessToken;
        })
        .catch(() => {
          tokens.accessToken = undefined;
          tokens.refreshToken = undefined;
          return undefined;
        })
        .finally(() => {
          tokensPersist?.(tokens);
        });
    }

    /**
     * The updateHeaders handler will allow the headers to be consistently
     * updated on both the instance and the refreshInstance.
     */
    function updateHeaders(headers: Partial<AxiosRequestHeaders>) {
      const instanceHeaders = {
        ...instance.defaults.headers.common,
        ...(headers as AxiosRequestHeaders),
      };
      Object.keys(instanceHeaders).forEach(
        key =>
          instanceHeaders[key] === undefined && delete instanceHeaders[key],
      );
      instance.defaults.headers.common = instanceHeaders;

      const refreshHeaders = {
        ...refreshInstance.defaults.headers.common,
        ...(headers as AxiosRequestHeaders),
      };
      Object.keys(refreshHeaders).forEach(
        key => refreshHeaders[key] === undefined && delete refreshHeaders[key],
      );
      refreshInstance.defaults.headers.common = refreshHeaders;
    }

    /**
     * Return the API headers with API key and authorization token,
     * if found
     */
    function getApiHeaders() {
      return {
        ...(apiKey ? { 'X-ApiKey': apiKey } : undefined),
        ...(tokens.accessToken
          ? { Authorization: `Bearer ${tokens.accessToken}` }
          : undefined),
      };
    }

    /**
     * Add the refreshToken, updateHeaders, getApiHeaders and stepUp handlers
     * to the instance and the instance to the ApiConnector on its name
     */
    instance.refreshToken = refreshToken;
    instance.updateHeaders = updateHeaders;
    instance.getApiHeaders = getApiHeaders;

    instances[name] = instance;
    return instance;
  }

  /**
   * Return an axios instance based on the `name`.
   * This is a singleton. If the instance do not exists for that name, it will be created
   * using the suplied config. If the instance existis and a config is supplied then
   * the instance will be recreated with the new config.
   * @param name the name of the connection instance.
   * @param config the config for that instance.
   */
  function getInstance(
    name = 'default',
    config?: ConnectionConfig,
  ): ExtendedAxiosInstance {
    return config ? createInstance(name, config) : instances[name];
  }

  return Object.freeze({
    getInstance,
  });
})();

export { ApiConnector };
export type { ConnectionConfig };

/**
 * Helper method to contain possible exceptions raised by Axios.
 * Example of usage:
 *    const [response, error] = to(ApiConnector.getInstance().get('/products'))
 * @param promise the axios request
 * @returns an array with possible response or error
 */
export async function to<T>(
  promise: Promise<AxiosResponse<T>>,
): Promise<AsyncResponse<T>> {
  try {
    const response = (await promise) as AxiosResponse<T>;
    return [response.data, undefined];
  } catch (error) {
    return [undefined, error as ErrorResponse];
  }
}

/**
 * Generate an idempotencyKey from the request URL and payload. The returned string
 * is a uuidv4 format.
 * Inspired from cyrb53, a very fast, high quality, 53-bit hash algorithm.
 * @param data request payload; string or object
 * @param url request URL, string, optional
 * @returns unique 32 bytes uuidv4 hash
 */
export function idempotencyKeyFrom(data: unknown, url?: string): string {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57,
    h3 = 0xfeadcabe,
    h4 = 0x93a5f713;

  const str =
    typeof data === 'string' ? data + url : JSON.stringify(data) + url;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ char, 2654435761);
    h2 = Math.imul(h2 ^ char, 1597334677);
    h3 = Math.imul(h3 ^ char, 5754853343);
    h4 = Math.imul(h4 ^ char, 3367900313);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  h3 =
    Math.imul(h3 ^ (h3 >>> 16), 1500450271) ^
    Math.imul(h4 ^ (h4 >>> 13), 9576890767);
  h4 =
    Math.imul(h4 ^ (h4 >>> 16), 1500450271) ^
    Math.imul(h3 ^ (h3 >>> 13), 9576890767);

  const hash =
    (h4 >>> 0).toString(16).padStart(8, '0') +
    (h3 >>> 0).toString(16).padStart(8, '0') +
    (h2 >>> 0).toString(16).padStart(8, '0') +
    (h1 >>> 0).toString(16).padStart(8, '0');

  return 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx'.replace(
    /[x]/g,
    (_, p) => hash[p % 32],
  );
}

function updateResponseTime(config: ConfigMetaData) {
  config.metadata = {
    ...config.metadata,
    duration: +new Date() - ((config.metadata?.startTime as number) ?? 0),
  };
}

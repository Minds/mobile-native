import { reaction } from 'mobx';
import { useAsObservableSource, useLocalStore } from 'mobx-react';
import { useEffect } from 'react';
import storageService from '../../common/services/storage.service';
import apiService, { isAbort } from '../services/api.service';
import sessionService from '../services/session.service';

const getCacheKey = (url: string, params: any) =>
  `persist:${sessionService.guid}:${url}${
    params ? `?${JSON.stringify(params)}` : ''
  }`;

export interface FetchOptions {
  updateState?: (newData: any, oldData: any) => any;
  params?: object;
  persist?: boolean;
  retry?: number;
  retryDelay?: number;
}

export interface FetchStore<T> {
  retryTimer: any;
  loading: boolean;
  result: T | null;
  error: any;
  setResult: (v: any) => void;
  clearRetryTimer: (boolean) => void;
  setLoading: (v: boolean) => void;
  setError: (v: any) => void;
  fetch: (object?) => Promise<any>;
  hydrate: (params: any) => Promise<any>;
}

export interface PostStore<T> extends FetchStore<T> {
  post: (object?) => Promise<any>;
}

const updateState = (newData, _) => newData;

type MethodType = 'get' | 'post' | 'put';

const createStore = ({
  url,
  options,
  method = 'get',
}: {
  url: string;
  options?: FetchOptions;
  method?: MethodType;
}) => ({
  retryTimer: <any>null,
  retryCount: 0,
  loading: false,
  result: null,
  error: null,
  clearRetryTimer(clearCount: boolean) {
    if (this.retryTimer !== undefined) {
      //@ts-ignore
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (clearCount) {
      this.retryCount = 0;
    }
  },
  async hydrate(params: any) {
    if (this.result) {
      return;
    }

    try {
      const data = await storageService.getItem(getCacheKey(url, params));
      this.result = JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  },
  persist(params: any) {
    return storageService.setItem(
      getCacheKey(url, params),
      JSON.stringify(this.result),
    );
  },
  setResult(v: any) {
    this.result = v;
  },
  setLoading(v: boolean) {
    this.loading = v;
  },
  setError(e) {
    this.error = e;
  },
  async fetch(data: object = {}, retry = false) {
    this.clearRetryTimer(!retry);
    const updateStateMethod = options?.updateState || updateState;
    this.setLoading(true);
    this.setError(null);
    try {
      //@ts-ignore
      const result = await apiService[method](url, data);
      const state = updateStateMethod(result, this.result);
      this.setResult(state);
      this.persist(state);
    } catch (err) {
      if (options?.retry !== undefined && !isAbort(err)) {
        this.setError(err);
        if (options.retry > 0 ? this.retryCount < options?.retry : true) {
          this.retryCount++;
          this.retryTimer = setTimeout(() => {
            this.fetch(data, true);
          }, options?.retryDelay || 3000);
        }
      }
    } finally {
      this.setLoading(false);
    }

    return this.result;
  },
});

/**
 * Fetch the api and return a stable StateStore with
 * loading state, result or error
 *
 * If the parameters changes it automatically cancel the previous call and fetch it again
 *
 * @param url string
 * @param options object
 */
export default function useApiFetch<T>(
  url: string,
  options: FetchOptions = {},
): FetchStore<T> {
  const store: FetchStore<T> = useLocalStore(createStore, {
    url,
    options,
  });
  const observableParams = useAsObservableSource(options.params || {});

  // if persist was true, hydrate on the first render
  useEffect(() => {
    if (options.persist) {
      store.hydrate(options.params);
    }
    return () => store.clearRetryTimer(true);
  });

  useEffect(
    () =>
      reaction(() => ({ ...observableParams }), store.fetch, {
        fireImmediately: true,
      }),
    [observableParams, store, url],
  );

  return store;
}

/**
 * The same hook as above but use to post data
 *
 * @param url string
 * @param method string
 */
export function useApiPost<T>(
  url: string,
  method: MethodType = 'post',
): PostStore<T> {
  const store: FetchStore<T> = useLocalStore(createStore, {
    url,
    method,
  });

  return {
    ...store,
    post: store.fetch,
  };
}

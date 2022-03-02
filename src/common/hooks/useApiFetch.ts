import { reaction } from 'mobx';
import { useAsObservableSource, useLocalStore } from 'mobx-react';
import { useEffect } from 'react';
import apiService, { isAbort } from '../services/api.service';
import { storages } from '../services/storage/storages.service';

const getCacheKey = (url: string, params: any) =>
  `useFetch:${url}${params ? `?${JSON.stringify(params)}` : ''}`;

export interface PostStore<T> extends FetchStore<T> {
  post: (object?) => Promise<any>;
}

type FetchResponseType = {
  status: string;
  'load-next': string | number;
};

type ApiFetchType = FetchResponseType;

const defaultMap = data => data;

/**
 * a function that merges the new state with the old state
 */
const mergeState = (dataField: string, map = defaultMap) => (
  newData: ApiFetchType,
  oldData: ApiFetchType,
) =>
  ({
    ...newData,
    [dataField]: [
      ...(oldData ? oldData[dataField] : []),
      ...map(newData && newData[dataField] ? newData[dataField] : []),
    ],
  } as ApiFetchType);

/**
 * a function that replaces the state with the new state
 */
const replaceState = (dataField: string, map = defaultMap) => (
  newData: any,
) => ({
  ...newData,
  [dataField]: [
    ...map(newData && newData[dataField] ? newData[dataField] : []),
  ],
});

type MethodType = 'get' | 'post' | 'put' | 'delete';

export interface FetchOptions {
  updateState?: (newData: any, oldData: any) => any;
  params?: object;
  persist?: boolean;
  retry?: number;
  retryDelay?: number;
  /**
   * skips auto-firing when params change
   */
  skip?: boolean;
  /**
   * the data field of the response that has all the items
   */
  dataField?: string;
  /**
   * how the data should be updated. Defaults to always returning new data
   */
  updateStrategy?: 'merge' | 'replace';
  /**
   * a function that maps the data field
   */
  map?: (data: any) => any;
}

export interface FetchStore<T> {
  retryTimer: any;
  loading: boolean;
  result: T | null | undefined;
  error: any;
  setResult: (v: any) => void;
  clearRetryTimer: (boolean) => void;
  setLoading: (v: boolean) => void;
  setError: (v: any) => void;
  fetch: (data?: any, retry?: any, options?: FetchOptions) => Promise<any>;
  /**
   * fetches and replaces the data with the given options or the options of the hook
   */
  refresh: (data?: any, retry?: any, options?: FetchOptions) => Promise<any>;
  /**
   * whether it's being refreshed
   */
  refreshing?: boolean;
}

const createStore = ({
  url,
  options: hookOptions,
  method = 'get',
}: {
  url: string;
  options?: FetchOptions;
  method?: MethodType;
}) => ({
  retryTimer: <any>null,
  retryCount: 0,
  loading: false,
  refreshing: false,
  result: <any>undefined,
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
  hydrate(params: any, updateState) {
    try {
      const data = storages.user?.getMap(getCacheKey(url, params));
      if (data) this.setResult(updateState(data, this.result));
    } catch (e) {
      console.error(e);
    }
  },
  persist(params: any) {
    return storages.user?.setMap(getCacheKey(url, params), this.result);
  },
  setResult(v: any) {
    this.result = v;
  },
  setLoading(v: boolean) {
    this.loading = v;
  },
  setRefreshing(v: boolean) {
    this.refreshing = v;
  },
  setError(e) {
    this.error = e;
  },
  async fetch(data?: object, retry = false, opts: FetchOptions = {}) {
    if (!data) {
      data = hookOptions?.params || {};
    }
    let {
      updateState,
      offsetField,
      dataField,
      updateStrategy,
      map,
      persist,
    } = Object.assign(
      {
        updateStrategy: 'replace',
        offsetField: 'load-next',
        dataField: 'entities',
      },
      hookOptions,
      opts,
    );
    this.clearRetryTimer(!retry);

    if (!updateState) {
      switch (updateStrategy) {
        case 'merge':
          updateState = mergeState(dataField, map);
          break;
        case 'replace':
        default:
          updateState = replaceState(dataField, map);
          break;
      }
    }

    if (persist) {
      this.hydrate(data, updateState);
    }

    this.setLoading(true);
    this.setError(null);
    try {
      const result = await apiService[method](
        url,
        data,
        method === 'get' ? this : undefined,
      );

      // hack to remove the offset if the result was empty
      if (dataField && result[dataField]?.length === 0) {
        delete result[offsetField];
      }

      const state = updateState(result, this.result);
      this.setResult(state);

      if (persist) {
        this.persist(data);
      }
    } catch (err) {
      this.setError(err);
      if (hookOptions?.retry !== undefined && !isAbort(err)) {
        if (
          hookOptions.retry > 0 ? this.retryCount < hookOptions?.retry : true
        ) {
          this.retryCount++;
          this.retryTimer = setTimeout(() => {
            this.fetch(data, true);
          }, hookOptions?.retryDelay || 3000);
        }
      }
      throw err;
    } finally {
      this.setLoading(false);
    }

    return this.result;
  },
  /**
   * the same as fetch with a 'replace' updateStrategy and handling of the state of refreshing
   */
  async refresh(data?: object, retry = false, opts: any = {}) {
    this.setRefreshing(true);
    await this.fetch(data, retry, {
      ...opts,
      updateStrategy: 'replace',
    });
    this.setRefreshing(false);
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

  useEffect(() => {
    return () => store.clearRetryTimer(true);
  }, [store]);

  useEffect(() => {
    if (!options.skip) {
      reaction(() => ({ ...observableParams }), store.fetch, {
        fireImmediately: true,
      });
    }
  }, [observableParams, store, url, options.skip]);

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

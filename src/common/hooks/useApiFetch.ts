import { useFocusEffect } from '@react-navigation/native';
import { IReactionDisposer, reaction } from 'mobx';
import { useAsObservableSource, useLocalStore } from 'mobx-react';
import { useCallback, useEffect } from 'react';
import apiService from '../services/api.service';
import { isAbort } from '../services/ApiErrors';
import { storages } from '../services/storage/storages.service';

const getCacheKey = (url: string, params: any) =>
  `useFetch:${url}${params ? `?${JSON.stringify(params)}` : ''}`;

export interface PostStore<T> extends FetchStore<T> {
  post: (object?) => Promise<any>;
}

type FetchResponseType =
  | {
      status: string;
      'load-next': string | number;
    }
  | Array<any>;

type ApiFetchType = FetchResponseType;

const defaultMap = data => data;

/**
 * a function that merges the new state with the old state
 */
const mergeState =
  (dataField: string, map = defaultMap) =>
  (newData: ApiFetchType, oldData: ApiFetchType) =>
    dataField
      ? ({
          ...newData,
          [dataField]: [
            ...(oldData ? oldData[dataField] : []),
            ...map(newData && newData[dataField] ? newData[dataField] : []),
          ],
        } as ApiFetchType)
      : [...(oldData ? (oldData as Array<any>) : []), ...map(newData || [])];

/**
 * a function that replaces the state with the new state
 */
const replaceState =
  (dataField: string, map = defaultMap) =>
  (newData: any) =>
    dataField
      ? {
          ...newData,
          [dataField]: [
            ...map(newData && newData[dataField] ? newData[dataField] : []),
          ],
        }
      : newData
      ? map(newData)
      : [];

type MethodType = 'get' | 'post' | 'put' | 'delete';

export interface FetchOptions<P = any> {
  updateState?: (newData: any, oldData: any) => any;
  params?: P;
  persist?: boolean;
  /**
   * fetch/refresh on focus
   */
  refreshOnFocus?: boolean;
  /**
   * Initial fetch on focus instead of on mount
   */
  loadOnFocus?: boolean;
  /**
   * avoid initial data preload
   */
  noPreload?: boolean;
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
  reactionDisposal: IReactionDisposer | null;
  loading: boolean;
  result: T | null | undefined;
  error: any;
  reaction: (observableParams: object) => void;
  disposeReaction: () => void;
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

const createStore = (storeOptions: {
  url: string;
  options?: FetchOptions;
  method: MethodType;
}) => ({
  retryTimer: <any>null,
  retryCount: 0,
  loading: false,
  refreshing: false,
  result: <any>undefined,
  error: null,
  reactionDisposal: <IReactionDisposer | null>null,
  reaction(observableParams: object) {
    // dispose previous action
    this.reactionDisposal?.();
    // add a reaction to param changes
    this.reactionDisposal = reaction(
      () => ({ ...observableParams }),
      params => {
        this.fetch(params);
      },
      {
        fireImmediately:
          !storeOptions.options?.loadOnFocus &&
          !storeOptions.options?.noPreload, // do not run initial load if we want to do it on focus
      },
    );
  },
  disposeReaction() {
    this.reactionDisposal?.();
  },
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
      const data = storages.user?.getMap(getCacheKey(storeOptions.url, params));
      if (data) {
        this.setResult(updateState(data, this.result));
      }
    } catch (e) {
      console.error(e);
    }
  },
  persist(params: any) {
    return storages.user?.setMap(
      getCacheKey(storeOptions.url, params),
      this.result,
    );
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
      data = storeOptions.options?.params || {};
    }
    let { updateState, offsetField, dataField, updateStrategy, map, persist } =
      Object.assign(
        {
          updateStrategy: 'replace',
          offsetField: 'load-next',
          dataField: 'entities',
        },
        storeOptions.options,
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
      const result = await apiService[storeOptions.method](
        storeOptions.url,
        data,
        storeOptions.method === 'get' ? this : undefined,
      );

      // hack to remove the offset if the result was empty
      if (result && dataField && result[dataField]?.length === 0) {
        delete result[offsetField];
      }

      const state = updateState(result, this.result);
      this.setResult(state);

      if (persist) {
        this.persist(data);
      }
    } catch (err) {
      this.setError(err);
      if (storeOptions.options?.retry !== undefined && !isAbort(err)) {
        if (
          storeOptions.options.retry > 0
            ? this.retryCount < storeOptions.options?.retry
            : true
        ) {
          this.retryCount++;
          this.retryTimer = setTimeout(() => {
            this.fetch(data, true);
          }, storeOptions.options?.retryDelay || 3000);
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
export default function useApiFetch<T, P = unknown>(
  url: string,
  options: FetchOptions<P> = {},
): FetchStore<T> {
  const store: FetchStore<T> = useLocalStore(createStore, {
    url,
    method: 'get',
    options,
  });
  const observableParams = useAsObservableSource(options.params || {});

  useFocusEffect(
    useCallback(() => {
      if (options.refreshOnFocus && !store.loading) {
        if (store.result) {
          store.refresh(observableParams);
        } else {
          store.fetch(observableParams);
        }
      } else if (!store.result && !store.loading && options.loadOnFocus) {
        store.fetch(observableParams);
      }
    }, [options.refreshOnFocus, options.loadOnFocus, store, observableParams]),
  );

  useEffect(() => {
    return () => store.clearRetryTimer(true);
  }, [store]);

  useEffect(() => {
    if (!options.skip) {
      store.reaction(observableParams);
    } else {
      store.disposeReaction();
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
export function useApiCall<T>(
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

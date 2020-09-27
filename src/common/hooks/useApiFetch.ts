import { reaction } from 'mobx';
import { useAsObservableSource, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import apiService from '../services/api.service';

const createStore = ({ url, method = 'get' }) => ({
  loading: false,
  result: null,
  error: null,
  setResult(v: any) {
    this.result = v;
  },
  setLoading(v: boolean) {
    this.loading = v;
  },
  setError(e) {
    this.error = e;
  },
  async fetch(data: object = {}) {
    this.setLoading(true);
    this.setError(null);
    try {
      const result = await apiService[method](url, data);
      this.setResult(result);
    } catch (err) {
      console.log(err);
      this.setError(err);
    } finally {
      this.setLoading(false);
    }

    return this.result;
  },
  async fetchMore(data = {}, updateState) {
    this.setLoading(true);
    this.setError(null);
    try {
      const result = await apiService.get(url, data);
      this.setResult(updateState(result, this.result));
    } catch (err) {
      console.log(err);
      this.setError(err);
    } finally {
      this.setLoading(false);
    }

    return this.result;
  },
});

export interface FetchStore<T> {
  loading: boolean;
  result: T | null;
  error: any;
  setResult: (v: any) => void;
  setLoading: (v: boolean) => void;
  setError: (v: any) => void;
  fetch: (object?) => Promise<any>;
  fetchMore: (
    data: any,
    updateState: (newData: any, oldData: any) => any,
  ) => Promise<any>;
}

export interface PostStore<T> extends FetchStore<T> {
  post: (object?) => Promise<any>;
}

/**
 * Fetch the api and return a stable StateStore with
 * loading state, result or error
 *
 * If the parameters changes it automatically cancel the previous call and fetch it again
 *
 * @param url string
 * @param params object
 * @param reactToParams boolean
 */
export default function useApiFetch<T>(
  url: string,
  params: object = {},
  reactToParams: boolean = true,
): FetchStore<T> {
  const store: FetchStore<T> = useLocalStore(createStore, { url });
  const observableParams = useAsObservableSource(params);

  useEffect(() => {
    if (!reactToParams) {
      store.fetch(params);
    }
  }, []);

  React.useEffect(() => {
    if (reactToParams) {
      reaction(() => ({ ...observableParams }), store.fetch, {
        fireImmediately: true,
      });
    }
  }, [reactToParams, observableParams, store, url]);

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
  method: string = 'post',
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

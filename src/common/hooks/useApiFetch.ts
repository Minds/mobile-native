import { reaction } from 'mobx';
import { useAsObservableSource, useLocalStore } from 'mobx-react';
import React from 'react';
import apiService from '../services/api.service';

const createStore = ({
  url,
  updateState = (newData, _) => newData,
  method = 'get',
}) => ({
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
      console.log('result', result);
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
 * @param updateState function
 */
export default function useApiFetch<T>(
  url: string,
  params: object = {},
  updateState,
): FetchStore<T> {
  const store: FetchStore<T> = useLocalStore(createStore, { url, updateState });
  const observableParams = useAsObservableSource(params);

  React.useEffect(() => {
    reaction(() => ({ ...observableParams }), store.fetch, {
      fireImmediately: true,
    });
  }, [observableParams, store, url]);

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

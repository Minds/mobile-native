import React from 'react';
import { useLocalStore, useAsObservableSource } from 'mobx-react';
import apiService from '../services/api.service';
import { reaction } from 'mobx';

const createStore = ({ url }) => ({
  loading: true,
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
  async fetch(params: object) {
    this.setLoading(true);
    this.setError(null);
    try {
      const result = await apiService.get(url, params, this);
      this.setResult(result);
    } catch (err) {
      console.log(err);
      this.setError(err);
    } finally {
      this.setLoading(false);
    }
  },
});

export interface StateStore<T> {
  loading: boolean;
  result: T | null;
  error: any;
  setResult: (v: any) => void;
  setLoading: (v: boolean) => void;
  setError: (v: any) => void;
  fetch: (object) => Promise<void>;
}

/**
 * Fetch the api and return a stable StateStore with
 * loading state, result or error
 *
 * If the parameters changes it automatically cancel the previous call and fetch it again
 *
 * @param url string
 * @param params object
 */
export default function useApiFetch<T>(
  url: string,
  params: object = {},
): StateStore<T> {
  const store: StateStore<T> = useLocalStore(createStore, { url });
  const observableParams = useAsObservableSource(params);

  React.useEffect(() => {
    reaction(() => ({ ...observableParams }), store.fetch, {
      fireImmediately: true,
    });
  }, [observableParams, store, url]);

  return store;
}

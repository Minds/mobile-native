import React, { useEffect } from 'react';
import { useLocalStore, useAsObservableSource } from 'mobx-react';
import apiService from '../services/api.service';
import { reaction } from 'mobx';
import storageService from '../../common/services/storage.service';

const getCacheKey = (url: string, params: any) =>
  `@minds:persist:${url}${params ? `?${JSON.stringify(params)}` : ''}`;

const createStore = ({ url }) => ({
  loading: true,
  result: null,
  error: null,
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
  async fetch(params: object) {
    this.setLoading(true);
    this.setError(null);
    try {
      const result = await apiService.get(url, params, this);
      this.setResult(result);
      this.persist(params);
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
  hydrate: (params: any) => Promise<any>;
}

/**
 * Fetch the api and return a stable StateStore with
 * loading state, result or error
 *
 * If the parameters changes it automatically cancel the previous call and fetch it again
 *
 * @param url string
 * @param params object
 * @param persist boolean
 */
export default function useApiFetch<T>(
  url: string,
  params: object = {},
  persist: boolean = false,
): StateStore<T> {
  const store: StateStore<T> = useLocalStore(createStore, { url, persist });

  useEffect(() => {
    if (persist) {
      store.hydrate(params);
    }
  }, []);

  const observableParams = useAsObservableSource(params);

  React.useEffect(() => {
    reaction(() => ({ ...observableParams }), store.fetch, {
      fireImmediately: true,
    });
  }, [observableParams, store, url]);

  return store;
}

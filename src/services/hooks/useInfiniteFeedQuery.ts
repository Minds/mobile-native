import { useRef, useMemo } from 'react';
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import apiService from '~/common/services/api.service';

export type PageResponse<T> = {
  rows: T[];
  nextPage: string;
};

export function useInfiniteFeedQuery<
  T = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<PageResponse<T>, TQueryKey>,
  options?: Omit<
    UseInfiniteQueryOptions<
      PageResponse<T>,
      TError,
      PageResponse<T>,
      PageResponse<T>,
      TQueryKey
    >,
    'queryKey' | 'queryFn'
  >,
): [UseInfiniteQueryResult<PageResponse<T>, TError>, Array<T>] {
  const pageToken = useRef<string | undefined>('');

  const query = useInfiniteQuery(queryKey, queryFn, {
    getNextPageParam: () => {
      return pageToken.current;
    },
    onSuccess: data => {
      pageToken.current =
        data.pages[data.pages.length - 1].nextPage || undefined;
    },
    ...options,
  });

  // Why is react query not providing this?! So inefficient
  const flattenResult = useMemo(() => {
    return query.data?.pages.flatMap(page => page.rows) || [];
  }, [query.data]);

  return [query, flattenResult];
}

export async function fetchFeedPage<T>(
  endpoint: string,
  dataParameter: string,
  params: any,
  map?: (d: any) => T,
): Promise<PageResponse<T>> {
  const data = await apiService.get<any>(endpoint, params);

  return {
    nextPage: data['load-next'],
    rows:
      map && data?.[dataParameter]
        ? data[dataParameter].map(map)
        : data?.[dataParameter] || [],
  };
}

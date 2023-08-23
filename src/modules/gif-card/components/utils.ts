import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import moment from 'moment';

export const dateFormat = (val: number) =>
  moment(val * 1000).format('ddd, MMM do, YYYY');
export const timeFormat = (val: number) => moment(val * 1000).format('HH:mm');

type HookFunc = (
  pageParamKey: 'after',
  variables: any,
  options?: any,
) => UseInfiniteQueryResult<any>;
export const useInfiniteQuery = <TData>(
  infiniteHook: HookFunc,
  variables: any,
  dataArrayName: string,
) => {
  const pageParamKey = 'after';
  const infiniteResult = infiniteHook(pageParamKey, variables, {
    getNextPageParam: lastPage => {
      const { endCursor, hasNextPage } = lastPage[dataArrayName].pageInfo ?? {};
      return hasNextPage ? { [pageParamKey]: endCursor } : undefined;
    },
  });

  const data = (infiniteResult.data?.pages?.flatMap(
    page => page[dataArrayName].edges,
  ) || []) as TData[];
  const loadMore = () =>
    infiniteResult.hasNextPage ? infiniteResult.fetchNextPage() : undefined;
  return {
    data,
    isLoading: infiniteResult.isLoading,
    loadMore,
    fetchNextPage: infiniteResult.fetchNextPage,
    refetch: infiniteResult.refetch,
  };
};
export const useRefetchOnFocus = (refetch = () => {}) => {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
};

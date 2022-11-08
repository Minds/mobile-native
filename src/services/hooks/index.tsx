import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  QueryFunction,
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';

type RefreshOptions = {
  refreshOnFocus: boolean;
};

export function useQueryApi<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> &
    RefreshOptions,
): UseQueryResult<TData, TError> {
  const queryClient = useQueryClient();

  const { refreshOnFocus = false } = options ?? {};

  useFocusEffect(
    useCallback(() => {
      refreshOnFocus &&
        queryClient.invalidateQueries(
          Array.isArray(queryKey) ? queryKey[0] : queryKey,
        );
    }, [refreshOnFocus, queryClient, queryKey]),
  );

  return useQuery(queryKey, queryFn, options);
}

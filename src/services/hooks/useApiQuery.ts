import { QueryKey, QueryOptions, useQuery } from '@tanstack/react-query';
import serviceProvider from '../serviceProvider';

export default function useApiQuery<T>(
  queryKey: QueryKey,
  url: string,
  params?: any,
  method: 'get' | 'post' = 'get',
  options?: Omit<QueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => serviceProvider.api[method](url, params),
    ...options,
  });
}

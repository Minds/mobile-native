import { QueryKey, QueryOptions, useQuery } from '@tanstack/react-query';
import apiService from '~/common/services/api.service';

export default function useApiQuery<T>(
  queryKey: QueryKey,
  url: string,
  params?: any,
  method: 'get' | 'post' = 'get',
  options?: Omit<QueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => apiService[method](url, params),
    ...options,
  });
}

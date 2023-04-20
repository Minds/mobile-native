import { QueryKey, useQuery } from '@tanstack/react-query';
import apiService from '~/common/services/api.service';

export default function useApiQuery<T>(
  queryKey: QueryKey,
  url: string,
  params?: any,
  method: 'get' | 'post' = 'get',
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => apiService[method](url, params),
  });
}

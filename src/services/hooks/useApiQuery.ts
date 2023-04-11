import { QueryKey, useQuery } from '@tanstack/react-query';
import apiService from '~/common/services/api.service';

export default function useApiQuery(
  queryKey: QueryKey,
  url: string,
  params?: any,
  method: 'get' | 'post' = 'get',
) {
  return useQuery({
    queryKey,
    queryFn: () => apiService[method](url, params),
  });
}

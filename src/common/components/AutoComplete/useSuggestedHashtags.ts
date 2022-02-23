import useApiFetch, { FetchStore } from '~/common/hooks/useApiFetch';
import { useEffect } from 'react';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';

export default function useSuggestedHashtags(
  query,
  limit = 8,
): FetchStore<{ tags: string[]; status: string }> {
  const fetchStore: FetchStore<{
    tags: string[];
    status: string;
  }> = useApiFetch('api/v2/search/suggest/tags', {
    params: {
      limit,
      hydrate: 1,
    },
    persist: true,
    updateStrategy: 'replace',
    skip: true,
  });

  const debouncedFetch = useDebouncedCallback(
    q =>
      fetchStore.fetch({
        q,
      }),
    300,
    [],
  );

  useEffect(() => {
    if (!query) return;

    debouncedFetch(query);
  }, [debouncedFetch, query]);

  return fetchStore;
}

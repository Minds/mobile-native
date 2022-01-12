import UserModel from '~/channel/UserModel';
import useApiFetch, { FetchStore } from '~/common/hooks/useApiFetch';
import { useEffect } from 'react';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';

export default function useChannelSuggestion(
  query,
  limit = 8,
): FetchStore<{ entities: UserModel[]; status: string }> {
  const fetchStore: FetchStore<{
    entities: UserModel[];
    status: string;
  }> = useApiFetch('api/v2/search/suggest/user', {
    params: {
      limit,
      hydrate: 1,
    },
    persist: true,
    updateStrategy: 'replace',
    map: entities => UserModel.createMany(entities),
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
  }, [query]);

  return fetchStore;
}

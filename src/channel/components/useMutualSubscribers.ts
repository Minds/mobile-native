import useApiFetch from '~/common/hooks/useApiFetch';

interface MutualSubscribersResponse {
  count: number;
  entities: any[];
  users: any[];
}

export const useMutualSubscribers = (userGuid: string) => {
  const store = useApiFetch<MutualSubscribersResponse>(
    'api/v3/subscriptions/relational/also-subscribe-to',
    {
      params: {
        guid: userGuid,
      },
    },
  );

  return store;
};

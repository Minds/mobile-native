import { useGetChatRoomQuery } from '~/graphql/api';

export const useChatRoomInfoQuery = (roomGuid: string) => {
  const { data, isLoading, error, refetch } = useGetChatRoomQuery(
    {
      roomGuid,
      firstMembers: 3,
      afterMembers: 0,
    },
    {
      // retry: 3,
      staleTime: 0,
      cacheTime: 1000 * 60 * 60,
    },
  );

  return { data, isLoading, error, refetch };
};

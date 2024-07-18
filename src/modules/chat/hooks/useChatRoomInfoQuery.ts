import { useGetChatRoomQuery } from '~/graphql/api';

const MEMBERS_COUNT = 12;

export const useChatRoomInfoQuery = (roomGuid: string) => {
  const { data, isLoading, error, refetch, isRefetching } = useGetChatRoomQuery(
    {
      roomGuid,
      firstMembers: MEMBERS_COUNT,
      afterMembers: 0,
    },
    {
      // retry: 3,
      staleTime: 0,
      cacheTime: 1000 * 60 * 60,
      refetchOnWindowFocus: true,
    },
  );

  return { data, isLoading, error, refetch, isRefetching };
};

export const getChatRoomInfoKey = (roomGuid: string) =>
  useGetChatRoomQuery.getKey({
    roomGuid,
    firstMembers: MEMBERS_COUNT,
    afterMembers: 0,
  });

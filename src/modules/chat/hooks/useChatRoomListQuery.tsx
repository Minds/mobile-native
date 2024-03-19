import { useInfiniteGetChatRoomsListQuery } from '~/graphql/api';

export function useChatRoomListQuery() {
  const { data, isLoading, fetchNextPage, refetch, isRefetching } =
    useInfiniteGetChatRoomsListQuery(
      'first',
      {
        after: '',
        first: 12,
      },
      {
        getNextPageParam: lastPage => {
          const { endCursor, hasNextPage } =
            lastPage.chatRoomList.pageInfo ?? {};
          return hasNextPage
            ? {
                after: endCursor,
                first: 12,
              }
            : undefined;
        },
      },
    );

  const chats = data?.pages.flatMap(page => page.chatRoomList.edges) || [];
  return { chats, isLoading, fetchNextPage, refetch, isRefetching };
}

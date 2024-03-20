import { useInfiniteGetChatRoomInviteRequestsQuery } from '~/graphql/api';

export function useChatRequestListQuery() {
  const { data, isLoading, fetchNextPage, refetch, isRefetching } =
    useInfiniteGetChatRoomInviteRequestsQuery(
      'first',
      {
        after: '',
        first: 12,
      },
      {
        getNextPageParam: lastPage => {
          const { endCursor, hasNextPage } =
            lastPage.chatRoomInviteRequests.pageInfo ?? {};
          return hasNextPage
            ? {
                after: endCursor,
                first: 12,
              }
            : undefined;
        },
      },
    );

  const chats =
    data?.pages.flatMap(page => page.chatRoomInviteRequests.edges) || [];
  return { chats, isLoading, fetchNextPage, refetch, isRefetching };
}

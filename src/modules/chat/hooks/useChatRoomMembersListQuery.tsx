import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { showNotification } from 'AppMessages';
import { produce } from 'immer';
import logService from '~/common/services/log.service';
import {
  GetChatRoomQuery,
  useInfiniteGetChatRoomMembersQuery,
  useRemoveMemberFromChatRoomMutation,
} from '~/graphql/api';

export function useChatRoomMembersListQuery(roomGuid: string) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch, fetchNextPage, isRefetching } =
    useInfiniteGetChatRoomMembersQuery(
      'after',
      {
        roomGuid,
        first: 24,
        after: null,
      },
      {
        // retry: 3,
        staleTime: 0,
        cacheTime: 1000 * 60 * 10,

        getNextPageParam: lastPage => {
          const { hasNextPage, endCursor } =
            lastPage.chatRoomMembers.pageInfo ?? {};

          return hasNextPage
            ? {
                after: endCursor,
              }
            : undefined;
        },
      },
    );

  const removeMemberMutation = useRemoveMemberFromChatRoomMutation({
    onError: error => {
      showNotification(
        error instanceof Error ? error.message : 'Error removing member',
      );

      logService.exception('[useRemoveMemberFromChatRoomMutation]', error);
    },
    onSuccess: (data, context) => {
      showNotification('User removed');
      // we remove the member from the list
      queryClient.setQueryData<InfiniteData<GetChatRoomQuery>>(
        [
          'GetChatRoom.infinite',
          {
            roomGuid,
            firstMembers: 12,
            afterMembers: 0,
          },
        ],
        oldData => {
          if (oldData) {
            return produce(oldData, draft => {
              draft.pages.forEach(page => {
                const indexOf = page.chatRoom.members.edges.findIndex(
                  member => member.node.guid === context.memberGuid,
                );
                if (indexOf !== -1) {
                  page.chatRoom.members.edges.splice(indexOf, 1);
                }
                return page;
              });
            });
          } else {
            console.log('No data to update');
          }
          return oldData;
        },
      );
    },
  });

  const members = data?.pages.flatMap(page => page.chatRoomMembers.edges) || [];

  return {
    roomGuid,
    removeMemberMutation,
    members,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    isRefetching,
  };
}

export type ChatRoomMembersListQuery = ReturnType<
  typeof useChatRoomMembersListQuery
>;

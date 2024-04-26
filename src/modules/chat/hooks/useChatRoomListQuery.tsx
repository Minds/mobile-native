import {
  useGetChatRoomQuery,
  useInfiniteGetChatRoomsListQuery,
} from '~/graphql/api';
import { useAllChatRoomsEvent } from './useAllChatRoomsEvent';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import logService from '~/common/services/log.service';
import { produce } from 'immer';
import { useIncrementUnreadMessages } from './useUnreadMessages';

export function useChatRoomListQuery() {
  const queryClient = useQueryClient();
  const incrementUnreadMessages = useIncrementUnreadMessages();
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

  const chats = useMemo(
    () => data?.pages.flatMap(page => page.chatRoomList.edges) || [],
    [data],
  );

  useAllChatRoomsEvent(async (roomGuid, event) => {
    if (!data || event.type !== 'NEW_MESSAGE') return;
    let pageIndex = -1;
    let itemIndex = -1;

    incrementUnreadMessages(1);

    data.pages.forEach((page, index) => {
      const roomIndex = page.chatRoomList.edges.findIndex(
        c => c.node.guid === roomGuid,
      );
      if (roomIndex > -1) {
        pageIndex = index;
        itemIndex = roomIndex;
      }
    });
    if (itemIndex > -1) {
      const room = data.pages[pageIndex].chatRoomList.edges[itemIndex];
      const variables = {
        roomGuid: room.node.guid,
        firstMembers: 3,
        afterMembers: 0,
      };
      const key = useGetChatRoomQuery.getKey(variables);
      try {
        // fetch the updated room
        const newRoom = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => useGetChatRoomQuery.fetcher(variables)(),
        });

        // update the room in the list
        queryClient.setQueryData<any>(
          useInfiniteGetChatRoomsListQuery.getKey({
            after: '',
            first: 12,
          }),
          oldData => {
            if (oldData) {
              return produce(oldData, draft => {
                const current =
                  draft.pages[pageIndex].chatRoomList.edges[itemIndex];
                current.lastMessagePlainText =
                  newRoom.chatRoom.lastMessagePlainText;
                current.lastMessageCreatedTimestamp =
                  newRoom.chatRoom.lastMessageCreatedTimestamp;
                current.unreadMessagesCount =
                  newRoom.chatRoom.unreadMessagesCount + 1; //TODO: remove this workaround when the backend is fixed
              });
            }
          },
        );
      } catch (error) {
        logService.exception('[useChatRoomListQuery] fetching room', error);
      }
    }
  });

  return { chats, isLoading, fetchNextPage, refetch, isRefetching };
}

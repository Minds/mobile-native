import {
  GetChatRoomsListDocument,
  GetChatRoomsListQuery,
  GetChatRoomsListQueryVariables,
  useGetChatRoomQuery,
  useInfiniteGetChatRoomsListQuery,
} from '~/graphql/api';
import { useAllChatRoomsEvent } from './useAllChatRoomsEvent';
import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { ChatRoomEventType } from '../types';
import sp from '~/services/serviceProvider';
import { gqlFetcher } from '~/common/services/gqlFetcher';

export function useChatRoomListQuery() {
  const queryClient = useQueryClient();
  const { data, isLoading, fetchNextPage, refetch, isRefetching } =
    useInfiniteGetChatRoomsListQuery(
      'first',
      {
        after: '',
        first: 12,
      },
      {
        staleTime: 0,
        cacheTime: 1000 * 60 * 20,
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
    if (
      !data ||
      (event.type !== ChatRoomEventType.NewMessage &&
        event.type !== ChatRoomEventType.MessageDeleted)
    )
      return;
    let pageIndex = -1;
    let itemIndex = -1;

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
        firstMembers: 12,
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
                  event.type === ChatRoomEventType.NewMessage
                    ? newRoom.chatRoom.unreadMessagesCount + 1
                    : newRoom.chatRoom.unreadMessagesCount; //TODO: remove this workaround when the backend is fixed
              });
            }
          },
        );
      } catch (error) {
        sp.log.exception('[useChatRoomListQuery] fetching room', error);
      }
    }
  });

  return { chats, isLoading, fetchNextPage, refetch, isRefetching };
}

export function usePrefetchChatRoomList() {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchInfiniteQuery(
      useInfiniteGetChatRoomsListQuery.getKey({
        after: '',
        first: 12,
      }),
      async metaData =>
        gqlFetcher<GetChatRoomsListQuery, GetChatRoomsListQueryVariables>(
          GetChatRoomsListDocument,
          {
            after: '',
            first: 12,
            ...(metaData.pageParam ?? {}),
          },
        )(),
      {
        staleTime: 0,
        cacheTime: 1000 * 60 * 20,
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
  }, [queryClient]);
}

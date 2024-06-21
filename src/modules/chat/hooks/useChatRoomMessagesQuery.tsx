import React, { useCallback, useMemo, useRef } from 'react';
import { produce } from 'immer';
import {
  GetChatMessagesDocument,
  GetChatMessagesQuery,
  GetChatMessagesQueryVariables,
  useCreateChatMessageMutation,
  useDeleteChatMessageMutation,
} from '~/graphql/api';
import {
  InfiniteData,
  QueryClient,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import sessionService from '~/common/services/session.service';
import moment from 'moment';
import { ChatMessage, ChatRoomEventType } from '../types';
import delay from '~/common/helpers/delay';
import logService from '~/common/services/log.service';
import { showNotification } from 'AppMessages';
import { gqlFetcher } from '~/common/services/api.service';
import { useChatRoomEventByType } from './useChatRoomEventByType';

const PAGE_SIZE = 12;

export function useChatRoomMessagesQuery(roomGuid: string) {
  const queryClient = useQueryClient();
  const loadingMessagesPromise = useRef<Promise<any> | null>(null);
  const shouldLoadAgain = useRef<boolean>(false);
  const pendingMessages = useRef<ChatMessage[]>([]);
  const [render, forceRender] = React.useReducer(bool => !bool, false);

  // query key
  // TODO: use useInfiniteGetChatMessagesQuery.getKey
  const key = useMemo(
    () => [
      'GetChatMessages.infinite',
      {
        roomGuid,
        pageSize: PAGE_SIZE,
      },
    ],
    [roomGuid],
  );

  /**
   * Bidirectional infinite scroll query
   */
  const {
    fetchPreviousPage,
    fetchNextPage,
    refetch,
    isFetchingPreviousPage,
    data,
  } = useInfiniteGetChatMessagesQuery(
    'roomGuid',
    {
      roomGuid,
      pageSize: PAGE_SIZE,
    },
    {
      // Load older messages
      getNextPageParam: useCallback(lastPage => {
        // we load the previous page because the list is inverted
        const { startCursor, hasPreviousPage } =
          lastPage.chatMessages.pageInfo ?? {};
        return hasPreviousPage
          ? {
              before: startCursor,
              pageSize: PAGE_SIZE,
            }
          : undefined;
      }, []),

      // Load newer messages
      getPreviousPageParam: useCallback(firstPage => {
        const { endCursor, hasNextPage } =
          firstPage.chatMessages.pageInfo ?? {};
        return hasNextPage
          ? {
              after: endCursor,
              pageSize: PAGE_SIZE,
            }
          : undefined;
      }, []),
    },
  );

  /**
   * Load new messages
   * only one is allowed at a time
   */
  const loadNewMessages = useCallback(async () => {
    if (loadingMessagesPromise.current) {
      shouldLoadAgain.current = true;
      console.log('LOADING ALREADY');
      return loadingMessagesPromise.current;
    }
    console.log('LOADING NEW MESSAGES');
    loadingMessagesPromise.current = loadAllNewMessages({
      fetchPreviousPage,
      queryClient,
      key,
    });
    const result = await loadingMessagesPromise.current;
    console.log('LOADED', result);
    loadingMessagesPromise.current = null;
    if (shouldLoadAgain.current) {
      shouldLoadAgain.current = false;
      loadNewMessages();
    }
    return result;
  }, [fetchPreviousPage, queryClient, key]);

  /**
   * Create chat message mutation
   */
  const createMessageMutation = useCreateChatMessageMutation({
    onMutate: params => {
      const me = sessionService.getUser();
      const now = moment();
      const uuid = now.unix() + pendingMessages.current.length.toString();

      // new optimistic message
      const newMessage: ChatMessage = {
        cursor: '',
        node: {
          id: uuid,
          guid: uuid,
          plainText: params.plainText,
          timeCreatedISO8601: now.toISOString(),
          timeCreatedUnix: now.unix().toString(),
          sender: {
            id: `user-${me.guid}`,
            node: {
              id: `user-${me.guid}`,
              name: me.name,
              username: me.username,
              iconUrl: me.getAvatarSource().uri,
              guid: me.guid,
            },
          },
        },
      };

      pendingMessages.current = [newMessage, ...pendingMessages.current];

      // we force the render to update the list with the prepended pending messages
      forceRender();

      return { newMessage };
    },
    onError: (err, _, context) => {
      logService.exception('[useChatRoomMessagesQuery]', err);
      // we remove the optimistic message
      if (pendingMessages.current.length > 0 && context) {
        pendingMessages.current = pendingMessages.current.filter(
          message => message.node.id !== context.newMessage.node.id,
        );
      }
    },
    onSettled: async (data, err, _, context) => {
      if (err) {
        logService.exception('[useChatRoomMessagesQuery]', err);
        return;
      }
      await loadNewMessages();
      if (pendingMessages.current.length > 0 && context) {
        pendingMessages.current = pendingMessages.current.filter(
          message => message.node.id !== context.newMessage.node.id,
        );
      }
    },
  });

  const deleteMessageMutation = useDeleteChatMessageMutation({
    onError: error => {
      showNotification(
        error instanceof Error ? error.message : 'Error deleting message',
      );

      logService.exception('[useDeleteChatMessageMutation]', error);
    },
    onSuccess: (data, context) => {
      showNotification('Message deleted');
      if (data.deleteChatMessage) {
        removeChatMessage(context.messageGuid, key, queryClient);
      }
    },
  });

  /**
   * Messages list
   */
  const messages = useMemo(
    () => {
      return pendingMessages.current.concat(
        data?.pages.flatMap(
          (page: GetChatMessagesQuery & { _reversed?: boolean }) => {
            const edges = page.chatMessages.edges as ChatMessage[];

            if (!page._reversed) {
              edges.reverse();
              page._reversed = true;
            }
            return edges;
          },
        ) || [],
      );
    },
    // do not remove render from deps! It is used to force  re-render when new messages are added
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, render],
  );

  const onEvent = useCallback(
    event => {
      switch (event.type) {
        case ChatRoomEventType.NewMessage: {
          loadNewMessages();
          break;
        }
        case ChatRoomEventType.MessageDeleted: {
          if (!event['metadata']?.['messageGuid']) {
            console.warn(
              'No message guid found in event data for deleted event',
            );
            return;
          }
          // remove the message from the list and cache
          removeChatMessage(
            event['metadata']?.['messageGuid'],
            key,
            queryClient,
          );

          break;
        }
      }
    },
    // the mutation is not added since the reference to deleteMessageMutation is not stable, but deleteMessageMutation.mutate is
    [loadNewMessages, roomGuid],
  );

  // listen to events messages event
  useChatRoomEventByType(roomGuid, eventTypes, onEvent, true);

  return {
    fetchPreviousPage,
    fetchNextPage,
    refetch,
    isFetchingPreviousPage,
    messages,
    createMessageMutation,
    roomGuid,
    deleteMessage: (messageGuid: string) => {
      deleteMessageMutation.mutate({ messageGuid, roomGuid });
    },
    loadNewMessages,
    send: useCallback(
      plainText => {
        createMessageMutation.mutate({ plainText, roomGuid });
      },
      [createMessageMutation, roomGuid],
    ),
  };
}

/**
 * Loads all the new messages pages available
 */
async function loadAllNewMessages({
  fetchPreviousPage,
  queryClient,
  key,
}: {
  fetchPreviousPage: UseInfiniteQueryResult<
    GetChatMessagesQuery,
    unknown
  >['fetchPreviousPage'];
  queryClient: ReturnType<typeof useQueryClient>;
  key;
}) {
  let endReached = false;
  let attempts = 10;
  const data =
    queryClient.getQueryData<InfiniteData<GetChatMessagesQuery>>(key);
  // set hasNextPage to true so we can fetch
  queryClient.setQueryData<InfiniteData<GetChatMessagesQuery>>(key, oldData => {
    if (oldData) {
      oldData.pages[0].chatMessages.pageInfo.hasNextPage = true;
    }
    return oldData;
  });

  // iterate until we reach the end or we run out of attempts
  do {
    try {
      // await queryClient.cancelQueries({
      //   queryKey: key,
      // });
      const oldPageCount = data?.pages.length;
      const { data: newData } = await fetchPreviousPage();

      if (
        !newData?.pages[0].chatMessages.pageInfo.hasNextPage ||
        !newData?.pages[0].chatMessages.edges.length ||
        oldPageCount === newData?.pages.length
      ) {
        endReached = true;

        // if we receive an empty page, we remove it and mark the hasNextPage as false
        if (newData?.pages[0].chatMessages.edges.length === 0) {
          queryClient.setQueryData<any>(key, oldData => {
            if (oldData) {
              oldData.pages.shift();
              oldData.pageParams.shift();
              oldData.pages[0].chatMessages.pageInfo.hasNextPage = false;
            }
            return oldData;
          });
        }
      }
    } catch (error) {
      console.log('error fetching new messages', error);
      attempts--;
      await delay(1000);
    }
  } while (!endReached || attempts === 0);

  // if all attempts failed, mark hasNextPage as false
  if (attempts === 0 && !endReached) {
    queryClient.setQueryData<any>(key, oldData => {
      if (oldData) {
        oldData.pages[0].chatMessages.pageInfo.hasNextPage = false;
      }
      return oldData;
    });
  }
}

// Custom hook that allows to cancel the query using signal (codegen doesn't support it)
export const useInfiniteGetChatMessagesQuery = <
  TData = GetChatMessagesQuery,
  TError = unknown,
>(
  pageParamKey: keyof GetChatMessagesQueryVariables,
  variables: GetChatMessagesQueryVariables,
  options?: UseInfiniteQueryOptions<GetChatMessagesQuery, TError, TData>,
) => {
  return useInfiniteQuery<GetChatMessagesQuery, TError, TData>(
    ['GetChatMessages.infinite', variables],
    metaData =>
      gqlFetcher<GetChatMessagesQuery, GetChatMessagesQueryVariables>(
        GetChatMessagesDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
        undefined,
        metaData.signal,
      )(),
    options,
  );
};

const eventTypes = [
  ChatRoomEventType.NewMessage,
  ChatRoomEventType.MessageDeleted,
];

const removeChatMessage = (
  messageGuid: string,
  key,
  queryClient: QueryClient,
) => {
  // we remove the message from the list
  queryClient.setQueryData<InfiniteData<GetChatMessagesQuery>>(key, oldData => {
    if (oldData) {
      // keep an eye on performance, we might need to use a different approach
      // generating an entirely new list when deleting a new message may be expensive for large chats
      return produce(oldData, draft => {
        draft.pages.forEach(page => {
          const indexOf = page.chatMessages.edges.findIndex(
            message => message.node.guid === messageGuid,
          );
          if (indexOf !== -1) {
            page.chatMessages.edges.splice(indexOf, 1);
          }
          return page;
        });
      });
    }
    return oldData;
  });
};

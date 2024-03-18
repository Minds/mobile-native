import React, { useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  GetChatMessagesQuery,
  useCreateChatMessageMutation,
  useInfiniteGetChatMessagesQuery,
} from '~/graphql/api';
import { UseInfiniteQueryResult, useQueryClient } from '@tanstack/react-query';
import sessionService from '~/common/services/session.service';
import moment from 'moment';
import { ChatMessage } from '../types';
import delay from '~/common/helpers/delay';

const PAGE_SIZE = 12;

export function useChatRoomMessagesQuery(roomGuid: string) {
  const queryClient = useQueryClient();
  const pendingMessages = useRef<ChatMessage[]>([]);
  const [render, forceRender] = React.useReducer(bool => !bool, false);

  // query key
  const key = [
    'GetChatMessages.infinite',
    {
      roomGuid,
      pageSize: PAGE_SIZE,
    },
  ];

  /**
   * Bidirectional infinite scroll query
   */
  const query = useInfiniteGetChatMessagesQuery(
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
   * Create chat message mutation
   */
  const createMessageMutation = useCreateChatMessageMutation({
    onMutate: async params => {
      const me = sessionService.getUser();
      const now = moment();

      // new optimistic message
      const newMessage: ChatMessage = {
        cursor: '',
        node: {
          id: uuidv4(),
          guid: '',
          plainText: '-> ' + params.plainText,
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

      // cancel any previous query
      await queryClient.cancelQueries({
        queryKey: key,
      });

      // set hasNextPage to true so we can fetch
      queryClient.setQueryData<any>(key, oldData => {
        if (oldData) {
          oldData.pages[0].chatMessages.pageInfo.hasNextPage = true;
        }
        return oldData;
      });

      // we force the render to update the list with the prepended pending messages
      forceRender();

      return { newMessage };
    },
    onError: (err, newTodo, context) => {
      console.log('onError', err, newTodo, context);
      // we remove the optimistic message
      if (pendingMessages.current.length > 0 && context) {
        pendingMessages.current = pendingMessages.current.filter(
          message => message.node.id !== context.newMessage.node.id,
        );
      }
    },
    onSettled: (data, err, _, context) => {
      // we remove the optimistic message
      query.fetchPreviousPage().finally(() => {
        if (pendingMessages.current.length > 0 && context) {
          pendingMessages.current = pendingMessages.current.filter(
            message => message.node.id !== context.newMessage.node.id,
          );
        }
      });
    },
  });

  const messages = useMemo(
    () =>
      pendingMessages.current.concat(
        query.data?.pages.flatMap(page => {
          const edges = page.chatMessages.edges as ChatMessage[] & {
            _reversed?: boolean;
          };
          if (!edges._reversed) {
            edges.reverse();
            edges._reversed = true;
          }
          return edges;
        }) || [],
      ),
    // do not remove render from deps! It is used to force  re-render when new messages are added
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data, render],
  );

  const loadNewMessages = useCallback(() => {
    loadAllNewMessages(query, queryClient, key);
  }, [query, queryClient]);

  return {
    query,
    messages,
    createMessageMutation,
    loadNewMessages,
    send: useCallback(
      plainText => {
        createMessageMutation.mutate({ plainText, roomGuid });
      },
      [createMessageMutation, roomGuid],
    ),
  };
}

async function loadAllNewMessages(
  query: UseInfiniteQueryResult<GetChatMessagesQuery, unknown>,
  queryClient: ReturnType<typeof useQueryClient>,
  key,
) {
  let endReached = false;
  let attempts = 10;
  // set hasNextPage to true so we can fetch
  queryClient.setQueryData<any>(key, oldData => {
    if (oldData) {
      oldData.pages[0].chatMessages.pageInfo.hasNextPage = true;
    }
    return oldData;
  });

  // iterate until we reach the end or we run out of attempts
  do {
    try {
      await queryClient.cancelQueries({
        queryKey: key,
      });
      const { data } = await query.fetchPreviousPage();
      if (!data?.pages[0].chatMessages.pageInfo.hasNextPage) {
        endReached = true;

        // if we receive an empty page, we remove it and mark the hasNextPage as false
        if (data?.pages[0].chatMessages.edges.length === 0) {
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
      attempts--;
      await delay(1000);
    }
  } while (!endReached || attempts === 0);
}

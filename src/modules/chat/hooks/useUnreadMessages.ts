import { InitChatQuery, useInitChatQuery } from '~/graphql/api';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useUnreadMessages = () => {
  const { data, refetch } = useInitChatQuery();
  return { count: data?.chatUnreadMessagesCount || 0, refetch };
};

export function refetchUnreadMessages(queryQlient: QueryClient) {
  queryQlient.refetchQueries(['InitChat']);
}

export function useRefetchUnreadMessages() {
  const queryQlient = useQueryClient();
  return useCallback(
    () => queryQlient.refetchQueries(['InitChat']),
    [queryQlient],
  );
}

export function useIncrementUnreadMessages() {
  const queryClient = useQueryClient();
  return useCallback(
    (count: number) => {
      queryClient.setQueryData<InitChatQuery>(['InitChat'], oldData => {
        if (oldData) {
          return {
            chatUnreadMessagesCount: oldData.chatUnreadMessagesCount + count,
          };
        }
      });
    },
    [queryClient],
  );
}

import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { showNotification } from 'AppMessages';

import {
  GetChatRoomQuery,
  useGetChatRoomQuery,
  useUpdateChatRoomNotificationSettingsMutation,
} from '~/graphql/api';
import logService from '~/common/services/log.service';

export function useChatNotificationMutation() {
  const queryClient = useQueryClient();
  // optimistic update useChatRoomInfoQuery
  const notificationMutation = useUpdateChatRoomNotificationSettingsMutation({
    onMutate: ({ roomGuid, notificationStatus }) => {
      const key = useGetChatRoomQuery.getKey({
        roomGuid,
        firstMembers: 3,
        afterMembers: 0,
      });
      queryClient.cancelQueries(key);
      const previousData = queryClient.getQueryData(key);
      queryClient.setQueryData<GetChatRoomQuery>(key, oldData => {
        return produce(oldData, draft => {
          if (!draft?.chatRoom) {
            return;
          }
          draft.chatRoom.node.chatRoomNotificationStatus = notificationStatus;
        });
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      logService.exception('[useChatNotificationMutation]', error);
      // rollback on error
      const key = useGetChatRoomQuery.getKey({
        roomGuid: variables.roomGuid,
        firstMembers: 3,
        afterMembers: 0,
      });
      queryClient.setQueryData(key, context?.previousData);
    },
    onSuccess: () => {
      showNotification('Notification settings updated', 'success');
    },
  });

  return notificationMutation;
}

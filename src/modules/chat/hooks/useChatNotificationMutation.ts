import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import { showNotification } from 'AppMessages';

import {
  GetChatRoomQuery,
  useUpdateChatRoomNotificationSettingsMutation,
} from '~/graphql/api';
import logService from '~/common/services/log.service';
import { getChatRoomInfoKey } from './useChatRoomInfoQuery';

export function useChatNotificationMutation() {
  const queryClient = useQueryClient();
  // optimistic update useChatRoomInfoQuery
  const notificationMutation = useUpdateChatRoomNotificationSettingsMutation({
    onMutate: ({ roomGuid, notificationStatus }) => {
      const key = getChatRoomInfoKey(roomGuid);
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
      const key = getChatRoomInfoKey(variables.roomGuid);
      queryClient.setQueryData(key, context?.previousData);
    },
    onSuccess: () => {
      showNotification('Notification settings updated', 'success');
    },
  });

  return notificationMutation;
}

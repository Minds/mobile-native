import { useCallback } from 'react';

import { showNotification } from 'AppMessages';
import i18nService from '~/common/services/i18n.service';
import logService from '~/common/services/log.service';
import { useDeleteGroupChatRoomsMutation } from '~/graphql/api';
import type GroupModel from '~/groups/GroupModel';

export function useDeleteGroupChatRoom(
  group: GroupModel,
  onDeleting?: () => void,
) {
  const mutation = useDeleteGroupChatRoomsMutation({
    onSuccess: () => {
      showNotification('Chat room deleted');
      group.setConversationDisabled(true);
      onDeleting && onDeleting();
    },
    onError: error => {
      logService.exception('Error deleting chat room', error);
      showNotification(i18nService.t('errorMessage'));
    },
  });

  const deleteChatRoom = useCallback(() => {
    mutation.mutate({
      groupGuid: group.guid,
    });
  }, [group.guid, mutation]);

  return {
    deleteChatRoom,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
  };
}

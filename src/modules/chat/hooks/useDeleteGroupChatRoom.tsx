import { useCallback } from 'react';

import { showNotification } from 'AppMessages';
import { useDeleteGroupChatRoomsMutation } from '~/graphql/api';
import type GroupModel from '~/groups/GroupModel';
import sp from '~/services/serviceProvider';

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
      sp.log.exception('Error deleting chat room', error);
      showNotification(sp.i18n.t('errorMessage'));
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

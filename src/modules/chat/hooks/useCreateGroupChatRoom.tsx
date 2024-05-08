import { StackActions, useNavigation } from '@react-navigation/native';
import { showNotification } from 'AppMessages';
import { useCallback } from 'react';
import i18nService from '~/common/services/i18n.service';
import logService from '~/common/services/log.service';
import { useCreateGroupChatRoomMutation } from '~/graphql/api';
import type GroupModel from '~/groups/GroupModel';

export function useCreateGroupChatRoom(group: GroupModel, replace = false) {
  const navigation = useNavigation<any>();
  const mutation = useCreateGroupChatRoomMutation({
    onSuccess: data => {
      group.setConversationDisabled(false);
      if (replace) {
        navigation.dispatch(
          StackActions.replace('ChatStack', {
            screen: 'Chat',
            params: {
              roomGuid: data.createGroupChatRoom.node.guid,
            },
          }),
        );
      } else {
        navigation.push('ChatStack', {
          screen: 'Chat',
          params: {
            roomGuid: data.createGroupChatRoom.node.guid,
          },
        });
      }
    },
    onError: error => {
      logService.exception('Error creating chat room', error);
      showNotification(i18nService.t('errorMessage'));
    },
  });

  const createChatRoom = useCallback(() => {
    mutation.mutate({
      groupGuid: group.guid,
    });
  }, [group.guid, mutation]);

  return {
    createChatRoom,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
  };
}

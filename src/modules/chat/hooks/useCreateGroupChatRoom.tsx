import { StackActions, useNavigation } from '@react-navigation/native';
import { showNotification } from 'AppMessages';
import { useCallback } from 'react';
import { useCreateGroupChatRoomMutation } from '~/graphql/api';
import type GroupModel from '~/groups/GroupModel';
import sp from '~/services/serviceProvider';

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
      sp.log.exception('Error creating chat room', error);
      showNotification(sp.i18n.t('errorMessage'));
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

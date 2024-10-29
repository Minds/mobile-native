import { StackActions, useNavigation } from '@react-navigation/native';
import { showNotification } from 'AppMessages';
import { useCallback } from 'react';
import { useCreateChatRoomMutation } from '~/graphql/api';
import sp from '~/services/serviceProvider';

export function useCreateChatRoom(replace = false) {
  const navigation = useNavigation<any>();
  const mutation = useCreateChatRoomMutation({
    onSuccess: data => {
      if (replace) {
        navigation.dispatch(
          StackActions.replace('ChatStack', {
            screen: 'Chat',
            params: {
              roomGuid: data.createChatRoom.node.guid,
            },
          }),
        );
      } else {
        navigation.push('ChatStack', {
          screen: 'Chat',
          params: {
            roomGuid: data.createChatRoom.node.guid,
          },
        });
      }
    },
    onError: error => {
      sp.log.exception('Error creating chat room', error);
      showNotification(sp.i18n.t('errorMessage'));
    },
  });

  const createChatRoom = useCallback(
    (guids: string[], groupGuid?: string) => {
      mutation.mutate({
        otherMemberGuids: guids,
        groupGuid,
      });
    },
    [mutation],
  );

  return {
    createChatRoom,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
  };
}

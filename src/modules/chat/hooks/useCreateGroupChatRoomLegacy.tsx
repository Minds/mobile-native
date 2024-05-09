import { StackActions, useNavigation } from '@react-navigation/native';
import { showNotification } from 'AppMessages';
import { useCallback } from 'react';
import i18nService from '~/common/services/i18n.service';
import logService from '~/common/services/log.service';
import { ChatRoomTypeEnum, useCreateChatRoomMutation } from '~/graphql/api';
import type GroupModel from '~/groups/GroupModel';

export function useCreateGroupChatRoomLegacy(
  group: GroupModel,
  replace = false,
) {
  const navigation = useNavigation<any>();
  const mutation = useCreateChatRoomMutation({
    onSuccess: data => {
      group.setConversationDisabled(false);
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
      logService.exception('Error creating chat room', error);
      showNotification(i18nService.t('errorMessage'));
    },
  });

  const createChatRoom = useCallback(() => {
    mutation.mutate({
      groupGuid: group.guid,
      roomType: ChatRoomTypeEnum.GroupOwned,
      otherMemberGuids: [],
    });
  }, [group.guid, mutation]);

  return {
    createChatRoom,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
  };
}

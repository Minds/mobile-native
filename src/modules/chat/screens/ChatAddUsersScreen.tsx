import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Screen, ScreenHeader } from '~/common/ui';
import { UserSearchAndSelect } from '../components/UserSearchAndSelect';
import { showNotification } from 'AppMessages';
import { ChatStackScreenProps } from '../ChatConversationStack';
import { useAddMembersToChatRoomMutation } from '~/graphql/api';
import { getChatRoomInfoKey } from '../hooks/useChatRoomInfoQuery';
import sp from '~/services/serviceProvider';

const RoomIdContext = React.createContext<string>('');

type PropsType = ChatStackScreenProps<'ChatAddUsers'>;

/**
 * Chat add users screen
 */
export default function ChatAddUsersScreen({
  route: { params },
  navigation,
}: PropsType) {
  const { roomGuid, ignore } = params || {};
  if (!roomGuid) {
    showNotification('Room id not provided');
    navigation.goBack();
  }
  return (
    <Screen safe>
      <ScreenHeader back={true} title="Add users" />
      <RoomIdContext.Provider value={roomGuid}>
        <UserSearchAndSelect
          ActionButton={AddButton}
          description="Try searching for people to add to the chat."
          ignore={ignore}
        />
      </RoomIdContext.Provider>
    </Screen>
  );
}

const AddButton = ({ selectedUsers }) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const roomGuid = React.useContext(RoomIdContext);

  const { mutate, isLoading } = useAddMembersToChatRoomMutation({
    onSuccess: () => {
      showNotification('Users added');

      // we invalidate the cache
      const key = getChatRoomInfoKey(roomGuid);
      queryClient.invalidateQueries(key);

      navigation.goBack();
    },
    onError: error => {
      sp.log.exception('Error adding users chat room', error);
      showNotification(
        error instanceof Error ? error.message : sp.i18n.t('errorMessage'),
      );
    },
  });

  const onPress = () => {
    mutate({ roomGuid, memberGuids: selectedUsers.map(u => u.guid) });
  };

  return (
    <Button
      type="action"
      mode="solid"
      align="stretch"
      loading={isLoading}
      onPress={onPress}
      disabled={selectedUsers.length === 0 || isLoading}>
      Add users
    </Button>
  );
};

import React from 'react';

import { Button, Screen, ScreenHeader } from '~/common/ui';
import { useCreateChatRoom } from '../hooks/useCreateChatRoom';
import { UserSearchAndSelect } from '../components/UserSearchAndSelect';

/**
 * Chat room creation screen
 */
export default function ChatNewScreen() {
  return (
    <Screen safe>
      <ScreenHeader back={true} title="New chat" />
      <UserSearchAndSelect
        ActionButton={CreateButton}
        description="Try searching for people to send a chat."
      />
    </Screen>
  );
}

const CreateButton = ({ selectedUsers }) => {
  const { createChatRoom, isLoading } = useCreateChatRoom(true);

  const onPress = () => {
    createChatRoom(selectedUsers.map(u => u.guid));
  };

  return (
    <Button
      type="action"
      mode="solid"
      align="stretch"
      loading={isLoading}
      onPress={onPress}
      disabled={selectedUsers.length === 0 || isLoading}>
      Create chat
    </Button>
  );
};

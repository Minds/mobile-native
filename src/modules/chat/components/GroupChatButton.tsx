import React from 'react';
import SmallCircleButton from '~/common/components/SmallCircleButton';
import type GroupModel from '~/groups/GroupModel';
import ThemedStyles from '~/styles/ThemedStyles';
import { useCreateGroupChatRoom } from '../hooks/useCreateGroupChatRoom';

export default function GroupChatButton({ group }: { group: GroupModel }) {
  const shouldDisplay = !group.conversationDisabled || group.isOwner();

  const { createChatRoom, isLoading } = useCreateGroupChatRoom(group);

  if (!shouldDisplay) {
    return null;
  }
  return (
    <SmallCircleButton
      name="message"
      testID="createChat"
      disabled={isLoading}
      type="material-community"
      raised={true}
      onPress={createChatRoom}
      color={ThemedStyles.getColor('PrimaryBackground')}
      iconStyle={style.icon}
      reverseColor={
        isLoading
          ? ThemedStyles.getColor('TertiaryText')
          : ThemedStyles.getColor('PrimaryText')
      }
    />
  );
}

const style = {
  icon: {
    fontSize: 20,
  },
};

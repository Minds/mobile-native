import React from 'react';
import SmallCircleButton from '~/common/components/SmallCircleButton';
import type GroupModel from '~/groups/GroupModel';

import { useCreateGroupChatRoom } from '../hooks/useCreateGroupChatRoom';
import { useCreateGroupChatRoomLegacy } from '../hooks/useCreateGroupChatRoomLegacy';
import { useIsFeatureOn } from 'ExperimentsProvider';
import sp from '~/services/serviceProvider';

export default function GroupChatButton({ group }: { group: GroupModel }) {
  const shouldDisplay = !group.conversationDisabled || group.isOwner();

  const featureEnabled = useIsFeatureOn('mobile-create-group-chat-new');

  const { createChatRoom, isLoading } = useCreateGroupChatRoom(group);
  const { createChatRoom: createChatRoomLegacy, isLoading: isLoadingLegacy } =
    useCreateGroupChatRoomLegacy(group);

  const createRoom = featureEnabled ? createChatRoom : createChatRoomLegacy;
  const isCreateLoading = featureEnabled ? isLoading : isLoadingLegacy;

  if (!shouldDisplay) {
    return null;
  }

  return (
    <SmallCircleButton
      name="message"
      testID="createChat"
      disabled={isCreateLoading}
      type="material-community"
      raised={true}
      onPress={createRoom}
      color={sp.styles.getColor('PrimaryBackground')}
      iconStyle={style.icon}
      reverseColor={
        isCreateLoading
          ? sp.styles.getColor('TertiaryText')
          : sp.styles.getColor('PrimaryText')
      }
    />
  );
}

const style = {
  icon: {
    fontSize: 20,
  },
};

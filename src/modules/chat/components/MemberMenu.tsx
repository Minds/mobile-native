import React from 'react';
import {
  BottomSheetMenuItem,
  pushBottomSheet,
} from '~/common/components/bottom-sheet';
import { ChatMember } from '../types';
import NavigationService from '~/navigation/NavigationService';
import { ChatRoomTypeEnum } from '~/graphql/api';
import { ChatRoomMembersContextType } from '../contexts/ChatRoomMembersContext';

export const showMemberMenu = (
  member: ChatMember,
  context: ChatRoomMembersContextType,
) => {
  const showRemove =
    (context.chatRoom?.node.roomType === ChatRoomTypeEnum.GroupOwned ||
      context.chatRoom?.node.roomType === ChatRoomTypeEnum.MultiUser) &&
    context.chatRoom?.node.isUserRoomOwner &&
    context.chatRoom?.totalMembers > 2;

  pushBottomSheet({
    safe: true,
    title: member.node.name,
    component: ref => (
      <>
        <BottomSheetMenuItem
          onPress={async () => {
            NavigationService.push('Channel', {
              guid: member.node.guid,
            });
            await ref.close();
          }}
          iconName="person"
          iconType="material"
          title="View Profile"
        />
        {showRemove && (
          <BottomSheetMenuItem
            onPress={async () => {
              context.removeMemberMutation.mutate({
                roomGuid: context.roomGuid,
                memberGuid: member.node.guid,
              });
              await ref.close();
            }}
            iconName="person-remove"
            iconType="material"
            title="Remove"
          />
        )}
      </>
    ),
  });
};

import React from 'react';
import {
  BottomSheetMenuItem,
  pushBottomSheet,
} from '~/common/components/bottom-sheet';
import { ChatMessage } from '../types';
import { ChatRoomMessagesContextType } from '../contexts/ChatRoomMessageContext';
import type { ChatRoomContextType } from '../contexts/ChatRoomContext';
import { ChatRoomTypeEnum } from '~/graphql/api';
import sp from '~/services/serviceProvider';

export const showMessageMenu = (
  message: ChatMessage,
  context: ChatRoomMessagesContextType,
  chatRoomContext: ChatRoomContextType,
) => {
  const chatRoom = chatRoomContext.data?.chatRoom.node;
  const showDelete =
    message.node.sender.node.guid === sp.session.getUser().guid ||
    (chatRoom?.isUserRoomOwner &&
      chatRoom?.roomType === ChatRoomTypeEnum.GroupOwned);
  const showReport =
    message.node.sender.node.guid !== sp.session.getUser().guid;
  pushBottomSheet({
    safe: true,
    title: 'Message Options',
    component: ref => (
      <>
        {showDelete && (
          <BottomSheetMenuItem
            onPress={async () => {
              context.deleteMessage(message.node.guid);
              await ref.close();
            }}
            iconName="delete"
            iconType="material-community"
            title="Delete"
          />
        )}
        {showReport && (
          <BottomSheetMenuItem
            onPress={async () => {
              sp.navigation.push('Report', {
                entity: message,
                title: 'Report Message',
              });
              await ref.close();
            }}
            iconName="flag-outline"
            iconType="ionicon"
            title="Report"
          />
        )}
      </>
    ),
  });
};

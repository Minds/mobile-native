import React from 'react';
import {
  BottomSheetMenuItem,
  pushBottomSheet,
} from '~/common/components/bottom-sheet';
import { ChatMessage } from '../types';
import sessionService from '~/common/services/session.service';
import { ChatRoomMessagesContextType } from '../contexts/ChatRoomMessageContext';
import NavigationService from '~/navigation/NavigationService';

export const showMessageMenu = (
  message: ChatMessage,
  context: ChatRoomMessagesContextType,
) => {
  pushBottomSheet({
    safe: true,
    title: 'Message Options',
    component: ref => (
      <>
        {message.node.sender.node.guid === sessionService.getUser().guid ? (
          <BottomSheetMenuItem
            onPress={async () => {
              context.deleteMessage(message.node.guid);
              await ref.close();
            }}
            iconName="delete"
            iconType="material-community"
            title="Delete"
          />
        ) : (
          <BottomSheetMenuItem
            onPress={async () => {
              NavigationService.push('Report', {
                entity: message,
                title: 'Report Message',
              });
              await ref.close();
            }}
            iconName="ios-flag-outline"
            iconType="ionicon"
            title="Report"
          />
        )}
      </>
    ),
  });
};

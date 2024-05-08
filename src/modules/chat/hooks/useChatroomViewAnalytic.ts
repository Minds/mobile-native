import { useEffect } from 'react';
import analyticsService from '~/common/services/analytics.service';
import { useChatRoomContext } from '../contexts/ChatRoomContext';

/**
 * Hook to track chat room view and set global properties for analytics
 */
export function useChatroomViewAnalytic() {
  const context = useChatRoomContext();
  useEffect(() => {
    const chatRoom = context.data?.chatRoom;
    if (!chatRoom) return;

    // set globals for analytics
    analyticsService.setGlobalProperty('chat_room_guid', chatRoom.node.guid);
    analyticsService.setGlobalProperty(
      'chat_room_type',
      chatRoom.node.roomType,
    );

    if (chatRoom.lastMessageCreatedTimestamp) {
      analyticsService.setGlobalProperty(
        'chat_last_message_created_timestamp',
        new Date(chatRoom.lastMessageCreatedTimestamp * 1000).toISOString(),
      );
    }

    // track view
    analyticsService.trackView('chat_room_view');

    return () => {
      analyticsService.unsetGlobalProperty('chat_room_guid');
      analyticsService.unsetGlobalProperty('chat_room_type');
      analyticsService.unsetGlobalProperty(
        'chat_last_message_created_timestamp',
      );
    };
  }, [context]);
}

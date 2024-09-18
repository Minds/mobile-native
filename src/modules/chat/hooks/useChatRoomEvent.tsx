import { useEffect } from 'react';

import { ChatRoomEvent } from '../service/chat-socket-service';
import sp from '~/services/serviceProvider';

/**
 * Subscribes to a room event and unsubscribes on unmount
 *
 * Important: the callback should be a stable reference to avoid re-subscription on each render
 */
export function useChatRoomEvent(
  roomGuid: string,
  callback: (data: ChatRoomEvent) => void,
) {
  useEffect(() => {
    sp.socket.chat?.on(roomGuid, callback);
    return () => {
      sp.socket.chat?.off(roomGuid, callback);
    };
  }, [roomGuid, callback]);
}

import { useEffect } from 'react';

import { ChatRoomEvent } from '../service/chat-socket-service';
import sp from '~/services/serviceProvider';

/**
 * Subscribes to a room event and unsubscribes on unmount
 *
 * Important: the callback should be a stable reference to avoid re-subscription on each render
 */
export function useAllChatRoomsEvent(
  callback: (roomGuid: string, data: ChatRoomEvent) => void,
) {
  useEffect(() => {
    sp.socket.chat?.onAny(callback);
    return () => {
      sp.socket.chat?.offAny(callback);
    };
  }, [callback]);
}

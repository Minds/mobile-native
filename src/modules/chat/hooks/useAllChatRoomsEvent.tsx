import { useEffect } from 'react';
import socketService from '~/common/services/socket.service';
import { ChatRoomEvent } from '../service/chat-socket-service';

/**
 * Subscribes to a room event and unsubscribes on unmount
 *
 * Important: the callback should be a stable reference to avoid re-subscription on each render
 */
export function useAllChatRoomsEvent(
  callback: (roomGuid: string, data: ChatRoomEvent) => void,
) {
  useEffect(() => {
    socketService.chat?.onAny(callback);
    return () => {
      socketService.chat?.offAny(callback);
    };
  }, [callback]);
}

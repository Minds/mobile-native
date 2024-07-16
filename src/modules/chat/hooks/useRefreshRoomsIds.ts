import { useEffect } from 'react';
import sp from '~/services/serviceProvider';

export function useRefreshRoomsIds(currentRoomId?: string) {
  useEffect(() => {
    if (currentRoomId) {
      if (!sp.socket.chat?.getRooms().includes(currentRoomId)) {
        sp.socket.chat?.refreshRoomList();
      }
    } else {
      sp.socket.chat?.refreshRoomList();
    }
  }, [currentRoomId]);
}

import { useEffect } from 'react';
import socketService from '~/common/services/socket.service';

export function useRefreshRoomsIds(currentRoomId?: string) {
  useEffect(() => {
    if (currentRoomId) {
      if (!socketService.chat?.getRooms().includes(currentRoomId)) {
        socketService.chat?.refreshRoomList();
      }
    } else {
      socketService.chat?.refreshRoomList();
    }
  }, [currentRoomId]);
}

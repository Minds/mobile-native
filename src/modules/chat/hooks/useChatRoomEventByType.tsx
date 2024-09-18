import { useCallback } from 'react';
import { useChatRoomEvent } from './useChatRoomEvent';
import { ChatRoomEventType } from '../types';
import sp from '~/services/serviceProvider';

/**
 * Subscribes to a room message event and unsubscribes on unmount
 *
 * Important: the callback and types array should be a stable references
 * to avoid re-subscription on each render
 */
export function useChatRoomEventByType(
  roomGuid: string,
  types: ChatRoomEventType[],
  callback: (data: any) => void,
  ignoreSelf = false,
) {
  useChatRoomEvent(
    roomGuid,
    useCallback(
      event => {
        if (
          types.includes(event.type) &&
          (ignoreSelf ? event.metadata.senderGuid !== sp.session.guid : true)
        ) {
          callback(event);
        }
      },
      [callback, ignoreSelf, types],
    ),
  );
}

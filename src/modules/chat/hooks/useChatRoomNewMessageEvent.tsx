import { useCallback } from 'react';
import { useChatRoomEvent } from './useChatRoomEvent';
import sessionService from '~/common/services/session.service';

/**
 * Subscribes to a room message event and unsubscribes on unmount
 *
 * Important: the callback should be a stable reference to avoid re-subscription on each render
 */
export function useChatRoomNewMessageEvent(
  roomGuid: string,
  callback: (data: any) => void,
  ignoreSelf = false,
) {
  useChatRoomEvent(
    roomGuid,
    useCallback(
      event => {
        if (
          event.type === 'NEW_MESSAGE' &&
          (ignoreSelf
            ? event.metadata.senderGuid !== sessionService.guid
            : true)
        ) {
          callback(event);
        }
      },
      [callback, ignoreSelf],
    ),
  );
}

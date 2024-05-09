import { useAllChatRoomsEvent } from './useAllChatRoomsEvent';
import { useIncrementUnreadMessages } from './useUnreadMessages';

/**
 * Increment the unread messages count when a new message is received.
 */
export function useIncrementUnreadOnNewMessage() {
  const incrementUnreadMessages = useIncrementUnreadMessages();

  // Increment the unread messages count when a new message is received.
  useAllChatRoomsEvent(async (roomGuid, event) => {
    if (event.type !== 'NEW_MESSAGE') return;

    incrementUnreadMessages(1);
  });
}

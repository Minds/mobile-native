import { useCallback, useRef } from 'react';
import { useSetReadReceiptMutation } from '~/graphql/api';

/**
 * Marks a message as read in the server
 *
 * It checks that the message is not already read before calling the mutation
 */
export function useSetReadReceipt() {
  const { mutate } = useSetReadReceiptMutation();
  const lastMessage = useRef<string>('');

  return useCallback(
    (roomGuid: string, messageGuid: string) => {
      if (lastMessage.current < messageGuid) {
        lastMessage.current = messageGuid;
        mutate({
          roomGuid,
          messageGuid,
        });
      }
    },
    [mutate],
  );
}

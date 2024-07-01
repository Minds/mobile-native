import React from 'react';
import { showNotification } from 'AppMessages';
import { TouchableOpacity } from 'react-native';

import FloatingInput from '~/common/components/FloatingInput';
import { useUpdateChatRoomNameMutation } from '~/graphql/api';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '~/common/ui';
import logService from '~/common/services/log.service';
import { getChatRoomInfoKey } from '../hooks/useChatRoomInfoQuery';

type PropsType = {
  roomGuid: string;
  currentName: string;
  children: React.ReactNode;
};

export default function ChatEditName({
  roomGuid,
  currentName,
  children,
}: PropsType) {
  const floatingInputref = React.useRef<any>(null);
  const [text, setText] = React.useState(currentName);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useUpdateChatRoomNameMutation({
    onSuccess: () => {
      floatingInputref.current?.hide();
      showNotification('Chat name updated');

      // we invalidate the cache
      const key = getChatRoomInfoKey(roomGuid);
      queryClient.invalidateQueries(key);
    },
    onError: error => {
      logService.exception('[ChatEditName]', error);
      showNotification('Error updating chat name', 'warning');
    },
  });
  return (
    <>
      <FloatingInput
        ref={floatingInputref}
        title="Edit chat name"
        defaultValue={currentName}
        onChangeText={setText}
        submitNewRow
        progress={isLoading}>
        <Button
          type="action"
          horizontal="XL"
          top="XL"
          onPress={() => {
            mutate({ roomGuid, roomName: text });
          }}>
          Update
        </Button>
      </FloatingInput>
      <TouchableOpacity onPress={() => floatingInputref.current?.show()}>
        {children}
      </TouchableOpacity>
    </>
  );
}

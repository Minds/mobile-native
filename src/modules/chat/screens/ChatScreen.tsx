import React from 'react';
import { Icon, Screen } from '~/common/ui';
import MessageList from '../components/MessageList';
import ChatHeader from '../components/ChatHeader';
import { TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  BottomSheetButton,
  BottomSheetModal as BottomSheet,
} from '~/common/components/bottom-sheet';
import {
  ChatRoomInviteRequestActionEnum,
  useReplyToRoomInviteRequestMutation,
} from '~/graphql/api';
import { useNavigation } from '@react-navigation/native';
import { showNotification } from 'AppMessages';
import i18nService from '~/common/services/i18n.service';
import logService from '~/common/services/log.service';

/**
 * Chat conversation screen
 */
export default function ChatScreen({ navigation, route }) {
  const { roomGuid, members, isRequest } = route.params || {};
  return (
    <Screen safe>
      {members && (
        <ChatHeader
          members={members}
          extra={
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatDetails', { members })}>
              <Icon name="info-circle" size={20} />
            </TouchableOpacity>
          }
        />
      )}
      <MessageList roomGuid={roomGuid} isRequest={isRequest} />
      {isRequest && <ActionSheet name="someone" roomGuid={roomGuid} />}
    </Screen>
  );
}

const ActionSheet = ({
  name,
  roomGuid,
}: {
  name: string;
  roomGuid: string;
}) => {
  const ref = React.useRef<BottomSheetModal>(null);
  const accepted = React.useRef(false);
  const replyMutation = useReplyToRoomInviteRequestMutation({
    onError: error => {
      logService.exception('[useReplyToRoomInviteRequestMutation]', error);
      showNotification(i18nService.t('errorMessage'));
    },
  });
  const navigation = useNavigation();

  //
  const accept = async () => {
    await replyMutation.mutate({
      roomGuid,
      action: ChatRoomInviteRequestActionEnum.Accept,
    });
    accepted.current = true;
    ref.current?.close();
  };

  const block = async () => {
    await replyMutation.mutate({
      roomGuid,
      action: ChatRoomInviteRequestActionEnum.RejectAndBlock,
    });
    ref.current?.close();
  };

  const reject = async () => {
    await replyMutation.mutate({
      roomGuid,
      action: ChatRoomInviteRequestActionEnum.Reject,
    });
    ref.current?.close();
  };

  return (
    <BottomSheet
      ref={ref}
      title={`Accept chat request from ${name}`}
      detail="They will only be notified that you've seen their chat after you accept it."
      onChange={index =>
        index === -1 && !accepted.current && navigation.goBack()
      }
      autoShow>
      <BottomSheetButton
        action
        disabled={replyMutation.isLoading}
        text="Accept"
        onPress={accept}
      />
      <BottomSheetButton
        warning
        disabled={replyMutation.isLoading}
        text="Block"
        onPress={block}
      />
      <BottomSheetButton
        warning
        disabled={replyMutation.isLoading}
        text="Reject"
        onPress={reject}
      />
    </BottomSheet>
  );
};

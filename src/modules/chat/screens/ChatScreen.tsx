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
import { ChatRoomProvider } from '../contexts/ChatRoomContext';

/**
 * Chat conversation screen
 */
export default function ChatScreen({ navigation, route }) {
  const { roomGuid, members, isRequest } = route.params || {};
  const [accepted, setAccepted] = React.useState(false);
  const showRequest = isRequest && !accepted;
  return (
    <Screen safe>
      <ChatRoomProvider roomGuid={roomGuid}>
        <ChatScreenBody
          members={members}
          navigation={navigation}
          roomGuid={roomGuid}
          isRequest={showRequest}
        />
      </ChatRoomProvider>
      {showRequest && (
        <RequestActionSheet
          name="someone"
          roomGuid={roomGuid}
          onAccept={() => setAccepted(true)}
        />
      )}
    </Screen>
  );
}

const ChatScreenBody = ({ members, navigation, roomGuid, isRequest }) => {
  return (
    <>
      {members && (
        <ChatHeader
          members={members}
          extra={
            !isRequest ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChatDetails', { roomGuid })
                }>
                <Icon name="info-circle" size={20} />
              </TouchableOpacity>
            ) : null
          }
        />
      )}
      <MessageList roomGuid={roomGuid} isRequest={isRequest} />
    </>
  );
};

const RequestActionSheet = ({
  name,
  roomGuid,
  onAccept,
}: {
  name: string;
  roomGuid: string;
  onAccept: () => void;
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
    onAccept();
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

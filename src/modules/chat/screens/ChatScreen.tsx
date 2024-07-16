import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import { Icon, Screen } from '~/common/ui';
import MessageList from '../components/MessageList';
import ChatHeader from '../components/ChatHeader';
import {
  BottomSheetButton,
  BottomSheetModal as BottomSheet,
} from '~/common/components/bottom-sheet';
import {
  ChatRoomInviteRequestActionEnum,
  ChatRoomTypeEnum,
  useReplyToRoomInviteRequestMutation,
} from '~/graphql/api';
import { showNotification } from 'AppMessages';
import {
  ChatRoomProvider,
  useChatRoomContext,
} from '../contexts/ChatRoomContext';
import { useRefreshRoomsIds } from '../hooks/useRefreshRoomsIds';
import { useRefetchUnreadMessages } from '../hooks/useUnreadMessages';
import { useChatroomViewAnalytic } from '../hooks/useChatroomViewAnalytic';
import ChatEditName from '../components/ChatEditName';

import sp from '~/services/serviceProvider';

/**
 * Chat conversation screen
 *
 * This screen also handles chat requests
 */
export default function ChatScreen({ navigation, route }) {
  const { roomGuid, members, isRequest } = route.params || {};
  const [accepted, setAccepted] = React.useState(false);
  const refetchUnreadMessages = useRefetchUnreadMessages();

  // refresh rooms ids
  useRefreshRoomsIds(roomGuid);

  // refresh global unread messages count when leaving the screen
  useEffect(() => {
    return () => {
      refetchUnreadMessages();
    };
  }, [refetchUnreadMessages]);

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
          roomGuid={roomGuid}
          onAccept={() => setAccepted(true)}
        />
      )}
    </Screen>
  );
}

const ChatScreenBody = ({ members, navigation, roomGuid, isRequest }) => {
  // track chat room view
  useChatroomViewAnalytic();
  const query = useChatRoomContext();

  const isOwnerAndMultiUser =
    query.data?.chatRoom.node.roomType === ChatRoomTypeEnum.MultiUser &&
    query.data?.chatRoom.node.isUserRoomOwner;
  const analytics = sp.resolve('analytics');
  const theme = sp.styles.style;
  return (
    <>
      <ChatHeader
        members={members}
        extra={
          <View style={[theme.rowJustifyEnd, theme.gap3x]}>
            {isOwnerAndMultiUser && query.data && (
              <ChatEditName
                roomGuid={roomGuid}
                currentName={query.data.chatRoom.node.name}
                children={<Icon name="pencil" size={20} />}
              />
            )}
            {isOwnerAndMultiUser && (
              <TouchableOpacity
                onPress={() => {
                  sp.resolve('analytics').trackClick(
                    'data-minds-chat-room-settings-button',
                  );
                  navigation.navigate('ChatAddUsers', {
                    roomGuid,
                    ignore: members
                      ? members?.map(m => m.node.guid)
                      : undefined,
                  });
                }}>
                <Icon name="plus" size={20} />
              </TouchableOpacity>
            )}
            {!isRequest ? (
              <TouchableOpacity
                onPress={() => {
                  analytics.trackClick('data-minds-chat-room-settings-button');
                  navigation.navigate('ChatDetails', { roomGuid });
                }}>
                <Icon name="info-circle" size={20} />
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />

      <MessageList roomGuid={roomGuid} isRequest={isRequest} />
    </>
  );
};

const RequestActionSheet = ({
  roomGuid,
  onAccept,
}: {
  roomGuid: string;
  onAccept: () => void;
}) => {
  const analytics = sp.resolve('analytics');
  const ref = React.useRef<BottomSheetModal>(null);
  const accepted = React.useRef(false);
  const replyMutation = useReplyToRoomInviteRequestMutation({
    onError: error => {
      sp.log.exception('[useReplyToRoomInviteRequestMutation]', error);
      showNotification(sp.i18n.t('errorMessage'));
    },
  });
  const navigation = useNavigation();

  const accept = async () => {
    analytics.trackClick('data-minds-chat-request-accept-button');
    await replyMutation.mutate({
      roomGuid,
      action: ChatRoomInviteRequestActionEnum.Accept,
    });
    accepted.current = true;
    onAccept();
    ref.current?.close();
  };

  const block = async () => {
    analytics.trackClick('data-minds-chat-request-block-user-button');
    await replyMutation.mutate({
      roomGuid,
      action: ChatRoomInviteRequestActionEnum.RejectAndBlock,
    });
    ref.current?.close();
  };

  const reject = async () => {
    analytics.trackClick('data-minds-chat-request-reject-button');
    await replyMutation.mutate({
      roomGuid,
      action: ChatRoomInviteRequestActionEnum.Reject,
    });
    ref.current?.close();
  };

  return (
    <BottomSheet
      ref={ref}
      title={'Accept chat request'}
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

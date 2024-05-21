import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Link from '~/common/components/Link';
import Toggle from '~/common/components/Toggle';
import { B1, H3, IconButton, Row, Screen, ScreenHeader } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { useChatRoomInfoQuery } from '../hooks/useChatRoomInfoQuery';
import CenteredLoading from '~/common/components/CenteredLoading';
import {
  ChatRoomNotificationStatusEnum,
  ChatRoomTypeEnum,
  useDeleteChatRoomAndBlockUserMutation,
  useDeleteChatRoomMutation,
  useLeaveChatRoomMutation,
} from '~/graphql/api';
import { confirm } from '~/common/components/Confirm';
import { ChatStackScreenProps } from '../ChatConversationStack';
import { showNotification } from 'AppMessages';
import MPressable from '~/common/components/MPressable';
import { useRefreshOnFocus } from '~/services/hooks/useRefreshOnFocus';
import ErrorLoading from '~/common/components/ErrorLoading';
import analyticsService from '~/common/services/analytics.service';
import { useChatNotificationMutation } from '../hooks/useChatNotificationMutation';
import ChatEditName from '../components/ChatEditName';

type Props = ChatStackScreenProps<'ChatDetails'>;

/**
 * Chat details screen
 */
export default function ChatDetailsScreen({ route, navigation }: Props) {
  const roomGuid = route.params?.roomGuid;
  if (!roomGuid) {
    throw new Error('roomGuid is required');
  }

  const { data, isLoading, error, refetch } = useChatRoomInfoQuery(roomGuid);

  const showEdit =
    data?.chatRoom.node.roomType === ChatRoomTypeEnum.MultiUser &&
    data?.chatRoom.node.isUserRoomOwner;

  const { mutate } = useChatNotificationMutation();

  const setNotificationMuted = useCallback(
    (value: boolean) => {
      mutate({
        roomGuid,
        notificationStatus: value
          ? ChatRoomNotificationStatusEnum.Muted
          : ChatRoomNotificationStatusEnum.All,
      });
    },
    [mutate, roomGuid],
  );

  // refetch on screen focus
  useRefreshOnFocus(refetch);

  const deleteChatMutation = useDeleteChatRoomMutation({
    onSuccess: () => {
      showNotification('Chat deleted', 'success');

      // we move back to the main screen
      navigation.getParent()?.goBack();
    },
  });

  const blockAndDeleteMutation = useDeleteChatRoomAndBlockUserMutation({
    onSuccess: () => {
      showNotification('User Blocked and chat deleted', 'success');

      // we move back to the main screen
      navigation.getParent()?.goBack();
    },
  });

  const leaveMutation = useLeaveChatRoomMutation({
    onSuccess: () => {
      // we move back to the main screen
      navigation.getParent()?.goBack();
    },
  });

  const muted =
    data?.chatRoom.node.chatRoomNotificationStatus ===
    ChatRoomNotificationStatusEnum.Muted;

  const deleteChat = async () => {
    analyticsService.trackClick('data-minds-chat-info-delete-button');
    const result = await confirm({
      title: 'Delete chat',
      description: 'Are you sure you want to delete this chat?',
    });
    if (result) {
      deleteChatMutation.mutate({ roomGuid });
    }
  };
  const leaveChat = async () => {
    const result = await confirm({
      title: 'Leave room',
      description: 'Are you sure you want to leave this chat?',
    });
    if (result) {
      leaveMutation.mutate({ roomGuid });
    }
  };

  const blockUser = async () => {
    const result = await confirm({
      title: 'Block user',
      description:
        'Are you sure you want to block this user and delete this chat?',
    });
    if (result) {
      blockAndDeleteMutation.mutate({ roomGuid });
    }
  };

  const privateChat =
    data?.chatRoom.node.roomType === ChatRoomTypeEnum.OneToOne;
  const isUserRoomOwner = Boolean(data?.chatRoom.node.isUserRoomOwner);
  const isGroupChat =
    data?.chatRoom.node.roomType === ChatRoomTypeEnum.GroupOwned;
  return (
    <Screen safe scroll>
      <ScreenHeader border back={true} title="Chat details" />

      {isLoading ? (
        <CenteredLoading />
      ) : error ? (
        <ErrorLoading
          message={
            error instanceof Error ? error.message : 'Error loading data'
          }
          tryAgain={refetch}
        />
      ) : (
        <>
          <H3 left="XXXL" top="XXXL">
            Notifications
          </H3>
          <Row align="centerBetween" vertical="XL" horizontal="XXXL">
            <B1>Mute notifications for this chat</B1>
            <Toggle value={muted} onValueChange={setNotificationMuted} />
          </Row>
          <MPressable
            onPress={() => {
              if (!data?.chatRoom) return;
              navigation.navigate('ChatMembers', {
                roomGuid,
                chatRoom: data?.chatRoom,
              });
            }}>
            <Row align="centerBetween" vertical="XL" horizontal="XXXL">
              <H3>Chat Members ({data?.chatRoom.totalMembers})</H3>
              <IconButton name={'chevron-right'} size={32} />
            </Row>
          </MPressable>
          <View style={styles.separator} />
          {privateChat && (
            <TouchableOpacity onPress={blockUser}>
              <Link style={styles.dangerLink} decoration={false}>
                Block user
              </Link>
            </TouchableOpacity>
          )}
          {showEdit && data && (
            <ChatEditName
              roomGuid={roomGuid}
              currentName={data.chatRoom.node.name}
              children={
                <Link style={styles.simpleLink} decoration={false}>
                  Change chat name
                </Link>
              }
            />
          )}
          {!privateChat && !isUserRoomOwner && (
            <TouchableOpacity onPress={leaveChat}>
              <Link style={styles.dangerLink} decoration={false}>
                Leave chat
              </Link>
            </TouchableOpacity>
          )}
          {((isUserRoomOwner && !isGroupChat) || privateChat) && (
            <TouchableOpacity onPress={deleteChat}>
              <Link style={styles.dangerLink} decoration={false}>
                Delete chat
              </Link>
            </TouchableOpacity>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = ThemedStyles.create({
  container: ['flexContainer', 'marginHorizontal7x', 'marginTopL'],
  separator: ['bcolorPrimaryBorder', 'borderTop1x'],
  simpleLink: [
    'colorSecondaryText',
    'fontXL',
    'marginHorizontal7x',
    'marginVertical4x',
  ],
  dangerLink: [
    'colorAlert',
    'fontXL',
    'marginHorizontal7x',
    'marginVertical4x',
  ],
});

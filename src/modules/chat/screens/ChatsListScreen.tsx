import React, { useCallback } from 'react';
import { View } from 'react-native';

import { B2, B3, Button, H3, Screen, ScreenHeader, Spacer } from '~/common/ui';
import ChatListItem from '../components/ChatListItem';
import NavigationService from '~/navigation/NavigationService';
import { ChatRoom } from '../types';
import { useChatRoomListQuery } from '../hooks/useChatRoomListQuery';
import ChatRequestCount from '../components/ChatRequestCount';
import ChatRoomList from '../components/ChatRoomList';
import ChatNewButton from '../components/ChatNewButton';
import { useRefreshOnFocus } from '~/services/hooks/useRefreshOnFocus';
import socketService from '~/common/services/socket.service';
import { useRefetchUnreadMessages } from '../hooks/useUnreadMessages';
import { useStyle } from '~/styles/ThemedStyles';
import analyticsService from '~/common/services/analytics.service';

/**
 * Chat rooms list screen
 */
export default function ChatsListScreen({ navigation }) {
  return (
    <Screen safe>
      <ScreenHeader back={false} title="Chat" extra={<Alpha />} />
      <ChatList />
      <ChatNewButton
        onPress={() => {
          analyticsService.trackClick(
            'data-minds-chat-room-list-new-chat-button',
          );
          navigation.push('ChatNew');
        }}
      />
    </Screen>
  );
}

const Alpha = () => (
  <View
    style={useStyle(
      'paddingVertical',
      'paddingHorizontal2x',
      'borderRadius13x',
      'bgLink',
    )}>
    <B3 color="black" font="medium">
      Alpha
    </B3>
  </View>
);

function ChatList() {
  const { chats, isLoading, fetchNextPage, refetch } = useChatRoomListQuery();

  const refetchUnreadMessages = useRefetchUnreadMessages();

  const refresh = useCallback(() => {
    refetch();

    // refresh sockets room list subscriptions
    socketService.chat?.refreshRoomList();

    // refresh global unread messages count
    refetchUnreadMessages();
  }, [refetch, refetchUnreadMessages]);

  // refetch on screen focus
  useRefreshOnFocus(refetch);

  return (
    <ChatRoomList
      renderItem={renderItem}
      ListHeaderComponent={
        <ChatRequestCount
          onPress={() => {
            analyticsService.trackClick(
              'data-minds-chat-pending-requests-button',
            );
            NavigationService.push('ChatRequestsList');
          }}
        />
      }
      isLoading={isLoading}
      refreshing={false}
      onRefresh={refresh}
      Empty={Empty}
      onEndReached={fetchNextPage}
      data={chats}
    />
  );
}

const Empty = () => (
  <Spacer horizontal="XL" top="L">
    <H3>Say hello to chats!</H3>
    <B2 vertical="M">
      Start a direct conversation with a friend, stranger, or group of people on
      Minds.
    </B2>
    <Button
      onPress={() => {
        analyticsService.trackClick(
          'data-minds-chat-no-chats-empty-list-button',
        );
        NavigationService.push('ChatNew');
      }}
      align="start"
      type="action">
      New chat
    </Button>
  </Spacer>
);

/**
 * Renders the list items
 */
const renderItem = ({ item }: { item: ChatRoom }) => (
  <ChatListItem
    chat={item}
    onPress={() => {
      analyticsService.trackClick('data-minds-chat-room-list-item');
      NavigationService.push('ChatStack', {
        screen: 'Chat',
        params: {
          roomGuid: item.node.guid,
          members: item.members.edges,
        },
      });
    }}
  />
);

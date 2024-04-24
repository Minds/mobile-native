import React, { useCallback } from 'react';
import { B1, Screen, ScreenHeader } from '~/common/ui';
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

/**
 * Chat rooms list screen
 */
export default function ChatsListScreen({ navigation }) {
  return (
    <Screen safe>
      <ScreenHeader back={false} title="Chats" />
      <ChatList />
      <ChatNewButton onPress={() => navigation.push('ChatNew')} />
    </Screen>
  );
}

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
          onPress={() => NavigationService.push('ChatRequestsList')}
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

const Empty = () => <B1>No chats</B1>;

/**
 * Renders the list items
 */
const renderItem = ({ item }: { item: ChatRoom }) => (
  <ChatListItem
    chat={item}
    onPress={() => {
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

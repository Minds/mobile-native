import React from 'react';
import { B1, Screen, ScreenHeader } from '~/common/ui';
import ChatListItem from '../components/ChatListItem';
import { ChatRoom } from '../types';
import NavigationService from '~/navigation/NavigationService';

import { useChatRequestListQuery } from '../hooks/useChatRequestListQuery';
import ChatRoomList from '../components/ChatRoomList';

/**
 * Chat requests list screen
 */
export default function ChatRequestsListScreen() {
  return (
    <Screen safe>
      <ScreenHeader back={true} title="Chat Requests" />
      <ChatList />
    </Screen>
  );
}

function ChatList() {
  const { chats, isLoading, fetchNextPage, isRefetching, refetch } =
    useChatRequestListQuery();
  return (
    <ChatRoomList
      renderItem={renderItem}
      refreshing={isRefetching}
      onRefresh={refetch}
      onEndReached={fetchNextPage}
      data={chats}
      isLoading={isLoading}
      Empty={Empty}
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
          isRequest: true,
        },
      });
    }}
  />
);

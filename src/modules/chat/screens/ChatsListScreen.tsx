import React from 'react';
import { B1, Screen, ScreenHeader } from '~/common/ui';
import ChatListItem from '../components/ChatListItem';
import { FlashList } from '@shopify/flash-list';
import NavigationService from '~/navigation/NavigationService';
import { ChatRoom } from '../types';
import CenteredLoading from '~/common/components/CenteredLoading';
import { useChatRoomListQuery } from '../hooks/useChatRoomListQuery';
import { RefreshControl } from 'react-native';
import { IS_IOS } from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';

export default function ChatsListScreen() {
  return (
    <Screen safe>
      <ScreenHeader back={false} title="Chats" />
      <ChatList />
    </Screen>
  );
}

function ChatList() {
  const { chats, isLoading, fetchNextPage, isRefetching, refetch } =
    useChatRoomListQuery();
  return (
    <FlashList
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          progressViewOffset={IS_IOS ? 0 : 80}
          tintColor={ThemedStyles.getColor('Link')}
          colors={[ThemedStyles.getColor('Link')]}
        />
      }
      refreshing={isRefetching}
      onRefresh={refetch}
      estimatedItemSize={68}
      ListEmptyComponent={isLoading ? <CenteredLoading /> : <Empty />}
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

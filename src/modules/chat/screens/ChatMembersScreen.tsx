import React from 'react';
import { FlashList } from '@shopify/flash-list';

import { Icon, Screen, ScreenHeader } from '~/common/ui';
import { ChatStackScreenProps } from '../ChatConversationStack';
import CenteredLoading from '~/common/components/CenteredLoading';

import { RefreshControl, TouchableOpacity } from 'react-native';
import { IS_IOS } from '~/config/Config';
import ChatUserItem from '../components/ChatUserItem';
import { ChatMember } from '../types';
import {
  ChatRoomMembersProvider,
  useChatRoomMembersContext,
} from '../contexts/ChatRoomMembersContext';
import { showMemberMenu } from '../components/MemberMenu';
import ErrorLoading from '~/common/components/ErrorLoading';
import sp from '~/services/serviceProvider';

type Props = ChatStackScreenProps<'ChatMembers'>;

/**
 * Chat Members Screen
 */
export default function ChatMembersScreen({ route }: Props) {
  const { roomGuid, chatRoom } = route.params;

  if (!roomGuid) {
    throw new Error('roomGuid is required');
  }

  return (
    <Screen safe>
      <ScreenHeader back={true} title="Chat Members" />
      <ChatRoomMembersProvider roomGuid={roomGuid} chatRoom={chatRoom}>
        <MembersList />
      </ChatRoomMembersProvider>
    </Screen>
  );
}

/**
 * Members FlashList
 */
function MembersList() {
  const { members, isLoading, error, refetch, fetchNextPage, isRefetching } =
    useChatRoomMembersContext();

  return error ? (
    <ErrorLoading
      message={error instanceof Error ? error.message : 'Error loading data'}
      tryAgain={refetch}
    />
  ) : (
    <FlashList
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          progressViewOffset={IS_IOS ? 0 : 80}
          tintColor={sp.styles.getColor('Link')}
          colors={[sp.styles.getColor('Link')]}
        />
      }
      estimatedItemSize={68}
      ListEmptyComponent={isLoading ? <CenteredLoading /> : null}
      onEndReached={fetchNextPage}
      keyExtractor={keyExtractor}
      data={members}
    />
  );
}

const keyExtractor = item => item.node.id;

/**
 * List Item
 */
function renderItem({ item }: { item: any }) {
  return <ChatMemberItem member={item} />;
}

const ChatMemberItem = React.memo(({ member }: { member: ChatMember }) => {
  const context = useChatRoomMembersContext();
  return (
    <ChatUserItem
      user={member}
      extra={
        <TouchableOpacity
          onPress={() => {
            showMemberMenu(member, context);
          }}>
          <Icon name="more-horiz" />
        </TouchableOpacity>
      }
    />
  );
});

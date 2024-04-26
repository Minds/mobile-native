import React from 'react';
import { Avatar, Row, ScreenHeader } from '~/common/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { ChatMember } from '../types';
import { useChatRoomContext } from '../contexts/ChatRoomContext';

type Props = {
  members: ChatMember[];
  extra?: React.ReactNode;
};

function ChatHeader({ members, extra }: Props) {
  const query = useChatRoomContext();

  if (!query.data?.chatRoom.members) {
    return null;
  }

  const firstThreeMembers = query.data?.chatRoom.members
    ? query.data?.chatRoom.members.edges.slice(0, 3)
    : members
    ? members.slice(0, 3)
    : [];

  const avatars = firstThreeMembers.map((member, index) =>
    index === 0 ? (
      <Avatar
        testID="Avatar"
        key={index}
        size="tiny"
        source={{
          uri: member.node.iconUrl,
        }}
      />
    ) : (
      <View style={styles.avatars} key={index}>
        <Avatar
          testID="Avatar"
          size="tiny"
          source={{
            uri: member.node.iconUrl,
          }}
        />
      </View>
    ),
  );

  const title =
    firstThreeMembers
      .map(member => member.node.name || member.node.username)
      .join(', ') +
    (query.data?.chatRoom.totalMembers > 3
      ? ` and ${query.data?.chatRoom.totalMembers - 3} others`
      : '');

  return (
    <ScreenHeader
      back={true}
      border
      title={title}
      titleType="B1"
      extra={extra}
      leftComponent={
        <Row left="S" right="M">
          {avatars}
        </Row>
      }
    />
  );
}

export default ChatHeader;

const styles = StyleSheet.create({
  avatars: {
    marginLeft: -10,
  },
});

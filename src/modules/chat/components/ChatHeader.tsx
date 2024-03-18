import React from 'react';
import { Avatar, Row, ScreenHeader } from '~/common/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { ChatMember } from '../types';

type Props = {
  members: ChatMember[];
  extra?: React.ReactNode;
};

function ChatHeader({ members, extra }: Props) {
  const firstThreeMembers = members.slice(0, 3);

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
    firstThreeMembers.map(member => member.node.name).join(', ') +
    (members.length > 3 ? ` and ${members.length - 3} others` : '');

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

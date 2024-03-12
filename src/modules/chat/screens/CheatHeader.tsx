import React from 'react';
import { Avatar, Row, ScreenHeader } from '~/common/ui';
import { View } from 'moti';
import { StyleSheet } from 'react-native';
import { ChatMember } from '../types';

type Props = {
  members: ChatMember[];
  extra: React.ReactNode;
};

export const CheatHeader = ({ members, extra }: Props) => {
  const firstThreeMembers = members.slice(0, 3);
  const avatars = firstThreeMembers.map((member, index) =>
    index === 0 ? (
      <Avatar
        key={index}
        size="tiny"
        source={{
          uri: member.avatar,
        }}
      />
    ) : (
      <View style={styles.avatars} key={index}>
        <Avatar
          size="tiny"
          source={{
            uri: member.avatar,
          }}
        />
      </View>
    ),
  );

  const title =
    firstThreeMembers.map(member => member.username).join(', ') +
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
};

const styles = StyleSheet.create({
  avatars: {
    marginLeft: -10,
  },
});

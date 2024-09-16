import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, Row, ScreenHeader } from '~/common/ui';
import { ChatMember } from '../types';
import { useChatRoomContext } from '../contexts/ChatRoomContext';
import { APP_URI } from '~/config/Config';
import { useNavigation } from '@react-navigation/native';

type Props = {
  members: ChatMember[];
  extra?: React.ReactNode;
  hideBack?: boolean;
};

function ChatHeader({ members, extra, hideBack }: Props) {
  const query = useChatRoomContext();
  const navigation = useNavigation();

  if (!query.data?.chatRoom.members) {
    return null;
  }

  const isGroupChat = query.data?.chatRoom.node.roomType === 'GROUP_OWNED';

  const firstThreeMembers = query.data?.chatRoom.members
    ? query.data?.chatRoom.members.edges.slice(0, 3)
    : members
    ? members.slice(0, 3)
    : [];

  const avatars = isGroupChat ? (
    <Avatar
      testID="Avatar"
      size="tiny"
      onPress={() => {
        query.data &&
          navigation.navigate('GroupView', {
            guid: query.data?.chatRoom.node.groupGuid,
          });
      }}
      source={{
        uri: `${APP_URI}fs/v1/avatars/${query.data?.chatRoom.node.groupGuid}/large`,
      }}
    />
  ) : (
    firstThreeMembers.map((member, index) =>
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
    )
  );

  const title = query.data?.chatRoom.node.name;

  return (
    <ScreenHeader
      back={!hideBack}
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

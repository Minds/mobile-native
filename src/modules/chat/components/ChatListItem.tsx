import React from 'react';
import { View } from 'react-native';
import moment from 'moment';

import { Avatar, B2, B3, Row } from '~/common/ui';
import MPressable from '~/common/components/MPressable';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import { ChatRoom } from '../types';

import { APP_URI } from '~/config/Config';
import sp from '~/services/serviceProvider';

type Props = {
  chat: ChatRoom;
  privateChat?: boolean;
  onPress: () => void;
};

function ChatListItem({ chat, onPress }: Props) {
  const isGroupChat = chat.node.roomType === 'GROUP_OWNED';
  const timestamp =
    1000 *
    (chat.lastMessageCreatedTimestamp
      ? chat.lastMessageCreatedTimestamp
      : parseInt(chat.node.timeCreatedUnix, 10));

  return (
    <MPressable onPress={onPress} testID="chatListItem">
      <Row horizontal="XL" vertical="M" align="centerStart">
        {chat.node.roomType === 'ONE_TO_ONE' ||
        isGroupChat ||
        chat.members.edges.length === 1 ? (
          <Avatar
            size="small"
            source={{
              uri: isGroupChat
                ? `${APP_URI}fs/v1/avatars/${chat.node.groupGuid}/large`
                : chat.members.edges[0].node.iconUrl,
            }}
          />
        ) : (
          <View style={styles.multiavatarContainer}>
            <View style={styles.avatar1}>
              <Avatar
                size="micro"
                border="primary"
                source={{
                  uri: chat.members.edges[0].node.iconUrl,
                }}
              />
            </View>
            <View style={styles.avatar2}>
              <Avatar
                size="micro"
                source={{
                  uri: chat.members.edges[1].node.iconUrl,
                }}
              />
            </View>
          </View>
        )}
        <View style={styles.column}>
          <View style={styles.nameContainer}>
            <B2 font="medium" numberOfLines={1} style={styles.name}>
              {chat.node.name}
            </B2>
            <B2 color="secondary">
              {sp.i18n.date(moment(timestamp), 'friendly')}
            </B2>
          </View>
          <View style={styles.nameContainer}>
            <View style={styles.message}>
              <B3 color="secondary" top="S" numberOfLines={1}>
                {chat.lastMessagePlainText}
              </B3>
            </View>
            {chat.unreadMessagesCount > 0 && <View style={styles.unread} />}
          </View>
        </View>
      </Row>
    </MPressable>
  );
}

export default withErrorBoundary(React.memo(ChatListItem), 'ChatListItem');

const styles = sp.styles.create({
  unread: [
    {
      width: 8,
      height: 8,
      marginTop: 10,
      borderRadius: 100,
    },
    'bgLink',
  ],
  name: {
    flex: 1,
    paddingRight: 10,
  },
  message: {
    flex: 1,
  },
  column: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'column',
  },
  nameContainer: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  multiavatarContainer: {
    width: 40,
  },
  avatar1: {
    zIndex: 1000,
    position: 'absolute',
    top: -10,
    left: 0,
  },
  avatar2: {
    position: 'absolute',
    top: -25,
    left: 16,
  },
});

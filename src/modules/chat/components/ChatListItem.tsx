import React from 'react';
import { Avatar, B2, B3, Row } from '~/common/ui';
import MPressable from '~/common/components/MPressable';
import { StyleSheet, View } from 'react-native';
import i18nService from '~/common/services/i18n.service';
import moment from 'moment';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import { ChatRoom } from '../types';

type Props = {
  chat: ChatRoom;
  privateChat?: boolean;
  onPress: () => void;
};

function ChatListItem({ chat, onPress }: Props) {
  return (
    <MPressable onPress={onPress} testID="chatListItem">
      <Row horizontal="XL" vertical="M" align="centerStart">
        {chat.node.roomType === 'ONE_TO_ONE' ||
        chat.members.edges.length === 1 ? (
          <Avatar
            size="small"
            source={{
              uri: chat.members.edges[0].node.iconUrl,
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
            <B2 font="medium">{chat.members.edges[0].node.username}</B2>
            <B2 color="secondary">
              {i18nService.date(
                moment(chat.node.timeCreatedISO8601),
                'friendly',
              )}
            </B2>
          </View>
          <B3
            color="secondary"
            top="S"
            numberOfLines={1}
            style={styles.message}>
            {chat.messages?.edges?.[0]?.node.plainText}
          </B3>
        </View>
      </Row>
    </MPressable>
  );
}

export default withErrorBoundary(ChatListItem, 'ChatListItem');

const styles = StyleSheet.create({
  message: {
    flex: 1,
  },
  column: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'column',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  multiavatarContainer: {
    width: 45,
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

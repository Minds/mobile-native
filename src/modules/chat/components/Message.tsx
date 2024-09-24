import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import TurboImage from 'react-native-turbo-image';

import { Avatar, B1, B2 } from '~/common/ui';
import { ChatMessage } from '../types';
import {
  ChatRoomMessagesContextType,
  useChatRoomMessageContext,
} from '../contexts/ChatRoomMessageContext';
import domain from '~/common/helpers/domain';
import {
  ChatRoomContextType,
  useChatRoomContext,
} from '../contexts/ChatRoomContext';
import sp from '~/services/serviceProvider';

type Props = {
  message: ChatMessage;
  onLongPress: (
    message: ChatMessage,
    context: ChatRoomMessagesContextType,
    roomContext: ChatRoomContextType,
  ) => void | Promise<void>;
};

function Message({ message, onLongPress }: Props) {
  const sender = message.node.sender.node;
  const date = moment(message.node.timeCreatedISO8601);
  const context = useChatRoomMessageContext();
  const roomContext = useChatRoomContext();

  const longPress = onLongPress
    ? () => {
        onLongPress(message, context, roomContext);
      }
    : undefined;
  const i18n = sp.i18n;

  const user = sp.session.getUser();
  const isMe = sender.guid === user.guid;

  return !isMe ? (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar
          size="tiny"
          onPress={() => {
            sp.navigation.push('Channel', { guid: sender.guid });
          }}
          source={{
            uri: message.node.sender.node.iconUrl,
          }}
        />
      </View>
      <TouchableOpacity style={styles.bubbleContainer} onLongPress={longPress}>
        <B2 left="S" font="medium">
          {sender.name}
        </B2>
        {message.node.richEmbed ? (
          <RichEmbed message={message} onLongPress={longPress} />
        ) : (
          <View style={styles.bubble}>
            <B1>{message.node.plainText}</B1>
          </View>
        )}
        <B2 left="S" font="medium" color="secondary">
          {i18n.date(date, 'friendly')}
        </B2>
      </TouchableOpacity>
    </View>
  ) : (
    <View
      style={
        message.cursor ? styles.containerRight : styles.containerRightSending
      }>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.bubbleContainer}
        onLongPress={longPress}>
        {message.node.richEmbed ? (
          <RichEmbed message={message} onLongPress={longPress} />
        ) : (
          <View style={styles.bubbleRight}>
            <B1 color="primaryDark">{message.node.plainText}</B1>
          </View>
        )}
        <B2 font="medium" color="secondary" align="right" right="S">
          {i18n.date(date, 'friendly')}
        </B2>
      </TouchableOpacity>
    </View>
  );
}

const RichEmbed = ({
  message,
  onLongPress,
}: {
  message: ChatMessage;
  onLongPress?: () => void;
}) => {
  const user = sp.session.getUser();
  const isMe = message.node.sender.node.guid === user.guid;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onLongPress={onLongPress}
      onPress={() => {
        sp.resolve('analytics').trackClick(
          'data-minds-chat-room-message-rich-embed',
        );
        const url =
          message.node.richEmbed?.url || message.node.richEmbed?.canonicalUrl;
        url && sp.resolve('openURL').open(url);
      }}
      style={isMe ? styles.richBubbleRight : styles.richBubble}>
      <B1 color={isMe ? 'primaryDark' : 'primary'} horizontal="L" vertical="M">
        {message.node.plainText}
      </B1>
      {message.node.richEmbed?.thumbnailSrc && (
        <TurboImage
          source={{ uri: message.node.richEmbed?.thumbnailSrc }}
          resizeMode="cover"
          style={styles.image}
        />
      )}
      <B2
        horizontal="L"
        top="M"
        font="medium"
        color={isMe ? 'primaryDark' : 'primary'}
        numberOfLines={2}>
        {message.node.richEmbed?.title}
      </B2>
      <B2
        color={isMe ? 'secondaryDark' : 'secondary'}
        horizontal="L"
        top="XS"
        numberOfLines={1}
        bottom="M">
        {domain(message.node.richEmbed?.url)}
      </B2>
    </TouchableOpacity>
  );
};

export default React.memo(Message);

const styles = sp.styles.create({
  richBubble: [
    'borderRadius15x',
    'bgSecondaryBackground',
    { flex: 1, overflow: 'hidden' },
  ],
  richBubbleRight: [
    'borderRadius15x',
    { flex: 1, overflow: 'hidden', backgroundColor: '#1B85D6' },
  ],
  bubble: [
    'borderRadius15x',
    'bgSecondaryBackground',
    'paddingHorizontal3x',
    'paddingVertical2x',
    'marginVertical',
  ],
  avatarContainer: ['paddingBottom6x', 'paddingRight3x'],
  bubbleRight: [
    'borderRadius15x',
    {
      backgroundColor: '#1B85D6',
      padding: 10,
    },
    'paddingHorizontal3x',
    'paddingVertical2x',
    'marginVertical',
  ],
  bubbleContainer: [
    'paddingTop3x',
    {
      maxWidth: '70%',
    },
  ],
  container: ['fullWidth', 'rowJustifyStart', 'alignEnd'],
  containerRight: ['fullWidth', 'rowJustifyEnd'],
  containerRightSending: ['fullWidth', 'rowJustifyEnd', 'opacity50'],
  image: [
    {
      flex: 1,
      aspectRatio: 1.91 / 1,
    },
  ],
});

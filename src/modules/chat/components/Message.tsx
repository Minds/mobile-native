import React, { useMemo, useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { Image, ImageSource } from 'expo-image';

import { Avatar, B1, B2, B3, B4 } from '~/common/ui';
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
import SmartImage from '~/common/components/SmartImage';
import { ChatImageNode } from '~/graphql/api';
import { useNavigation } from '@react-navigation/native';
import Tags from '~/common/components/Tags';
import chatDate from '../utils/chat-date';

type Props = {
  message: ChatMessage;
  isPreviousFromSameSender: boolean;
  isNextFromSameSender: boolean;
  onLongPress: (
    message: ChatMessage,
    context: ChatRoomMessagesContextType,
    roomContext: ChatRoomContextType,
  ) => void | Promise<void>;
};

function Message({
  message,
  isPreviousFromSameSender,
  isNextFromSameSender,
  onLongPress,
}: Props) {
  const sender = message.node.sender.node;

  const context = useChatRoomMessageContext();
  const roomContext = useChatRoomContext();
  const showSender = !isPreviousFromSameSender;
  const [showTimestamp, setShowTimestamp] = useState(!isNextFromSameSender);

  const longPress = onLongPress
    ? () => {
        onLongPress(message, context, roomContext);
      }
    : undefined;
  const i18n = sp.i18n;

  const user = sp.session.getUser();
  const isMe = sender.guid === user.guid;

  return !isMe ? (
    <View
      style={[
        styles.container,
        !isNextFromSameSender ? sp.styles.style.paddingBottom6x : undefined,
      ]}>
      <View
        style={[
          styles.avatarContainer,
          showTimestamp ? { paddingBottom: 18 } : undefined,
        ]}>
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
      <TouchableOpacity
        style={[styles.bubbleContainer]}
        onLongPress={longPress}
        onPress={() => setShowTimestamp(!showTimestamp)}>
        {showSender ? (
          <B3
            left="S"
            font="medium"
            style={[
              sp.styles.style.paddingBottom,
              sp.styles.style.colorSecondaryText,
            ]}>
            {sender.name}
          </B3>
        ) : undefined}
        {message.node.image ? (
          <ChatImage image={message.node.image} onLongPress={longPress} />
        ) : message.node.richEmbed ? (
          <RichEmbed message={message} onLongPress={longPress} />
        ) : (
          <View style={styles.bubble}>
            <B2>
              <Tags navigation={sp.navigation} selectable>
                {message.node.plainText}
              </Tags>
            </B2>
          </View>
        )}
        {showTimestamp ? (
          <B4 left="S" font="regular" color="secondary">
            {chatDate(message.node.timeCreatedUnix, false)}
          </B4>
        ) : undefined}
      </TouchableOpacity>
    </View>
  ) : (
    <View
      style={[
        message.cursor ? styles.containerRight : styles.containerRightSending,
        !isNextFromSameSender ? sp.styles.style.paddingBottom6x : undefined,
      ]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.bubbleContainer]}
        onPress={() => setShowTimestamp(!showTimestamp)}
        onLongPress={longPress}>
        {message.node.image ? (
          <ChatImage image={message.node.image} onLongPress={longPress} right />
        ) : message.node.richEmbed ? (
          <RichEmbed message={message} onLongPress={longPress} />
        ) : (
          <View style={styles.bubbleRight}>
            <B2 color="primaryDark">
              <Tags navigation={sp.navigation} selectable>
                {message.node.plainText}
              </Tags>
            </B2>
          </View>
        )}
        {showTimestamp ? (
          <B4 left="S" font="regular" align="right" right="S" color="secondary">
            {chatDate(message.node.timeCreatedUnix, false)}
          </B4>
        ) : undefined}
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
      <B2 color={isMe ? 'primaryDark' : 'primary'} horizontal="M" vertical="M">
        <Tags navigation={sp.navigation} selectable>
          {message.node.plainText}
        </Tags>
      </B2>
      <Image
        source={message.node.richEmbed?.thumbnailSrc}
        contentFit="cover"
        style={styles.image}
      />
      <B3
        horizontal="L"
        top="M"
        font="medium"
        color={isMe ? 'primaryDark' : 'primary'}
        numberOfLines={2}>
        {message.node.richEmbed?.title}
      </B3>
      <B4
        color={isMe ? 'secondaryDark' : 'secondary'}
        horizontal="L"
        top="XS"
        numberOfLines={1}
        bottom="M">
        {domain(message.node.richEmbed?.url)}
      </B4>
    </TouchableOpacity>
  );
};

/** Blurhash placeholder type */
type BlurhashPlaceholderType =
  | Pick<ImageSource, 'blurhash' | 'width' | 'height'>
  | undefined;

/** Chat image props */
type ChatImageProps = {
  image: ChatImageNode;
  onLongPress?: () => void;
  right?: boolean;
};

/**
 * Chat image component
 * @param { ChatImageProps } props - The props for the chat image component.
 * @returns { React.ReactNode } The chat image component.
 */
const ChatImage = ({
  image,
  onLongPress,
  right,
}: ChatImageProps): React.ReactNode => {
  const navigation = useNavigation();
  const aspectRatio: number = useMemo(
    () => (image?.width && image?.height ? image.width / image.height : 1),
    [image],
  );
  const placeholder: BlurhashPlaceholderType = useMemo(
    () =>
      image.blurhash
        ? {
            blurhash: image.blurhash,
            width: image.width ?? undefined,
            height: image.height ?? undefined,
          }
        : undefined,
    [image],
  );

  /**
   * Handle chat image press by navigating to the chat image gallery screen.
   * @returns { void }
   */
  const handleChatImagePress = useCallback(() => {
    navigation.navigate('ChatImageGallery', { images: [image] });
  }, [navigation, image]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleChatImagePress}
      onLongPress={onLongPress}>
      <SmartImage
        contentFit="cover"
        source={{ uri: image.url, headers: sp.api.buildHeaders() }}
        style={[
          {
            aspectRatio: aspectRatio,
          },
          styles.imageAttachment,
        ]}
        placeholder={placeholder}
      />
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
    //'marginVertical',
  ],
  avatarContainer: ['paddingRight3x', { borderColor: 'red', borderWidth: 0 }],
  bubbleRight: [
    'borderRadius15x',
    {
      backgroundColor: '#1B85D6',
      padding: 10,
    },
    'paddingHorizontal3x',
    'paddingVertical2x',
    //'marginVertical',
  ],
  bubbleContainer: [
    { borderColor: 'green', borderWidth: 0 },
    'paddingTop1x',
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
  imageAttachment: [
    {
      minWidth: 180,
      minHeight: 180,
      maxHeight: 500,
      flexShrink: 1,
    },
    'borderRadius15x',
  ],
});

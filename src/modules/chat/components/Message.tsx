import { View } from 'react-native';
import React from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import { Avatar, B1, B2 } from '~/common/ui';
import { ChatMessage } from '../types';
import i18n from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';

type Props = {
  message: ChatMessage;
};

export default function Message({ message }: Props) {
  const date = new Date(parseInt(message.timeCreatedUnix, 10) * 1000);
  return message.sender.guid !== sessionService.getUser().guid ? (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar
          size="tiny"
          source={{
            uri: 'https://cdn.minds.com/icon/773311697292107790/large/1597789367',
          }}
        />
      </View>
      <View style={styles.bubbleContainer}>
        <B2 left="S" font="medium">
          {message.sender.username}
        </B2>
        <View style={styles.bubble}>
          <B1>{message.plainText}</B1>
        </View>
        <B2 left="S" font="medium" color="secondary">
          {i18n.date(date, 'friendly')}
        </B2>
      </View>
    </View>
  ) : (
    <View style={styles.containerRight}>
      <View style={styles.bubbleContainer}>
        <View style={styles.bubbleRight}>
          <B1 color="black">{message.plainText}</B1>
        </View>
        <B2 font="medium" color="secondary" align="right" right="S">
          {i18n.date(date, 'friendly')}
        </B2>
      </View>
    </View>
  );
}

const styles = ThemedStyles.create({
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
    'bgIconActive',
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
});

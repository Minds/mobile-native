import React from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet } from 'react-native';
import { ChatStoreType } from './createChatStore';
import MText from '../common/components/MText';

type PropsType = {
  chatStore: ChatStoreType;
};

const ChatBubbleIcon = observer(({ chatStore }: PropsType) => {
  const count =
    chatStore.unreadCount > 0 ? (
      <>
        <View style={styles.unreadBackground}>
          <MText style={styles.unreadText}>{chatStore.unreadCount}</MText>
        </View>
      </>
    ) : null;

  return count;
});

const styles = StyleSheet.create({
  unreadBackground: {
    zIndex: 9999,
    opacity: 1,
    position: 'absolute',
    bottom: 20,
    left: 18,
    backgroundColor: '#e03c20',
    borderRadius: 10,
  },
  unreadText: {
    color: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ChatBubbleIcon;

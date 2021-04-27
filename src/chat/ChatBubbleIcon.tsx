import React from 'react';
import { observer } from 'mobx-react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatStoreType } from './createChatStore';

type PropsType = {
  chatStore: ChatStoreType;
};

const ChatBubbleIcon = observer(({ chatStore }: PropsType) => {
  const count =
    chatStore.unreadCount > 0 ? (
      <>
        <View style={styles.unreadBackground}>
          <Text style={styles.unreadText}>{chatStore.unreadCount}</Text>
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
    bottom: 25,
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

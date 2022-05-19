import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconCircled } from '~ui/icons';
import { useStores } from '~/common/hooks/use-stores';
import ChatBubbleIcon from './ChatBubbleIcon';

const ChatIcon = React.memo(() => {
  const { chat } = useStores();

  useEffect(() => {
    // deffer the initial load to avoid issues when switching users
    const timeout = setTimeout(() => {
      if (chat) {
        chat.init();
      }
    }, 2000);
    return () => {
      timeout && clearTimeout(timeout);
      chat.reset();
    };
  }, [chat]);

  return (
    <View style={styles.container}>
      <IconCircled size="small" name="chat-solid" color="PrimaryText" />
      <ChatBubbleIcon chatStore={chat} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatIcon;

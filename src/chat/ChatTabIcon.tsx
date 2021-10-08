import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '~ui/icons';
import { useStores } from '../common/hooks/use-stores';
import ChatBubbleIcon from './ChatBubbleIcon';

type PropsType = {
  active: boolean;
};

const ChatTabIcon = ({ active }: PropsType) => {
  const { chat } = useStores();

  useEffect(() => {
    chat.init();
    return () => {
      chat.clear();
    };
  }, [chat]);

  return (
    <View style={styles.container}>
      <Icon name="chat" active={active} />
      <ChatBubbleIcon chatStore={chat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatTabIcon;

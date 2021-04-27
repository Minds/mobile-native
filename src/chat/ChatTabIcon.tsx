import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStores } from '../common/hooks/use-stores';
import ChatBubbleIcon from './ChatBubbleIcon';

type PropsType = {
  color: string | undefined;
};

const ChatTabIcon = ({ color }: PropsType) => {
  const { chat } = useStores();

  useEffect(() => {
    chat.init();
    return () => {
      chat.clear();
    };
  }, [chat]);

  return (
    <View style={styles.container}>
      <Icon name="message-outline" size={28} color={color} />
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

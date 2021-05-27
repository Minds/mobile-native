import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '~/common/components/icons/Icon';
import { ICON_SIZE, SPACING } from '~/styles/Tokens';
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
      <Icon name="chat" size={ICON_SIZE} color={color} />
      <ChatBubbleIcon chatStore={chat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.XXS,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatTabIcon;

import React from 'react';

import { View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import ThemedStyles from '~/styles/ThemedStyles';
import PressableScale from '~/common/components/PressableScale';

type Props = {
  onPress?: () => void;
  testID?: string;
};

const ChatNewButton = ({ onPress, testID }: Props) => {
  return (
    <PressableScale style={styles.container} onPress={onPress}>
      <ChatNewButtonIcon testID={testID} />
    </PressableScale>
  );
};

const ChatNewButtonIcon = ({ testID }: { testID?: string }) => (
  <View style={styles.iconContainer}>
    <Icon
      name="message-plus"
      style={ThemedStyles.style.colorPrimaryBackground}
      size={32}
      testID={testID}
    />
  </View>
);

export default ChatNewButton;

const styles = ThemedStyles.create({
  iconContainer: [
    {
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
    },
    'bgLink',
  ],
  container: {
    position: 'absolute',
    bottom: 28,
    zIndex: 1000,
    right: 24,
  },
});

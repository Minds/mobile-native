import React from 'react';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import { ChatStoreType } from '../../chat/createChatStore';
import { DotIndicator } from 'react-native-reanimated-indicators';
import ThemedStyles from '../../styles/ThemedStyles';
import { View } from 'react-native';

type PropsType = {
  chat: ChatStoreType;
  onPress: () => void;
  size: number;
  style: any;
};

export default observer(function ChatButton({
  onPress,
  size,
  style,
  chat,
}: PropsType) {
  return chat.createInProgress ? (
    <View>
      <DotIndicator
        dotSize={5}
        color={ThemedStyles.getColor('PrimaryText')}
        scaleEnabled={true}
      />
    </View>
  ) : (
    <MIcon
      name="chat-bubble-outline"
      size={size}
      onPress={onPress}
      style={style}
    />
  );
});

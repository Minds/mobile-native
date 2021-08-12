import React from 'react';
import { observer } from 'mobx-react';
import { ChatStoreType } from '../../chat/createChatStore';
import { DotIndicator } from 'react-native-reanimated-indicators';
import ThemedStyles from '../../styles/ThemedStyles';
import { SafeAreaView, View } from 'react-native';
import SmallCircleButton from '../../common/components/SmallCircleButton';

const tinycolor = require('tinycolor2');

type PropsType = {
  chat: ChatStoreType;
  onPress: () => void;
  size: number;
  style?: any;
  color?: string;
  reverseColor?: string;
};

export default observer(function ChatButton({
  onPress,
  size,
  style,
  chat,
  color,
  reverseColor,
}: PropsType) {
  return (
    <SafeAreaView style={[styles.icon, style]}>
      {chat.createInProgress ? (
        <DotIndicator
          dotSize={5}
          color={reverseColor || ThemedStyles.getColor('PrimaryText')}
          scaleEnabled={true}
          containerStyle={{
            backgroundColor: tinycolor(color).lighten(30).toRgbString(),
            width: size * 2.1,
            height: size * 2.1,
            borderRadius: 100,
          }}
        />
      ) : (
        <SmallCircleButton
          name="chat-bubble"
          type="material"
          size={size}
          raised={false}
          color={color}
          reverseColor={reverseColor}
          onPress={onPress}
          style={[
            {
              margin: 0,
              padding: 0,
            },
            style,
          ]}
        />
      )}
    </SafeAreaView>
  );
});

const styles = ThemedStyles.create({
  icon: [
    { elevation: 5 },
    'shadowBlack',
    {
      borderRadius: 100,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.38,
      shadowRadius: 4.0,
      //   elevation: 16,
    },
  ],
});

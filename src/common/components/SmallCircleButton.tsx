import React from 'react';
import { Icon } from 'react-native-elements';
import ThemedStyles from '../../styles/ThemedStyles';

import type { StyleProp, GestureResponderEvent, ViewStyle } from 'react-native';

type PropsType = {
  name: string;
  type?: string;
  style?: StyleProp<ViewStyle>;
  size?: number;
  onPress: (event: GestureResponderEvent) => void;
};

const SmallCircleButton = (props: PropsType) => {
  return (
    <Icon
      raised
      reverse
      name={props.name}
      type={props.type || 'material-community'}
      color={ThemedStyles.getColor('secondary_background')}
      reverseColor={ThemedStyles.getColor('icon')}
      size={props.size || 16}
      onPress={props.onPress}
      containerStyle={props.style}
    />
  );
};

export default SmallCircleButton;

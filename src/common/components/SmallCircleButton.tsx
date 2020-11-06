import React from 'react';
import { Icon } from 'react-native-elements';
import ThemedStyles from '../../styles/ThemedStyles';

import type { StyleProp, GestureResponderEvent, ViewStyle } from 'react-native';

type PropsType = {
  name: string;
  style?: StyleProp<ViewStyle>;
  onPress: (event: GestureResponderEvent) => void;
};

const SmallCircleButton = (props: PropsType) => {
  return (
    <Icon
      raised
      reverse
      name={props.name}
      type="material-community"
      color={ThemedStyles.getColor('secondary_background')}
      reverseColor={ThemedStyles.getColor('icon')}
      size={13}
      onPress={props.onPress}
      containerStyle={props.style}
    />
  );
};

export default SmallCircleButton;

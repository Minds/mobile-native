import React from 'react';
import { Icon } from 'react-native-elements';
import ThemedStyles from '../../styles/ThemedStyles';

import type { StyleProp, GestureResponderEvent, ViewStyle } from 'react-native';

type PropsType = {
  name: string;
  type?: string;
  style?: StyleProp<ViewStyle>;
  size?: number;
  onPress?: (event: GestureResponderEvent) => void;
  reverseColor?: string;
  color?: string;
  raised?: boolean;
  iconStyle?: any;
};

const hitSlopInsets = { bottom: 10, top: 10, left: 10, right: 10 };

const SmallCircleButton = ({ raised = true, ...props }: PropsType) => {
  return (
    <Icon
      raised={raised}
      reverse
      name={props.name}
      type={props.type || 'material-community'}
      color={props.color || ThemedStyles.getColor('PrimaryBackground')}
      reverseColor={props.reverseColor || ThemedStyles.getColor('PrimaryText')}
      size={props.size || 18}
      onPress={props.onPress}
      containerStyle={props.style}
      iconStyle={props.iconStyle}
      hitSlop={hitSlopInsets}
    />
  );
};

export default SmallCircleButton;

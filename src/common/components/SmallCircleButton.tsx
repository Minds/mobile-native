import React from 'react';
import { Icon } from 'react-native-elements';

import type { StyleProp, ViewStyle } from 'react-native';
import sp from '~/services/serviceProvider';

type PropsType = {
  name: string;
  type?: string;
  style?: StyleProp<ViewStyle>;
  size?: number;
  onPress?: () => void;
  reverseColor?: string;
  color?: string;
  testID?: string;
  disabled?: boolean;
  raised?: boolean;
  iconStyle?: any;
};

const SmallCircleButton = ({ raised = true, testID, ...props }: PropsType) => {
  return (
    <Icon
      testID={testID}
      disabled={props.disabled}
      disabledStyle={{
        backgroundColor: props.color || sp.styles.getColor('PrimaryBackground'),
      }}
      raised={raised}
      reverse
      hitSlop={hitSlop}
      name={props.name}
      type={props.type || 'material-community'}
      color={props.color || sp.styles.getColor('PrimaryBackground')}
      reverseColor={props.reverseColor || sp.styles.getColor('PrimaryText')}
      size={props.size || 18}
      onPress={props.onPress}
      containerStyle={props.style}
      iconStyle={props.iconStyle}
    />
  );
};
const hitSlop = { top: 10, bottom: 10, left: 15, right: 15 };

export default SmallCircleButton;

import React from 'react';
import { Icon } from 'react-native-elements';
import ThemedStyles from '../../styles/ThemedStyles';

import type { StyleProp, ViewStyle } from 'react-native';

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
        backgroundColor:
          props.color || ThemedStyles.getColor('PrimaryBackground'),
      }}
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
    />
  );
};

export default SmallCircleButton;

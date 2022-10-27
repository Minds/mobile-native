import React from 'react';
import { ViewStyle } from 'react-native';
import { default as RNSwitch } from '@nghinv/react-native-switch';

import ThemedStyles from '~/styles/ThemedStyles';

type Props = {
  onChange?: (value: boolean) => void | null;
  value?: boolean;
  style?: ViewStyle;
};

/**
 * Switch component
 */
export default function Switch({ onChange, value, style }: Props) {
  return (
    <RNSwitch
      size={25}
      trackColor={{
        true: ThemedStyles.getColor('Link'),
        false: ThemedStyles.getColor('TertiaryBackground'),
      }}
      thumbColor={ThemedStyles.getColor('SecondaryText')}
      value={value}
      onChange={onChange}
      style={style}
    />
  );
}

import React from 'react';
import { ViewStyle } from 'react-native';
import { default as RNSwitch } from '@nghinv/react-native-switch';
import sp from '~/services/serviceProvider';

type Props = {
  onChange?: (value: boolean) => any;
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
        true: sp.styles.getColor('Link'),
        false: sp.styles.getColor('TertiaryBackground'),
      }}
      thumbColor={sp.styles.getColor('SecondaryText')}
      value={value}
      onChange={onChange}
      style={style}
    />
  );
}

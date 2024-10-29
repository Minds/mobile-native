import React from 'react';
import { StyleProp, Switch, ViewStyle } from 'react-native';
import sp from '~/services/serviceProvider';
type PropsType = {
  onValueChange: (value: boolean) => void;
  value: boolean;
  style?: StyleProp<ViewStyle>;
};

const Toggle = ({ onValueChange, value, style }: PropsType) => {
  return (
    <Switch
      trackColor={{ false: '#767577', true: sp.styles.getColor('Link') }}
      thumbColor={value ? '#ffffff' : '#f4f3f4'}
      ios_backgroundColor="#767577"
      onValueChange={onValueChange}
      value={value}
      style={style}
    />
  );
};

export default React.memo(Toggle);

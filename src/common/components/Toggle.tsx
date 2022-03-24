import React from 'react';
import { Switch } from 'react-native';

type PropsType = {
  onValueChange: (value: boolean) => void;
  value: boolean;
};

const Toggle = ({ onValueChange, value }: PropsType) => {
  return (
    <Switch
      trackColor={{ false: '#767577', true: '#1B85D6' }}
      thumbColor={value ? '#ffffff' : '#f4f3f4'}
      ios_backgroundColor="#767577"
      onValueChange={onValueChange}
      value={value}
    />
  );
};

export default Toggle;

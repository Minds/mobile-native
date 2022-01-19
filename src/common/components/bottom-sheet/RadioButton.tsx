import React from 'react';
import MenuItem from './MenuItem';

type PropsType = {
  title: string;
  iconSize?: number;
  selected: boolean;
  onPress?: () => void;
};

export default function RadioButton(props: PropsType) {
  return (
    <MenuItem
      {...props}
      iconName={props.selected ? 'ios-radio-button-on' : 'ios-radio-button-off'}
      iconType="ionicon"
    />
  );
}

import React from 'react';
import MenuItem from './MenuItem';

type PropsType = {
  title: string;
  iconSize?: number;
  selected: boolean;
  onPress: () => void;
};

/**
 * BottomSheet Checkbox
 */
export default function CheckButton(props: PropsType) {
  return (
    <MenuItem
      {...props}
      iconName={props.selected ? 'checkbox-outline' : 'square-outline'}
      iconType="ionicon"
    />
  );
}

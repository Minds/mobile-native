import React from 'react';
import BottomSheetMenuItem from './BottomSheetMenuItem';

type PropsType = {
  title: string;
  iconSize?: number;
  selected: boolean;
  testID?: string;
  onPress?: () => void;
};

export default function RadioButton(props: PropsType) {
  return (
    <BottomSheetMenuItem
      {...props}
      iconName={props.selected ? 'ios-radio-button-on' : 'ios-radio-button-off'}
      iconType="ionicon"
    />
  );
}

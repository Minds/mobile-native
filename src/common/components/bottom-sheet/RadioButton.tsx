import React from 'react';
import BottomSheetMenuItem from './BottomSheetMenuItem';

export type RadioButtonProps = {
  title: string;
  iconSize?: number;
  selected: boolean;
  testID?: string;
  onPress?: () => void;
};

export default function RadioButton(props: RadioButtonProps) {
  return (
    <BottomSheetMenuItem
      {...props}
      iconName={props.selected ? 'radio-button-on' : 'radio-button-off'}
      iconType="ionicon"
    />
  );
}

import React from 'react';
import BottomSheetMenuItem from './BottomSheetMenuItem';

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
    <BottomSheetMenuItem
      {...props}
      iconName={props.selected ? 'checkbox-outline' : 'square-outline'}
      iconType="ionicon"
    />
  );
}

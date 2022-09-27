import React from 'react';
import MenuItem, { MenuItemProps } from './MenuItem';

type MenuItemOptionProps = MenuItemProps & {
  selected?: boolean;
  /**
   * whether the option should use radio icons instead of check
   */
  mode?: 'radio' | 'checkbox' | 'check';
};

export default function MenuItemOption(props: MenuItemOptionProps) {
  let icon;

  switch (props.mode) {
    case 'radio':
      icon = props.selected ? 'radio-button-on' : 'radio-button-off';
      break;
    case 'checkbox':
      icon = props.selected ? 'checkbox-marked' : 'checkbox-blank';
      break;
    case 'check':
    default:
      icon = props.selected ? 'check' : undefined;
  }

  return (
    <MenuItem
      {...props}
      icon={icon}
      noIcon={!props.mode && !props.selected}
      iconColor={props.selected ? 'IconActive' : props.iconColor}
    />
  );
}

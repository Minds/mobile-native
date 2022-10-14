import React from 'react';
import Toggle from '../Toggle';
import MenuItem, { MenuItemProps } from './MenuItem';

type MenuItemToggleProps = MenuItemProps & {
  value?: boolean;
  onChange: (value: boolean) => void;
};

export default function MenuItemToggle({
  value,
  onChange,
  ...props
}: MenuItemToggleProps) {
  return (
    <MenuItem
      {...props}
      onPress={() => onChange(!value)}
      icon={<Toggle onValueChange={onChange} value={Boolean(value)} />}
    />
  );
}

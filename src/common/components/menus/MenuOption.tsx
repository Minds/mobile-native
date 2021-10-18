import React from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import MenuItem, { MenuItemPropsType } from './MenuItem';

type MenuOptionPropsType = MenuItemPropsType & { selected: boolean };

export default function MenuOption(props: MenuOptionPropsType) {
  props.item.icon = props.selected
    ? { name: 'radio-button-on', color: ThemedStyles.getColor('IconActive') }
    : { name: 'radio-button-off' };
  return <MenuItem {...props} />;
}

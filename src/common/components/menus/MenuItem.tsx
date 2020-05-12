import React from 'react';

import { ListItem } from 'react-native-elements';
import ThemedStyles from '../../../styles/ThemedStyles';

export type MenuItemPropsType = {
  item: {
    onPress: () => void;
    title: string;
    icon?: any;
    noIcon?: boolean;
  };
};

export default function ({ item }: MenuItemPropsType) {
  const theme = ThemedStyles.style;

  // ListItem Container Style
  const containerStyle = [
    theme.backgroundSecondary,
    theme.borderTopHair,
    theme.borderBottomHair,
    theme.borderPrimary,
    theme.padding0x,
    theme.paddingHorizontal4x,
  ];

  // ListItem Title Style
  const titleStyle = [
    theme.colorPrimaryText,
    theme.paddingVertical3x,
    { fontSize: 17 },
  ];

  // ListItem Chevron Style
  const chevronStyle = item.noIcon
    ? undefined
    : { ...theme.colorIcon, size: 24, ...item.icon };

  return (
    <ListItem
      title={item.title}
      onPress={item.onPress}
      containerStyle={containerStyle}
      titleStyle={titleStyle}
      chevron={chevronStyle}
    />
  );
}

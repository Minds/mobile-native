import React from 'react';

import { ListItem } from 'react-native-elements';
import ThemedStyles from '../../../styles/ThemedStyles';

export type MenuItemPropsType = {
  item: {
    onPress: () => void;
    title: string | JSX.Element;
    icon?:
      | {
          name: string;
          type: string;
        }
      | JSX.Element;
    noIcon?: boolean;
  };
  component?: any;
  backgroundPrimary?: boolean;
  testID?: string;
};

export default function ({
  item,
  component,
  backgroundPrimary,
  testID,
}: MenuItemPropsType) {
  const theme = ThemedStyles.style;

  // ListItem Container Style
  const containerStyle = [
    backgroundPrimary ? theme.backgroundPrimary : theme.backgroundSecondary,
    theme.borderTopHair,
    theme.borderBottomHair,
    theme.borderPrimary,
    theme.padding0x,
    theme.paddingHorizontal4x,
  ];

  // ListItem Chevron Style
  const chevronStyle = item.noIcon
    ? undefined
    : { ...theme.colorIcon, size: 24, ...item.icon };

  return (
    <ListItem
      Component={component}
      title={item.title}
      onPress={item.onPress}
      containerStyle={containerStyle}
      titleStyle={theme.listItemTitle}
      chevron={chevronStyle}
      testID={testID}
    />
  );
}

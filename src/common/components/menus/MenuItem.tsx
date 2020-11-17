import React from 'react';
import { TextStyle } from 'react-native';

import { ListItem } from 'react-native-elements';
import ThemedStyles from '../../../styles/ThemedStyles';

export type MenuItemItem = {
  onPress?: () => void;
  title: string | JSX.Element;
  icon?:
    | {
        name: string;
        type?: string;
        color?: string;
      }
    | JSX.Element;
  noIcon?: boolean;
};

export type MenuItemPropsType = {
  item: MenuItemItem;
  component?: any;
  containerItemStyle?: {} | [];
  titleStyle?: TextStyle | Array<TextStyle>;
  testID?: string;
};

export default function ({
  item,
  component,
  containerItemStyle,
  titleStyle,
  testID,
}: MenuItemPropsType) {
  const theme = ThemedStyles.style;

  // ListItem Container Style
  const containerStyle = [
    theme.backgroundSecondary,
    theme.borderTopHair,
    theme.borderBottomHair,
    theme.borderPrimary,
    theme.padding0x,
    theme.paddingHorizontal4x,
    containerItemStyle,
  ];

  // icon is element?
  const isIconElement = item.icon && !('name' in item.icon);

  // ListItem Chevron Style
  let chevronStyle: undefined | object;
  if (!item.noIcon && !isIconElement) {
    chevronStyle = {
      ...theme.colorIcon,
      size: 24,
      type: 'ionicon',
      name: 'chevron-forward',
    };

    if (item.icon && !isIconElement) {
      chevronStyle = { ...chevronStyle, ...item.icon };
    }
  }

  return (
    <ListItem
      Component={component}
      onPress={item.onPress}
      containerStyle={containerStyle}
      testID={testID}>
      <ListItem.Content>
        <ListItem.Title style={[theme.listItemTitle, titleStyle]}>
          {item.title}
        </ListItem.Title>
      </ListItem.Content>
      {chevronStyle && <ListItem.Chevron {...chevronStyle} />}
      {isIconElement && item.icon}
    </ListItem>
  );
}

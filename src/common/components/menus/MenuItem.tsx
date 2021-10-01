import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { ListItem } from 'react-native-elements';
import ThemedStyles, { useMemoStyle } from '../../../styles/ThemedStyles';

export type MenuItemItem = {
  onPress?: () => void;
  title: string | React.ReactNode;
  icon?:
    | {
        name: string;
        type?: string;
        color?: string;
      }
    | React.ReactNode;
  noIcon?: boolean;
};

export type MenuItemPropsType = {
  item: MenuItemItem;
  component?: any;
  containerItemStyle?: StyleProp<ViewStyle>;
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
  const containerStyle = useMemoStyle(() => {
    const stylesList: any = [
      'bgSecondaryBackground',
      'borderTop1x',
      'borderBottom1x',
      'bcolorPrimaryBorder',
      'padding0x',
      'paddingHorizontal4x',
    ];
    if (containerItemStyle) stylesList.push(containerItemStyle);
    return stylesList;
  }, [containerItemStyle]);

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
      underlayColor="transparent"
      testID={testID}>
      <ListItem.Content>
        <ListItem.Title style={[baseTitleStyle, titleStyle]}>
          {item.title}
        </ListItem.Title>
      </ListItem.Content>
      {chevronStyle && <ListItem.Chevron {...chevronStyle} />}
      {isIconElement && item.icon}
    </ListItem>
  );
}

const baseTitleStyle = ThemedStyles.combine(
  {
    paddingVertical: 15,
    fontSize: 17,
  },
  'colorPrimaryText',
);

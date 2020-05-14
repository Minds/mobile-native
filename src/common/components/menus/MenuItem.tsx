import React from 'react';

import { ListItem } from 'react-native-elements';
import ThemedStyles from '../../../styles/ThemedStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';

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
  component?: 'ListItem' | 'Touchable';
};

export default function ({ item, component = 'ListItem' }: MenuItemPropsType) {
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

  // ListItem Chevron Style
  const chevronStyle = item.noIcon
    ? undefined
    : { ...theme.colorIcon, size: 24, ...item.icon };

  let render: JSX.Element;
  if (component === 'ListItem') {
    render = (
      <ListItem
        title={item.title}
        onPress={item.onPress}
        containerStyle={containerStyle}
        titleStyle={theme.listItemTitle}
        chevron={chevronStyle}
      />
    );
  } else {
    let icon =
      !item.noIcon && React.isValidElement(item.icon) ? item.icon : null;

    render = (
      <TouchableOpacity onPress={item.onPress} style={containerStyle}>
        <View style={[theme.rowJustifySpaceBetween, theme.alignCenter]}>
          <Text style={theme.listItemTitle}>{item.title}</Text>
          {icon}
        </View>
      </TouchableOpacity>
    );
  }

  return render;
}

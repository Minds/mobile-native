//@ts-nocheck
import React from 'react';

import { ListItem } from 'react-native-elements';
import ThemedStyles from '../styles/ThemedStyles';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ({ item, i }) {
  const theme = ThemedStyles.style;

  // ListItem Container Style
  const containerStyle = [
    theme.backgroundSecondary,
    theme.borderTopHair,
    theme.borderBottomHair,
    theme.borderPrimary,
    styles.containerPadding,
  ];

  // ListItem Title Style
  const titleStyle = [
    theme.colorSecondaryText,
    { fontSize: 17 },
    theme.paddingLeft,
  ];

  // ListItem Chevron Style
  const chevronStyle = { ...theme.colorIcon, size: 24, ...item.icon };

  return (
    <ListItem
      key={i}
      title={item.title}
      onPress={item.onPress}
      containerStyle={containerStyle}
      titleStyle={titleStyle}
      chevron={chevronStyle}
    />
  );
}

const styles = {
  containerPadding: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
};

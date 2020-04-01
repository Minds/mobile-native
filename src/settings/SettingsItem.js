//@ts-nocheck
import React from 'react';

import { ListItem } from 'react-native-elements'
import ThemedStyles from '../styles/ThemedStyles';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

export default function({ item, i }) {
  const CS = ThemedStyles.style;

  return (
    <ListItem
      key={i}
      title={item.title}
      onPress={item.onPress}
      containerStyle={[CS.backgroundSecondary, CS.borderTopHair, CS.borderBottomHair, CS.borderPrimary, styles.containerPadding]}
      titleStyle={[CS.colorSecondaryText, CS.fontL, CS.paddingLeft]}
      chevron={{...CS.colorIcon, size: 24}}
    />
  )
}

const styles = {
  containerPadding: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
};
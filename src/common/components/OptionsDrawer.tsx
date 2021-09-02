//@ts-nocheck
import React from 'react';
import { View, FlatList } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import ThemedStyles from '../../styles/ThemedStyles';

export default function ({ navigation, route }) {
  if (!route.params.options) {
    return null;
  }
  const theme = ThemedStyles.style;

  const list = route.params.options(navigation, route).filter(r => r);

  const innerWrapper = [
    theme.borderBottomHair,
    theme.bcolorPrimaryBorder,
    theme.marginTop4x,
    theme.bgSecondaryBackground,
  ];

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <View style={innerWrapper}>
        <FlatList
          data={list}
          renderItem={MenuItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

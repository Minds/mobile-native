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

  const innerWrapper = [theme.borderBottomHair, theme.bcolorPrimaryBorder];

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <View style={innerWrapper}>
        <FlatList
          data={list}
          renderItem={MenuItem}
          style={[theme.bgPrimaryBackground, theme.paddingTop4x]}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

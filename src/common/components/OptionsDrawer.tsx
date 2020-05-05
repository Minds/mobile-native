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

  const list = route.params.options(navigation);

  const innerWrapper = [theme.borderBottomHair, theme.borderPrimary];

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <View style={innerWrapper}>
        <FlatList
          data={list}
          renderItem={MenuItem}
          style={[theme.backgroundPrimary, theme.paddingTop4x]}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

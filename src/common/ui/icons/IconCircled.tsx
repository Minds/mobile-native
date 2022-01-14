import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, IIcon } from './Icon';
import {
  ICON_BACKGROUND,
  ICON_COLOR_ACTIVE,
  ICON_COLOR_DEFAULT,
  UNIT,
} from '~styles/Tokens';
import { getSpacingStylesNext } from '~ui/helpers';
import ThemedStyles from '~styles/ThemedStyles';

export function IconCircled({ style, active, ...extra }: IIcon) {
  const background = active
    ? ThemedStyles.getColor(ICON_COLOR_ACTIVE)
    : ThemedStyles.getColor(ICON_BACKGROUND);

  const color = active ? 'White' : ICON_COLOR_DEFAULT;

  const containerStyles: any = [
    styles.container,
    { backgroundColor: background },
  ];

  const extraStyles = getSpacingStylesNext(extra);

  if (extraStyles?.length) {
    containerStyles.push(...extraStyles);
  }

  if (style) {
    containerStyles.push(style);
  }
  return (
    <View style={containerStyles}>
      <Icon color={color} nested {...extra} space="XS" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 200,
    padding: UNIT.S * 0.8,
  },
});

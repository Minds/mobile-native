import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { IIcon } from './Icon';
import {
  ICON_BACKGROUND,
  ICON_SIZE_DEFAULT,
  ICON_COLOR_ACTIVE,
  ICON_COLOR_DEFAULT,
  IUISizing,
  UNIT,
} from '~styles/Tokens';
import { getPropStyles } from '~ui/helpers';
import ThemedStyles from '~styles/ThemedStyles';

export default function IconCircled({ style, active, ...extra }: IIcon) {
  const background = active
    ? ThemedStyles.getColor(ICON_COLOR_ACTIVE)
    : ThemedStyles.getColor(ICON_BACKGROUND);

  const color = active ? 'White' : ICON_COLOR_DEFAULT;

  const containerStyles: any = [
    styles.container,
    { backgroundColor: background },
  ];

  let size: IUISizing | number = ICON_SIZE_DEFAULT;

  const extraStyles = getPropStyles(extra);

  if (extraStyles?.length) {
    containerStyles.push(...extraStyles);
  }

  if (style) {
    containerStyles.push(style);
  }

  if (extra?.size) {
    size = extra.size;
  }

  containerStyles.push(styles[size]);

  return (
    <View style={containerStyles}>
      <Icon color={color} nested {...extra} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 200,
  },
  micro: {
    padding: UNIT.XS,
  },
  tiny: {
    padding: UNIT.XS,
  },
  small: {
    padding: UNIT.S,
  },
  medium: {
    padding: UNIT.S,
  },
  large: {
    padding: UNIT.M,
  },
  huge: {
    padding: UNIT.L,
  },
});

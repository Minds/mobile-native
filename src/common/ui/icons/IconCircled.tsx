import React from 'react';
import { View, ColorValue } from 'react-native';
import { Icon, IIcon } from './Icon';
import {
  ICON_BACKGROUND,
  ICON_COLOR_ACTIVE,
  ICON_COLOR_DEFAULT,
  UNIT,
} from '~styles/Tokens';
import { getSpacingStylesNext } from '~ui/helpers';

import sp from '~/services/serviceProvider';

export function IconCircled({
  style,
  active,
  backgroundColor,
  ...extra
}: IIcon & { active?: boolean; backgroundColor?: ColorValue }) {
  const background = backgroundColor
    ? backgroundColor
    : active
    ? sp.styles.getColor(ICON_COLOR_ACTIVE)
    : sp.styles.getColor(ICON_BACKGROUND);

  const color = active ? 'White' : ICON_COLOR_DEFAULT;

  const containerStyles: any = [
    {
      overflow: 'hidden',
      borderRadius: 200,
      padding: UNIT.S * 1.3,
      backgroundColor: background,
    },
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

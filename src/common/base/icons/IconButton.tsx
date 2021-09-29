import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon, { IIcon } from './Icon';
import { ICON_SIZES, ICON_SIZE_DEFAULT, IUISizing } from '~styles/Tokens';
import { getNumericSize, getPropStyles } from '~base/helpers';

const SLOP_PROP = 1 / 3;

export interface IIconButton extends IIcon {
  onPress: () => void;
}

export default function IconButton({ onPress, style, ...extra }: IIconButton) {
  const containerStyles: any = [styles.container];
  let size: IUISizing | number = 'medium';

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

  const sizeNumeric =
    getNumericSize(size, ICON_SIZES, ICON_SIZE_DEFAULT) * SLOP_PROP;

  const onStyle = ({ pressed }: any) => {
    const _styles = [...containerStyles];
    if (pressed === true) {
      _styles.push(styles.pressed);
    }
    return _styles;
  };

  return (
    <Pressable hitSlop={sizeNumeric} style={onStyle} onPress={onPress}>
      <Icon nested {...extra} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.75,
  },
});

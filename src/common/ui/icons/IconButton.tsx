import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon, { IIcon } from './Icon';
import { ICON_SIZES, ICON_SIZE_DEFAULT, IUISizing } from '~styles/Tokens';
import { getNumericSize, getPropStyles } from '~ui/helpers';
import { useStyle, StyleOrCustom } from '~styles/ThemedStyles';

const SLOP_PROP = 1 / 3;

export interface IIconButton extends IIcon {
  onPress: () => void;
}

export default function IconButton({ onPress, style, ...extra }: IIconButton) {
  const containerStyles: StyleOrCustom[] = [styles.container];
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
    if (pressed === true) {
      return styles.pressed;
    }
    return null;
  };

  return (
    <View style={useStyle(...containerStyles)}>
      <Pressable hitSlop={sizeNumeric} style={onStyle} onPress={onPress}>
        <Icon nested {...extra} />
      </Pressable>
    </View>
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

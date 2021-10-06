import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon, { IIcon } from './Icon';
import { ICON_SIZES, ICON_SIZE_DEFAULT, IUISizing } from '~styles/Tokens';
import { getNumericSize, getPropStyles } from '~ui/helpers';
import { useMemoStyle, StyleOrCustom } from '~styles/ThemedStyles';
import PressableScale from '~/common/components/PressableScale';

const SLOP_PROP = 1 / 3;

export interface IIconButton extends IIcon {
  onPress: () => void;
}

export default function IconButton({
  onPress,
  style,
  testID,
  ...extra
}: IIconButton) {
  const containerStyles: StyleOrCustom[] = [styles.container];
  let size: IUISizing | number | string = 'medium';

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
    <View style={useMemoStyle(containerStyles, [style])}>
      <PressableScale
        hitSlop={sizeNumeric}
        style={onStyle}
        onPress={onPress}
        testID={testID}>
        <Icon nested {...extra} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Icon, { IIcon } from './Icon';
import { ICON_SIZES, ICON_SIZE_DEFAULT, IUISizing } from '~styles/Tokens';
import { getNumericSize, getPropStyles } from '~ui/helpers';
import { useMemoStyle, StyleOrCustom } from '~styles/ThemedStyles';
import PressableScale from '~/common/components/PressableScale';

const SLOP_PROP = 1 / 3;

export interface IIconButton extends IIcon {
  onPress: () => void;
  scale?: boolean;
}

export default function IconButton({
  onPress,
  style,
  testID,
  scale,
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

  const PressableComponent = scale ? PressableScale : Pressable;

  return (
    <View style={useMemoStyle(containerStyles, [style])}>
      <PressableComponent
        hitSlop={sizeNumeric}
        style={onStyle}
        onPress={onPress}
        testID={testID}>
        <Icon nested {...extra} />
      </PressableComponent>
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

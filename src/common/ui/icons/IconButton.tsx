import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable, InteractionManager } from 'react-native';
import Icon, { IIcon } from './Icon';
import { ICON_SIZES, ICON_SIZE_DEFAULT, IUISizing } from '~styles/Tokens';
import { getNumericSize, getPropStyles } from '~ui/helpers';
import { useMemoStyle, StyleOrCustom } from '~styles/ThemedStyles';
import PressableScale from '~/common/components/PressableScale';
import withSpacer from '~ui/spacer/withSpacer';

const SLOP_PROP = 1 / 3;

export interface IIconButton extends IIcon {
  onPress: () => void;
  scale?: boolean;
  extra?: any;
}

export const IconButtonSpaced = withSpacer(IconButton);

export default function IconButton({
  onPress,
  style,
  testID,
  scale,
  extra,
  ...more
}: IIconButton) {
  const containerStyles: StyleOrCustom[] = [styles.container];
  let size: IUISizing | number | string = 'huge';

  const extraStyles = getPropStyles(more);

  if (extraStyles?.length) {
    containerStyles.push(...extraStyles);
  }

  if (style) {
    containerStyles.push(style);
  }

  if (more?.size) {
    size = more.size;
  }

  containerStyles.push(styles[size]);

  const sizeNumeric =
    getNumericSize(size, ICON_SIZES, ICON_SIZE_DEFAULT) * SLOP_PROP;

  const onStyle = ({ pressed }: any) => {
    if (pressed === true) {
      return styles.pressed;
    }
  };

  const PressableComponent = scale ? PressableScale : Pressable;

  // Breather
  const handlePress = useCallback(() => {
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(onPress);
    });
  }, [onPress]);

  return (
    <View style={useMemoStyle(containerStyles, [style])}>
      <PressableComponent
        hitSlop={sizeNumeric}
        style={onStyle}
        onPress={handlePress}
        testID={testID}>
        <View style={styles.wrapper}>
          <Icon nested {...more} />
          {extra}
        </View>
      </PressableComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

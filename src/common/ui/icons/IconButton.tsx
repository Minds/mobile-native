import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  InteractionManager,
  ViewStyle,
} from 'react-native';
import Icon, { IIcon, IIconNext, IconNext } from './Icon';
import { ICON_SIZES, ICON_SIZE_DEFAULT, IUISizing } from '~styles/Tokens';
import { getNumericSize, getPropStyles } from '~ui/helpers';
import PressableScale from '~/common/components/PressableScale';
import withSpacer from '~ui/spacer/withSpacer';

const SLOP_PROP = 1 / 3;

export interface IIconButton extends IIcon {
  onPress: () => void;
  scale?: boolean;
  fill?: boolean;
  extra?: any;
}

export interface IIconButtonNext extends IIconNext {
  onPress: () => void;
  scale?: boolean;
  style?: ViewStyle | any;
  extra?: any;
  fill?: boolean;
}

export const IconButtonNext = ({
  onPress,
  testID,
  style,
  scale,
  extra,
  fill,
  ...more
}: IIconButtonNext) => {
  const size: IUISizing | any = more?.size || 'medium';

  const containerStyles = useMemo(() => {
    const styleArray = [styles.container, styles[size]];

    if (style) {
      styleArray.push(style);
    }
    return styleArray;
  }, [size, style]);

  const sizeNumeric = useMemo(() => {
    return getNumericSize(size, ICON_SIZES, ICON_SIZE_DEFAULT) * SLOP_PROP;
  }, [size]);

  const onStyle = ({ pressed }: any) => {
    if (fill) {
      if (pressed === true) {
        return [styles.pressed, styles.fill];
      }
      return [styles.released, styles.fill];
    }
    if (pressed === true) {
      return styles.pressed;
    }
    return styles.released;
  };

  const PressableComponent = scale ? PressableScale : Pressable;

  // Breather
  const handlePress = useCallback(() => {
    InteractionManager.runAfterInteractions(onPress);
  }, [onPress]);

  return (
    <View style={containerStyles}>
      <PressableComponent
        hitSlop={sizeNumeric}
        style={onStyle}
        onPress={handlePress}
        testID={testID}>
        <View style={styles.wrapper}>
          <IconNext nested {...more} />
          {extra}
        </View>
      </PressableComponent>
    </View>
  );
};

export const IconButtonNextSpaced = withSpacer(IconButtonNext);

export default function IconButton({
  onPress,
  style,
  testID,
  scale,
  fill,
  extra,
  ...more
}: IIconButton) {
  const size: IUISizing | number | string = more?.size || 'medium';

  const containerStyles = useMemo(() => {
    const stylesObj = [styles.container, styles[size]];
    const extraStyles = getPropStyles(more);

    if (extraStyles?.length) {
      stylesObj.push(...extraStyles);
    }

    if (style) {
      stylesObj.push(style);
    }

    stylesObj.push(styles[size]);

    return stylesObj;
  }, [size, more, style]);

  const sizeNumeric = useMemo(() => {
    return getNumericSize(size, ICON_SIZES, ICON_SIZE_DEFAULT) * SLOP_PROP;
  }, [size]);

  const onStyle = ({ pressed }: any) => {
    if (fill) {
      if (pressed === true) {
        return [styles.pressed, styles.fill];
      }
      return [styles.released, styles.fill];
    }
    if (pressed === true) {
      return styles.pressed;
    }
    return styles.released;
  };

  const PressableComponent = scale ? PressableScale : Pressable;

  // Breather
  const handlePress = useCallback(() => {
    InteractionManager.runAfterInteractions(onPress);
  }, [onPress]);

  return (
    <View style={containerStyles}>
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
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  released: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  pressed: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.75,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { withSpacer } from '~ui/layout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import ICON_MAP, { IconMapNameType } from './map';
import {
  ICON_DEFAULT,
  ICON_SIZES,
  ICON_SIZE_DEFAULT,
  ICON_COLOR_DEFAULT,
  ICON_COLOR_ACTIVE,
  ICON_COLOR_DISABLED,
  UIIconSizeType,
  UIBaseType,
  UISpacingPropType,
  ICON_COLOR_LIGHT,
} from '~styles/Tokens';
import { ColorsNameType } from '~styles/Colors';
import {
  getSpacingStylesNext,
  getNumericSize,
  getNamedSize,
} from '~ui/helpers';
import { getIconColor } from './helpers';

const Fonts = {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  IonIcon,
  EvilIcons,
  Fontisto,
  Entypo,
  Feather,
};

export type IIconSize = UIIconSizeType | number | string;
export type IIconColor = ColorsNameType;

export interface IIcon extends UIBaseType {
  color?: ColorsNameType;
  activeColor?: ColorsNameType;
  name: IconMapNameType;
  size?: IIconSize;
  style?: ViewStyle | any;
  active?: boolean;
  disabled?: boolean;
  disabledColor?: ColorsNameType;
  light?: boolean;
  shadow?: boolean;
  lightColor?: ColorsNameType;
}

export function Icon({
  color,
  name = ICON_DEFAULT,
  size = ICON_SIZE_DEFAULT,
  style,
  active = false,
  activeColor = ICON_COLOR_ACTIVE,
  disabled = false,
  disabledColor = ICON_COLOR_DISABLED,
  light = false,
  lightColor = ICON_COLOR_LIGHT,
  shadow = false,
  nested = false,
  testID,
  ...common
}: IIcon & UISpacingPropType) {
  const {
    font: iconFont,
    name: iconName,
    ratio = 1,
    transform,
  } = ICON_MAP[name] || ICON_MAP[ICON_DEFAULT];
  const iconStyles: TextStyle[] = [];

  if (shadow) {
    iconStyles.push(styles.shadow);
  }

  // gets the numeric size value from the legacy number and current string alternative
  const sizeNumeric = useMemo(() => {
    return getNumericSize(size, ICON_SIZES, ICON_SIZE_DEFAULT);
  }, [size]);

  // get the string name from the legacy numbered size
  const sizeNamed = useMemo(() => {
    return getNamedSize(size, ICON_SIZES, ICON_SIZE_DEFAULT);
  }, [size]);

  // if the color is set, it returns it on top of it all -- rejecting the disabled and active states
  // otherwise keeps the default colors
  const iconColor = useMemo(() => {
    return getIconColor({
      color,
      active,
      activeColor,
      disabled,
      disabledColor,
      light,
      lightColor,
      defaultColor: ICON_COLOR_DEFAULT,
    });
  }, [color, active, activeColor, disabled, disabledColor, light, lightColor]);

  // realSize is an icon reducer alternative to keep icon proportion between font-families
  const realSize = sizeNumeric * ratio;

  // const containerStyles: ViewStyle[] = [styles.container, styles[sizeNamed]];
  // nested is used to discard the container styles when it is nested inside another base component
  const containerStyles = useMemo(() => {
    const base = [styles[sizeNamed]];
    const extra = !nested ? getSpacingStylesNext(common) : null;
    if (extra) {
      base.push(extra);
    }

    if (style) {
      base.push(style);
    }

    if (transform) {
      base.push({ transform });
    }

    return base;
  }, [nested, common, sizeNamed, style, transform]);

  const Component = Fonts[iconFont];

  return (
    <View style={containerStyles}>
      <Component
        style={StyleSheet.flatten(iconStyles)}
        name={iconName}
        size={realSize}
        color={iconColor}
        testID={testID}
      />
    </View>
  );
}

export interface IIconNext extends UIBaseType {
  color?: ColorsNameType;
  name: IconMapNameType;
  size?: UIIconSizeType;
  active?: boolean;
  light?: boolean;
  disabled?: boolean;
  shadow?: boolean;
}

function IconNextComponent({
  color,
  name = ICON_DEFAULT,
  size = ICON_SIZE_DEFAULT,
  active = false,
  disabled = false,
  light = false,
  shadow = false,
  testID,
}: IIconNext) {
  const {
    font: iconFont,
    name: iconName,
    ratio = 1,
    top,
  } = ICON_MAP[name] || ICON_MAP[ICON_DEFAULT];

  const iconStyles: TextStyle[] = [];

  if (shadow) {
    iconStyles.push(styles.shadow);
  }

  const sizeNumeric = ICON_SIZES[size] || ICON_SIZES[ICON_SIZE_DEFAULT];

  const iconColor = getIconColor({
    color,
    active,
    activeColor: ICON_COLOR_ACTIVE,
    disabled,
    disabledColor: ICON_COLOR_DISABLED,
    light,
    lightColor: ICON_COLOR_LIGHT,
    defaultColor: ICON_COLOR_DEFAULT,
  });

  const realSize = sizeNumeric * ratio;

  let iconStyle;

  if (top) {
    // we can use a simple global memoization here
    iconStyle = shadow
      ? { marginTop: top, ...styles.shadow }
      : { marginTop: top };
  } else {
    iconStyle = shadow ? styles.shadow : undefined;
  }

  const Component = Fonts[iconFont];

  return (
    <View style={styles[size]}>
      <Component
        name={iconName}
        style={iconStyle}
        size={realSize}
        color={iconColor}
        testID={testID}
      />
    </View>
  );
}

export const IconNext = withSpacer(IconNextComponent);

const styles = StyleSheet.create({
  micro: {
    width: ICON_SIZES.micro,
    height: ICON_SIZES.micro,
  },
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
  tiny: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: ICON_SIZES.tiny,
    height: ICON_SIZES.tiny,
  },
  small: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: ICON_SIZES.small,
    height: ICON_SIZES.small,
  },
  medium: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: ICON_SIZES.medium,
    height: ICON_SIZES.medium,
  },
  large: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
  },
  huge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: ICON_SIZES.huge,
    height: ICON_SIZES.huge,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import ICON_MAP from './map';
import {
  ICON_DEFAULT,
  ICON_SIZES,
  ICON_SIZE_DEFAULT,
  ICON_COLOR_DEFAULT,
  ICON_COLOR_ACTIVE,
  ICON_COLOR_DISABLED,
  IUISizing,
  IUIBase,
} from '~styles/Tokens';
import { ColorsNameType } from '~styles/Colors';
import { getPropStyles, getNumericSize, getNamedSize } from '~ui/helpers';
import { getIconColor } from './helpers';
import { useStyle, StyleOrCustom } from '~styles/ThemedStyles';

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

export interface IIcon extends IUIBase {
  color?: ColorsNameType | null;
  activeColor?: ColorsNameType;
  name: string;
  size?: IUISizing | number;
  style?: StyleOrCustom;
  active?: boolean;
  disabled?: boolean;
  disabledColor?: ColorsNameType;
}

function Icon({
  color = null,
  name = ICON_DEFAULT,
  size = ICON_SIZE_DEFAULT,
  style,
  active = false,
  activeColor = ICON_COLOR_ACTIVE,
  disabled = false,
  disabledColor = ICON_COLOR_DISABLED,
  nested = false,
  ...common
}: IIcon) {
  const { font: iconFont, name: iconName, ratio = 1 } =
    ICON_MAP[name] || ICON_MAP[ICON_DEFAULT];

  // gets the numeric size value from the legacy number and current string alternative
  const sizeNumeric = getNumericSize(size, ICON_SIZES, ICON_SIZE_DEFAULT);
  // get the string name from the legacy numbered size
  const sizeNamed = getNamedSize(size, ICON_SIZES, ICON_SIZE_DEFAULT);

  // if the color is set, it returns it on top of it all -- rejecting the disabled and active states
  // otherwise keeps the default colors
  const iconColor = getIconColor({
    color,
    active,
    activeColor,
    disabled,
    disabledColor,
    defaultColor: ICON_COLOR_DEFAULT,
  });

  // realSize is an icon reducer alternative to keep icon proportion between font-families
  const realSize = sizeNumeric * ratio;
  const containerStyles: StyleOrCustom[] = [
    styles.container,
    styles[sizeNamed],
  ];
  // nested is used to discard the container styles when it is nested inside another base component
  const extraStyles = !nested ? getPropStyles(common) : null;
  const Component = Fonts[iconFont];

  if (extraStyles?.length) {
    containerStyles.push(...extraStyles);
  }

  if (style) {
    containerStyles.push(style);
  }

  return (
    <View style={useStyle(...containerStyles)}>
      <Component name={iconName} size={realSize} color={iconColor} />
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
  micro: {
    width: ICON_SIZES.micro,
    height: ICON_SIZES.micro,
  },
  tiny: {
    width: ICON_SIZES.tiny,
    height: ICON_SIZES.tiny,
  },
  small: {
    width: ICON_SIZES.small,
    height: ICON_SIZES.small,
  },
  medium: {
    width: ICON_SIZES.medium,
    height: ICON_SIZES.medium,
  },
  large: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
  },
  huge: {
    width: ICON_SIZES.huge,
    height: ICON_SIZES.huge,
  },
});

export default Icon;

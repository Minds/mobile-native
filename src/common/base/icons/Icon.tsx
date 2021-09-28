import React from 'react';
import {
  ViewStyle,
  FlexStyle,
  TextStyle,
  StyleProp,
  View,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
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
import { getPropStyles, getNumericSize } from '~base/helpers';
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
};

export interface IIcon extends IUIBase {
  color?: ColorsNameType;
  activeColor?: ColorsNameType;
  background?: ColorsNameType;
  name: string;
  size?: IUISizing | number;
  style?: StyleProp<ViewStyle | FlexStyle | TextStyle>;
  active?: boolean;
  disabled?: boolean;
  disabledColor?: ColorsNameType;
}

function Icon({
  color = ICON_COLOR_DEFAULT,
  name = ICON_DEFAULT,
  size = ICON_SIZE_DEFAULT,
  style = null,
  active = false,
  activeColor = ICON_COLOR_ACTIVE,
  disabled = false,
  disabledColor = ICON_COLOR_DISABLED,
  ...common
}: IIcon) {
  const { font: iconFont, name: iconName, ratio = 1 } =
    ICON_MAP[name] || ICON_MAP[ICON_DEFAULT];

  const sizeNumeric = getNumericSize(size, ICON_SIZES, ICON_SIZE_DEFAULT);

  const iconColor = getIconColor({
    color,
    active,
    activeColor,
    disabled,
    disabledColor,
  });
  const realSize = sizeNumeric * ratio;
  const iconStyles: any = [];
  const containerStyles: any = [styles.container];
  const extraStyles = getPropStyles(common);
  const Component = Fonts[iconFont];

  if (extraStyles?.length) {
    containerStyles.push(...extraStyles);
  }

  if (style) {
    containerStyles.push(style);
  }

  return (
    <View style={containerStyles}>
      <Component
        name={iconName}
        size={realSize}
        color={iconColor}
        style={iconStyles}
      />
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
});

export default Icon;

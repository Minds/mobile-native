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
import { ICON_SIZES } from '~/styles/Tokens';
import { ColorsNameType } from '~/styles/Colors';
import { getPropStyles, getPropColor } from '~base/helpers/styles';

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

export interface IIcon {
  color?: ColorsNameType;
  name?: string;
  size?: string;
  style?: StyleProp<ViewStyle | FlexStyle | TextStyle>;
  active?: boolean;
}

// ICON_SIZES

export default function Icon({
  color = 'SecondaryText',
  name,
  size = 'medium',
  style = null,
  active = false,
  ...extra
}: IIcon) {
  if (!name || !ICON_MAP[name]) {
    return null;
  }

  const { font: iconFont, name: iconName, ratio } = ICON_MAP[name];
  const sizeNumeric = ICON_SIZES[size];
  const iconColor = getPropColor(color, active);
  const realSize = sizeNumeric * (ratio || 1);
  const iconStyles: any = [];
  const containerStyles: any = [styles.container];
  const extraStyles = getPropStyles(extra);
  const Component = Fonts[iconFont];
  console.log(active);

  console.log(iconColor);

  if (!Component) {
    console.log(name);
  }

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

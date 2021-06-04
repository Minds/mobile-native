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
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import ICON_MAP from './map';
import { SPACING } from '~/styles/Tokens';
import ThemedStyles, { useStyleFromProps } from '~/styles/ThemedStyles';

const Fonts = {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  IonIcon,
  EvilIcons,
  Fontisto,
  Entypo,
};

type IIcon = {
  color?: string;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle | FlexStyle | TextStyle>;
};

export default function Icon({
  color = ThemedStyles.getColor('primary_text'),
  name,
  size = SPACING.L * 2,
  style = {},
  ...extra
}: IIcon) {
  const propsStyle = useStyleFromProps(extra);

  if (!name || !ICON_MAP[name]) {
    return null;
  }
  const { font: iconFont, name: iconName, ratio } = ICON_MAP[name];
  const realSize = size * (ratio || 1);
  const iconStyles = [
    ratio && {
      marginLeft: (size - realSize) / 2,
      marginTop: (size - realSize) / 2,
    },
  ];

  const Component = Fonts[iconFont];

  return (
    <View
      style={[
        styles.container,
        {
          height: size,
          width: size,
        },
        style,
        propsStyle,
      ]}>
      <Component
        name={iconName}
        size={realSize}
        color={color}
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

import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  labelText: string;
  linkText: string;
  labelStyle?: any;
  linkStyle?: any;
  containerStyle?: any;
  onLinkPress: () => void;
};

const MenuSubtitleWithButton = ({
  labelText,
  linkText,
  labelStyle,
  linkStyle,
  containerStyle,
  onLinkPress,
}: PropsType) => {
  const theme = ThemedStyles.style;

  return (
    <View
      style={[theme.rowJustifySpaceBetween, theme.marginTop3x, containerStyle]}>
      <Text style={[styles.subTitle, theme.colorSecondaryText, labelStyle]}>
        {labelText}
      </Text>
      <Text
        style={[styles.manage, theme.link, linkStyle]}
        onPress={onLinkPress}>
        {linkText}
      </Text>
    </View>
  );
};

export default MenuSubtitleWithButton;

const styles = StyleSheet.create({
  subTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    letterSpacing: 1.7,
  },
  manage: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
  },
});

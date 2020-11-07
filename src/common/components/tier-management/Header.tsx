import React from 'react';
import { StyleSheet } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../services/i18n.service';
import MenuSubtitleWithButton from '../menus/MenuSubtitleWithButton';

type HeaderPropsType = {
  labelText: string;
  onLinkPress: () => void;
};

const Header = ({ onLinkPress, labelText }: HeaderPropsType) => {
  const theme = ThemedStyles.style;
  return (
    <MenuSubtitleWithButton
      labelText={labelText}
      labelStyle={[styles.label, theme.colorSecondaryText]}
      linkText={i18n.t('settings.addTier')}
      linkStyle={[styles.link, theme.colorLink, theme.paddingRight2x]}
      containerStyle={[
        theme.paddingHorizontal4x,
        theme.marginBottom4x,
        theme.alignCenter,
      ]}
      onLinkPress={onLinkPress}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    letterSpacing: 0,
  },
  link: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    letterSpacing: 0,
    textDecorationLine: 'none',
  },
});

export default Header;

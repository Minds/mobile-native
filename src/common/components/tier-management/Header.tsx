import React from 'react';
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
      linkText={i18n.t('settings.addTier')}
      containerStyle={[
        theme.paddingHorizontal4x,
        theme.marginBottom4x,
        theme.alignCenter,
      ]}
      onLinkPress={onLinkPress}
    />
  );
};

export default Header;

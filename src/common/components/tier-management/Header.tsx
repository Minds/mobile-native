import React from 'react';

import MenuSubtitleWithButton from '../menus/MenuSubtitleWithButton';
import sp from '~/services/serviceProvider';

type HeaderPropsType = {
  labelText: string;
  onLinkPress: () => void;
};

const Header = ({ onLinkPress, labelText }: HeaderPropsType) => {
  const theme = sp.styles.style;
  return (
    <MenuSubtitleWithButton
      labelText={labelText}
      linkText={sp.i18n.t('settings.addTier')}
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

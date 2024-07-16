import React from 'react';

import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

const Empty = () => {
  const theme = sp.styles.style;
  return (
    <MText
      style={[
        theme.fullWidth,
        theme.fontXL,
        theme.textCenter,
        theme.paddingTop4x,
        theme.colorSecondaryText,
      ]}>
      {sp.i18n.t('wallet.transactionsEmpty')}
    </MText>
  );
};

export default Empty;

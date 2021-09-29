import React from 'react';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../../common/services/i18n.service';
import MText from '../../../../common/components/MText';

const Empty = () => {
  const theme = ThemedStyles.style;
  return (
    <MText
      style={[
        theme.fullWidth,
        theme.fontXL,
        theme.textCenter,
        theme.paddingTop4x,
        theme.colorSecondaryText,
      ]}>
      {i18n.t('wallet.transactionsEmpty')}
    </MText>
  );
};

export default Empty;

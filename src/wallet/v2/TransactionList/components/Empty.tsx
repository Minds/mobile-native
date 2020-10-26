import React from 'react';
import { Text } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../../common/services/i18n.service';

const Empty = () => {
  const theme = ThemedStyles.style;
  return (
    <Text
      style={[
        theme.fullWidth,
        theme.fontXL,
        theme.textCenter,
        theme.paddingTop4x,
        theme.colorSecondaryText,
      ]}>
      {i18n.t('wallet.transactionsEmpty')}
    </Text>
  );
};

export default Empty;

import React from 'react';
import { Text } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18nService from '../services/i18n.service';

const EmptyList = () => {
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
      {i18nService.t('emptyList')}
    </Text>
  );
};

export default EmptyList;

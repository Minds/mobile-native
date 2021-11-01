import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18nService from '../services/i18n.service';
import MText from './MText';

const EmptyList = () => {
  return (
    <View style={containerStyle}>
      <MText style={textStyle}>{i18nService.t('emptyList')}</MText>
    </View>
  );
};

const textStyle = ThemedStyles.combine(
  'fontXL',
  'textCenter',
  'colorSecondaryText',
);

const containerStyle = ThemedStyles.combine(
  {
    justifyContent: 'center',
  },
  'flexContainer',
  'alignCenter',
  'paddingBottom4x',
);

export default EmptyList;

import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import i18nService from '../services/i18n.service';
import MText from './MText';

const EmptyList = () => {
  return <MText style={style}>{i18nService.t('emptyList')}</MText>;
};

const style = ThemedStyles.combine(
  'fullWidth',
  'fontXL',
  'textCenter',
  'paddingTop4x',
  'colorSecondaryText',
);

export default EmptyList;

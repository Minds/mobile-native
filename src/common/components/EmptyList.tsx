import React from 'react';
import { View } from 'react-native';

import MText from './MText';
import sp from '~/services/serviceProvider';

const EmptyList = ({ text }: { text?: string }) => {
  return (
    <View style={containerStyle}>
      <MText style={textStyle}>{text || sp.i18n.t('emptyList')}</MText>
    </View>
  );
};

const textStyle = sp.styles.combine(
  'fontXL',
  'textCenter',
  'colorSecondaryText',
);

const containerStyle = sp.styles.combine(
  {
    justifyContent: 'center',
  },
  'flexContainer',
  'alignCenter',
  'paddingBottom4x',
);

export default EmptyList;

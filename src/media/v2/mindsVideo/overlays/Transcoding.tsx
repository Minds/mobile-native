import React from 'react';
import { View } from 'react-native';

import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

const Transcoding = () => {
  return (
    <View style={containerStyle}>
      <MText style={errorTextStyle}>
        {sp.i18n.t('transcodingMediaDisplay')}
      </MText>
    </View>
  );
};

const errorTextStyle = sp.styles.combine('fontL', 'colorPrimaryText');
const containerStyle = sp.styles.combine(
  'positionAbsoluteTop',
  'bgSecondaryBackground',
  'padding2x',
  'opacity75',
  'fullWidth',
  'alignCenter',
);

export default Transcoding;

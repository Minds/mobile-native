import React from 'react';
import { View } from 'react-native';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import MText from '../../../../common/components/MText';

const Transcoding = () => {
  return (
    <View style={containerStyle}>
      <MText style={errorTextStyle}>{i18n.t('transcodingMediaDisplay')}</MText>
    </View>
  );
};

const errorTextStyle = ThemedStyles.combine('fontL', 'colorPrimaryText');
const containerStyle = ThemedStyles.combine(
  'positionAbsoluteTop',
  'bgSecondaryBackground',
  'padding2x',
  'opacity75',
  'fullWidth',
  'alignCenter',
);

export default Transcoding;

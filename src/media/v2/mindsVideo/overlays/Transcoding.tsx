import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import MText from '../../../../common/components/MText';

const Transcoding = () => {
  return (
    <View style={[styles.overlayContainer, styles.overlayContainerTransparent]}>
      <MText style={errorTextStyle}>{i18n.t('transcodingMediaDisplay')}</MText>
    </View>
  );
};

const errorTextStyle = ThemedStyles.combine('fontM', 'colorSecondaryText');

export default Transcoding;

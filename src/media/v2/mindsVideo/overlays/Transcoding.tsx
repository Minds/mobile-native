import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';

const Transcoding = () => {
  return (
    <View style={[styles.overlayContainer, styles.overlayContainerTransparent]}>
      <Text style={errorTextStyle}>{i18n.t('transcodingMediaDisplay')}</Text>
    </View>
  );
};

const errorTextStyle = ThemedStyles.combine('fontM', 'colorSecondaryText');

export default Transcoding;

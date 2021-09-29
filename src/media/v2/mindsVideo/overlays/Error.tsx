import React from 'react';
import { styles } from './styles';
import i18n from '../../../../common/services/i18n.service';
import { View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import MText from '../../../../common/components/MText';

const Error = () => {
  return (
    <View style={styles.overlayContainer}>
      <MText style={ThemedStyles.style.colorSecondaryText}>
        {i18n.t('errorMediaDisplay')}
      </MText>
    </View>
  );
};

export default Error;

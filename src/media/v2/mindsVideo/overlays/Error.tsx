import React from 'react';
import { styles } from './styles';
import i18n from '../../../../common/services/i18n.service';
import { View, Text } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';

const Error = () => {
  return (
    <View style={styles.overlayContainer}>
      <Text style={ThemedStyles.style.colorSecondaryText}>
        {i18n.t('errorMediaDisplay')}
      </Text>
    </View>
  );
};

export default Error;

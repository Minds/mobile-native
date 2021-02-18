import React from 'react';
import { View, Text } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';

export default function DisabledStoreFeature({ style }) {
  const theme = ThemedStyles.style;
  return (
    <View style={[theme.centered, style]}>
      <Text style={[theme.fontL, theme.textCenter]}>
        {i18n.t('postCantBeShown')}
      </Text>
    </View>
  );
}

import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import MText from './MText';

export default function DisabledStoreFeature({ style }) {
  const theme = ThemedStyles.style;
  return (
    <View style={[theme.centered, style]}>
      <MText style={[theme.fontL, theme.textCenter]}>
        {i18n.t('postCantBeShown')}
      </MText>
    </View>
  );
}

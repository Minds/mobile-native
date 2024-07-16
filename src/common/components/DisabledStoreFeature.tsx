import React from 'react';
import { View } from 'react-native';

import MText from './MText';
import sp from '~/services/serviceProvider';

export default function DisabledStoreFeature({ style }) {
  const theme = sp.styles.style;
  return (
    <View style={[theme.centered, style]}>
      <MText style={[theme.fontL, theme.textCenter]}>
        {sp.i18n.t('postCantBeShown')}
      </MText>
    </View>
  );
}

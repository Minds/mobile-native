import React from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import MText from '../../common/components/MText';

import sp from '../../services/serviceProvider';

export default function DeletedRemind() {
  const theme = sp.styles.style;
  return (
    <View style={[theme.columnAlignCenter, theme.padding4x]}>
      <Icon
        name="information-circle"
        size={35}
        style={[theme.colorSecondaryText, theme.paddingRight]}
      />
      <MText style={theme.fontM}>{sp.i18n.t('deletedRemind')}</MText>
    </View>
  );
}

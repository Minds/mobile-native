import React from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import MText from '../../common/components/MText';
import i18nService from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

export default function DeletedRemind() {
  const theme = ThemedStyles.style;
  return (
    <View style={[theme.columnAlignCenter, theme.padding4x]}>
      <Icon
        name="md-information-circle"
        size={35}
        style={[theme.colorSecondaryText, theme.paddingRight]}
      />
      <MText style={theme.fontM}>{i18nService.t('deletedRemind')}</MText>
    </View>
  );
}
